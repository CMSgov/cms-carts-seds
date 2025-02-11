import React from "react";
import { useFlags } from "launchdarkly-react-client-sdk";
//icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faMinus,
  faFileAlt,
} from "@fortawesome/free-solid-svg-icons";
//types
import PropTypes from "prop-types";

const TemplateDownload = ({ getTemplate }) => {
  const currentYear = useFlags().release2024 ? "2024" : "2023";

  return (
    <div className="ds-l-row">
      <div className="updates ds-l-col--12">
        <p className="update-title">Updates from Central Office</p>
        {useFlags().release2024 && (
          <div className="preamble ds-content">
            <p>
              Completing the Children’s Health Insurance Program (CHIP) Annual
              Report is required under sections 2108(a) and 2108(e) of the
              Social Security Act, and regulations at 42 CFR 457.750.
            </p>
            <p>
              Each state must assess their CHIP operations and overall progress
              in reducing the number of uninsured low-income children after each
              federal fiscal year.
            </p>
            <p>
              States must complete all relevant sections of the CHIP Annual
              Report Template System (CARTS) and certify their report by January
              1st. After review and acceptance by CMS, CHIP annual reports are
              published at{" "}
              <a href="https://www.medicaid.gov/chip/reports-evaluations/index.html">
                https://www.medicaid.gov/chip/reports-evaluations/index.html
              </a>
            </p>
          </div>
        )}
        <div className="update-date">
          {useFlags().release2024 ? "Oct 2024" : "Sept 2023"}
        </div>
        <div className="update ds-l-row">
          <div className="icon ds-l-col--2">
            <div className="icon-inner">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
          </div>
          <div className="update-contents ds-l-col--10">
            <div className="title">
              <h3>
                Your fiscal year {currentYear} template is ready for download
              </h3>
            </div>
            <p>
              Download your template for the current reporting period below.
              Please contact{" "}
              <a href="mailto:mdct_help@cms.hhs.gov?subject=CARTS Help request">
                mdct_help@cms.hhs.gov
              </a>{" "}
              with any questions.
            </p>
            <div className="download">
              <button
                className="ds-c-button ds-c-button--solid"
                onClick={() => getTemplate(currentYear)}
              >
                <span className="button-display">Download template</span>
                <span className="fa-layers fa-fw">
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    transform="up-2 right-2"
                  />
                  <FontAwesomeIcon
                    icon={faMinus}
                    transform="down-10 right-2"
                    size="sm"
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TemplateDownload.propTypes = {
  getTemplate: PropTypes.func.isRequired,
};

export default TemplateDownload;
