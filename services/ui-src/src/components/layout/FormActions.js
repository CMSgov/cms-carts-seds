import React, { useState, useEffect, useRef } from "react";
import { Button } from "@cmsgov/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import { connect, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import { UserRoles } from "../../types";

/**
 * Display available options for form (print)
 *
 * @returns {JSX.Element}
 * @constructor
 */
const FormActions = (props) => {
  // Initialise printDialogeRef
  const printDialogeRef = useRef(null);
  const { currentUser, formYear } = props;
  const dispatch = useDispatch();

  // Get section IDs and subsection IDs for printing single section
  let searchParams = document.location.pathname
    .toString()
    .replace("/sections/", "")
    .replace(formYear + "/", "");

  const sectionId = formYear + "-" + searchParams.substring(0, 2);
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

    if (currentUser.role === UserRoles.STATE) {
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
          className="ds-c-button--primary ds-c-button--small"
          onClick={togglePrintDialogue}
          title="Print"
        >
          <FontAwesomeIcon icon={faPrint} /> Print
        </Button>
      </div>
      {printShow ? (
        <div className="print-dialogue" ref={printDialogeRef}>
          <div className="close">
            <Button
              className="ds-c-button--transparent ds-c-button--small"
              onClick={togglePrintDialogue}
              title="close"
            >
              <FontAwesomeIcon icon={faWindowClose} />
            </Button>
          </div>
          <h4>Print</h4>
          <div className="print-options">
            <div className="print-page">
              <Button
                className="ds-c-button--primary ds-c-button--small"
                href={printFormUrl(
                  currentUser,
                  formYear,
                  sectionId,
                  subsectionId
                )}
                title="This Section"
                target="_blank"
                onClick={togglePrintDialogue}
              >
                <FontAwesomeIcon icon={faPrint} /> This Section
              </Button>
            </div>
            <div className="print-form">
              <Button
                className="ds-c-button--primary ds-c-button--small"
                href={printFormUrl(currentUser, formYear)}
                title="Entire Form"
                target="_blank"
                onClick={togglePrintDialogue}
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

FormActions.propTypes = {
  currentUser: PropTypes.object.isRequired,
  formYear: PropTypes.number.isRequired,
};

export const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
  formYear: state.global.formYear,
  printType: state.global.printType,
});

export default connect(mapStateToProps)(FormActions);
