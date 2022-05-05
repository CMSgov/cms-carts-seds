import React, { useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { Button } from "@cmsgov/design-system-core";
import PropTypes from "prop-types";
import Title from "../layout/Title";
import Section from "../layout/Section";
import axios from "../../authenticatedAxios";
import statesArray from "../Utils/statesArray";
import { loadSections } from "../../actions/initial";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";

/**
 * Generate data and load entire form based on user information
 *
 * @param currentUser
 * @param state
 * @returns {JSX.Element}
 * @constructor
 */
const Print = ({ currentUser, state, name }) => {
  const dispatch = useDispatch();
  const search = useLocation().search;
  const stateInitials = new URLSearchParams(search).get("state");
  const stateName =
    name || statesArray.find(({ value }) => value === stateInitials)?.label;
  const formYear = new URLSearchParams(search).get("year");

  const openPdf = (basePdf) => {
    let byteCharacters = atob(basePdf);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let file = new Blob([byteArray], { type: "application/pdf;base64" });
    let fileURL = URL.createObjectURL(file);
    window.open(fileURL);
  };

  const getPdfFriendlyDocument = async () => {
    const noscriptTag = document.querySelector("noscript");
    if (noscriptTag) {
      noscriptTag.remove();
    }
    document.querySelectorAll("input").forEach((element) => {
      element.style.height = "50px";
    });
    document.querySelectorAll("button").forEach((element) => {
      if (element.title !== "Print") {
        element.remove();
      }
    });
    const htmlString = document
      .querySelector("html")
      .outerHTML.replaceAll(
        '<link href="',
        `<link href="https://${window.location.host}`
      )
      .replaceAll(`’`, `'`)
      .replaceAll(`‘`, `'`)
      .replaceAll(`”`, `"`)
      .replaceAll(`“`, `"`)
      .replaceAll("\u2013", "-")
      .replaceAll("\u2014", "-");
    const base64String = btoa(unescape(encodeURIComponent(htmlString)));
    const res = await axios.post("prince", {
      encodedHtml: base64String,
    });
    openPdf(res.data);
  };
  // Load formData via side effect
  useEffect(() => {
    // Create function to call data to prevent return data from useEffect
    const retrieveUserData = async () => {
      // Get user details
      const { stateUser } = state;
      // const stateCode = stateUser.abbr;
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const selectedYear = urlParams.get("year");
      let stateCode;
      if (stateUser.currentUser.state.id) {
        stateCode = stateUser.currentUser.state.id;
      } else {
        stateCode = urlParams.get("state");
      }

      // Start Spinner
      dispatch({ type: "CONTENT_FETCHING_STARTED" });

      // Pull data based on user details
      await Promise.all([dispatch(loadSections({ stateCode, selectedYear }))]);

      // End isFetching for spinner
      dispatch({ type: "CONTENT_FETCHING_FINISHED" });
    };

    // Call async function to load data
    retrieveUserData();
  }, [currentUser]);

  const sections = [];

  // Check if formData has values
  const { formData } = state;
  if (formData !== undefined && formData.length !== 0) {
    sections.push(<Title urlStateName={stateName} />);
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
            sectionId={sectionId}
            subsectionId={subsectionId}
            readonly="false"
          />
        );
      }
    }
  }

  // Return sections with wrapper div and print dialogue box
  return (
    <div className="print-all">
      <div className="print-directions">
        <p>Click below to print full CARTS report shown here</p>
        <Button
          className="ds-c-button--primary ds-c-button--large print-all-btn"
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
        className="ds-c-button--primary ds-c-button--large print-all-btn"
        onClick={getPdfFriendlyDocument}
        title="Print"
      >
        <FontAwesomeIcon icon={faPrint} /> Print
      </Button>
    </div>
  );
};

Print.propTypes = {
  state: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired,
  name: PropTypes.string,
};

const mapStateToProps = (state) => ({
  state,
  currentUser: state.stateUser,
  name: state.stateUser.name,
});

export default connect(mapStateToProps)(Print);
