import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faFileAlt } from "@fortawesome/free-solid-svg-icons";
import axios from "../../../authenticatedAxios";
import { saveAs } from "file-saver";
import PropTypes from "prop-types";
/**
 *
 * @param {boolean} show Only display download template text boolean is true.
 * Otherwise show default text.
 */
export const DownloadDrawer = ({ show, currentYear, tempState }) => {
  return show ? (
    <div className="ds-l-row">
      <div className="updates ds-l-col--12">
        <h4>Updates from Central Office</h4>
        <div className="update ds-l-row">
          <div className="icon ds-l-col--2">
            <div className="icon-inner">
              <FontAwesomeIcon icon={faFileAlt} />
            </div>
          </div>
          <div className="update-contents ds-l-col--10">
            <div className="title-date ds-l-row">
              <div className="title ds-l-col--7">
                <h3>FY20 template is ready for download</h3>
              </div>
              <div className="date ds-l-col--">AUG, 15, 2019</div>
            </div>
            <p>
              Welcome to CARTS! We’ve incorporated feedback from several states
              to bring you a better CARTS experience. Contact{" "}
              <a href="mailto:mdct_helpdesk@cms.hhs.gov?subject=CARTS Help request">
                mdct_helpdesk@cms.hhs.gov
              </a>{" "}
              with any questions.
            </p>
            <div className="download">
              <button
                className="ds-c-button ds-c-button--primary"
                onClick={() => downloadTemplate(tempState, currentYear)}
              >
                <span>Download template</span>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <p className="ds-u-margin-bottom--2">
      Welcome to CARTS! We’ve incorporated feedback from several states to bring
      you a better CARTS experience. Contact{" "}
      <a href="mailto:mdct_helpdesk@cms.hhs.gov?subject=CARTS Help request">
        mdct_helpdesk@cms.hhs.gov
      </a>{" "}
      with any questions.
    </p>
  );
};
DownloadDrawer.propTypes = {
  show: PropTypes.any,
  currentYear: PropTypes.any,
  tempState: PropTypes.any,
};
const downloadTemplate = async (tempState, currentYear) => {
  const response = await axios.post(
    `${window.env.API_POSTGRES_URL}/api/v1/download_template`,
    {
      tempState: tempState,
      currentYear: currentYear,
    }
  );

  console.log(response);

  saveAs(b64toBlob(response.data), "template.zip");
};

const b64toBlob = (b64Data, contentType = "", sliceSize = 512) => {
  const byteCharacters = atob(b64Data);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return blob;
};
