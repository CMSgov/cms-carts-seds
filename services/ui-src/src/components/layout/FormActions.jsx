import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
// components
import { Button } from "@cmsgov/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faWindowClose } from "@fortawesome/free-solid-svg-icons";
//types
import { AppRoles } from "../../types";

/**
 * Display available options for form (print)
 *
 * @returns {JSX.Element}
 * @constructor
 */
const FormActions = () => {
  const [currentUser, formYear] = useSelector(
    (state) => [state.stateUser.currentUser, state.global.formYear],
    shallowEqual
  );

  // Initialise printDialogeRef
  const printDialogeRef = useRef(null);

  // Get section IDs and subsection IDs for printing single section
  let searchParams = "";
  let sectionId = "";

  const role = currentUser.role;
  if (role == AppRoles.STATE_USER) {
    searchParams = document.location.pathname
      .toString()
      .replace("/sections/", "")
      .replace(formYear + "/", "");

    sectionId = formYear + "-" + searchParams.substring(0, 2);
  } else {
    const stateId = window.location.href.split("/")[5];
    searchParams = document.location.pathname
      .toString()
      .replace(`views/sections/${stateId}/`, "")
      .replace(formYear + "/", "");

    sectionId = formYear + "-" + searchParams.substring(1, 3);
  }

  let subsectionId = sectionId + "-";
  if (sectionId.slice(-2) === "03") {
    subsectionId += searchParams.slice(-1);
  } else {
    subsectionId += "a";
  }

  /**
   * Print dialogue box state
   * Defaults to false
   */
  const [printShow, setPrintShow] = useState(false);

  /**
   * If click occurs outside component, setPrintShow to false
   */
  const useOutsideAlerter = (ref) => {
    useEffect(() => {
      // if clicked on outside of element
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setPrintShow(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  };

  useOutsideAlerter(printDialogeRef);

  /**
   * Toggles printDialogue component display
   */
  const togglePrintDialogue = () => {
    setPrintShow(!printShow);
  };

  /**
   * Generates the URL to print a form.
   * @param {object} currentUser - the current user object
   * @param {string} formYear - the year associated with the report
   * @return {string} The URL string
   */
  const printFormUrl = (
    currentUser,
    formYear,
    sectionId = null,
    subsectionId = null
  ) => {
    let stateId = "";

    if (currentUser.role === AppRoles.STATE_USER) {
      stateId = currentUser.state.id;
    } else {
      stateId = window.location.href.split("/")[5];
    }

    let urlString = `/print?year=${formYear}&state=${stateId}`;

    if (sectionId) {
      urlString += `&sectionId=${sectionId}`;
    }

    if (subsectionId) {
      urlString += `&subsectionId=${subsectionId}`;
    }

    return urlString;
  };

  return (
    <section className="action-buttons">
      <div className="print-button">
        <Button
          className="ds-c-button--solid ds-c-button--small"
          onClick={togglePrintDialogue}
          title="Print"
          data-testid="print-show"
        >
          <FontAwesomeIcon icon={faPrint} /> Print
        </Button>
      </div>
      {printShow ? (
        <div className="print-dialogue" ref={printDialogeRef}>
          <div className="close">
            <Button
              className="ds-c-button--ghost ds-c-button--small"
              onClick={togglePrintDialogue}
              data-testid="print-hide"
              title="close"
            >
              <FontAwesomeIcon icon={faWindowClose} />
            </Button>
          </div>
          <h4 data-testid="print-title">Print</h4>
          <div className="print-options">
            <div className="print-page">
              <Button
                className="ds-c-button--solid ds-c-button--small"
                href={printFormUrl(
                  currentUser,
                  formYear,
                  sectionId,
                  subsectionId
                )}
                title="This Section"
                target="_blank"
                onClick={togglePrintDialogue}
                data-testid="print-page"
              >
                <FontAwesomeIcon icon={faPrint} /> This Section
              </Button>
            </div>
            <div className="print-form">
              <Button
                className="ds-c-button--solid ds-c-button--small"
                href={printFormUrl(currentUser, formYear)}
                title="Entire Form"
                target="_blank"
                onClick={togglePrintDialogue}
                data-testid="print-form"
              >
                <FontAwesomeIcon icon={faPrint} /> Entire Form
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default FormActions;
