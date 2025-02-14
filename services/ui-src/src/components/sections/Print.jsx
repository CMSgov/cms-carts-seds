import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@cmsgov/design-system";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
// components
import Title from "../layout/Title";
import Section from "../layout/Section";
// utils
import statesArray from "../utils/statesArray";
import { loadEnrollmentCounts, loadSections } from "../../actions/initial";
import { apiLib } from "../../util/apiLib";

/**
 * Generate data and load entire form based on user information
 *
 * @returns {JSX.Element}
 * @constructor
 */
const Print = () => {
  const dispatch = useDispatch();
  const [formData, currentUser, name] = useSelector(
    (state) => [
      state.formData,
      state.stateUser.currentUser,
      state.stateUser.name,
    ],
    shallowEqual
  );
  const search = useLocation().search;
  const searchParams = new URLSearchParams(search);
  const stateInitials = searchParams.get("state");
  const stateName =
    name || statesArray.find(({ value }) => value === stateInitials)?.label;
  const formYear = searchParams.get("year");
  const sectionId = searchParams.get("sectionId");
  const subsectionId = searchParams.get("subsectionId");

  const openPdf = (basePdf) => {
    const byteCharacters = atob(basePdf);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const file = new Blob([byteArray], { type: "application/pdf;base64" });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  const getPdfFriendlyDocument = async () => {
    // get html element and remove noscript tag
    const html = document.querySelector("html");
    html.querySelector("noscript")?.remove();

    document.querySelectorAll("input").forEach((element) => {
      if (element.type === "text") {
        element.style.height = "50px";
      }
    });
    document.querySelectorAll("button").forEach((element) => {
      if (element.title !== "Print") {
        element.remove();
      }
    });

    if (!document.querySelector("base")) {
      const base = document.createElement("base");
      base.href = `https://${window.location.host}`;
      document.querySelector("head").prepend(base);
    }

    const htmlString = document
      .querySelector("html")
      .outerHTML.replaceAll(`’`, `'`)
      .replaceAll(`‘`, `'`)
      .replaceAll(`”`, `"`)
      .replaceAll(`“`, `"`)
      .replaceAll("\u2013", "-")
      .replaceAll("\u2014", "-");

    const base64String = btoa(unescape(encodeURIComponent(htmlString)));
    const opts = {
      body: {
        encodedHtml: base64String,
      },
    };

    const res = await apiLib.post("/print_pdf", opts);
    openPdf(res.data);
  };
  // Load formData via side effect
  useEffect(() => {
    // Create function to call data to prevent return data from useEffect
    const retrieveUserData = async () => {
      // Get user details
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const selectedYear = urlParams.get("year");
      let stateCode;
      if (currentUser.state.id) {
        stateCode = currentUser.state.id;
      } else {
        stateCode = urlParams.get("state");
      }

      // Start Spinner
      dispatch({ type: "CONTENT_FETCHING_STARTED" });

      // Pull data based on user details
      await Promise.all([
        dispatch(loadSections({ stateCode, selectedYear })),
        dispatch(loadEnrollmentCounts({ stateCode, selectedYear })),
      ]);

      // End isFetching for spinner
      dispatch({ type: "CONTENT_FETCHING_FINISHED" });
    };

    //NOTE: Every time setAuthTimeout is called, it causes the useEffect to re-run even after data is retrieved
    if (!formData.length) {
      // Call async function to load data
      retrieveUserData();
    }
  }, [currentUser]);

  const sections = [];

  // Check if formData has values
  if (formData !== undefined && formData.length !== 0) {
    sections.push(<Title urlStateName={stateName} />);

    if (sectionId) {
      // Add section to sections array
      sections.push(
        <Section
          data-testid="print-section"
          sectionId={sectionId}
          subsectionId={subsectionId}
          readonly="false"
          printView="true"
        />
      );
    } else {
      // Loop through each section to get sectionId
      /* eslint-disable no-plusplus */
      for (let i = 0; i < formData.length; i++) {
        const sectionId = formData[i].contents.section.id;

        // Loop through subsections to get subsectionId
        /* eslint-disable no-plusplus */
        for (
          let j = 0;
          j < formData[i].contents.section.subsections.length;
          j++
        ) {
          const subsectionId = formData[i].contents.section.subsections[j].id;

          // Add section to sections array
          sections.push(
            <Section
              data-testid="print-section"
              sectionId={sectionId}
              subsectionId={subsectionId}
              readonly="false"
              printView="true"
            />
          );
        }
      }
    }
  }

  // Return sections with wrapper div and print dialogue box
  return (
    <div className="print-all">
      <div className="print-directions">
        <p>Click below to print full CARTS report shown here</p>
        <Button
          className="ds-c-button--solid ds-c-button--large print-all-btn"
          onClick={getPdfFriendlyDocument}
          title="Print"
        >
          <FontAwesomeIcon icon={faPrint} /> Print
        </Button>
      </div>
      <Helmet>
        <title>
          {stateName} CARTS FY{formYear} Report
        </title>
        <meta name="author" content="CMS" />
        <meta name="subject" content="Annual CARTS Report" />
      </Helmet>
      {sections}
      <Button
        className="ds-c-button--solid ds-c-button--large print-all-btn"
        onClick={getPdfFriendlyDocument}
        title="Print"
      >
        <FontAwesomeIcon icon={faPrint} /> Print
      </Button>
    </div>
  );
};

export default Print;
