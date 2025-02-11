import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
//components
import { Button, TextField } from "@cmsgov/design-system";
//utils
import {
  recordFileInDatabaseAndGetUploadUrl,
  uploadFileToS3,
  getFileDownloadUrl,
  getUploadedFiles,
  deleteUploadedFile,
} from "../../util/fileApi";
import { setAnswerEntry } from "../../actions/initial";
//types
import PropTypes from "prop-types";
import { REPORT_STATUS, AppRoles } from "../../types";

const UploadComponent = ({ question, ...props }) => {
  // eslint-disable-next-line no-unused-vars
  const [blockFileSubmission, setBlockFileSubmission] = useState(true);
  const [loadedFiles, setLoadedFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [displayUploadedFiles, setDisplayUploadedFiles] = useState(false);
  const [uploadedFilesRetrieved, setUploadedFilesRetrieved] = useState(false);
  const [inputErrors, setInputErrors] = useState();

  const [user, year, stateCode, reportStatus] = useSelector(
    (state) => [
      state.stateUser.currentUser,
      state.formData[0].contents.section.year,
      state.formData[0].contents.section.state,
      state.reportStatus,
    ],
    shallowEqual
  );

  const dispatch = useDispatch();

  useEffect(() => {
    viewUploaded();
  }, []);

  const isFileTypeAllowed = (extension) => {
    const allowedFileTypes = [
      "jpg",
      "jpeg",
      "png",
      "document",
      "sheet",
      "pdf",
      "docx",
      "doc",
      "xltx",
      "xlsx",
      "xls",
    ];
    return allowedFileTypes.indexOf(extension) > -1;
  };

  const isFileNameValid = (fileName) => {
    let fileNameRegex = new RegExp("^[0-9a-zA-z-_.]*$");
    return fileNameRegex.test(fileName);
  };

  const submitUpload = async () => {
    const questionId = question.id;

    for (const uploadedFile of loadedFiles) {
      const presignedPostData = await recordFileInDatabaseAndGetUploadUrl(
        year,
        stateCode,
        questionId,
        uploadedFile
      );

      await uploadFileToS3(presignedPostData, uploadedFile);

      const filteredStateFiles = loadedFiles.filter(
        (e) => e.name !== uploadedFile.name
      );

      setLoadedFiles(filteredStateFiles);
      setBlockFileSubmission(true);

      if (displayUploadedFiles === false) {
        await viewUploaded();
      } else {
        await retrieveUploadedFiles();
      }
    }
  };

  const viewUploaded = async () => {
    if (displayUploadedFiles === false) {
      setDisplayUploadedFiles(true);
      await retrieveUploadedFiles();
    } else {
      // *** make sure container for files is NOT displayed
      setDisplayUploadedFiles(false);
    }
  };

  const removeFile = (evt) => {
    const filteredStateFiles = loadedFiles.filter(
      (e) => e.name !== evt.target.name
    );
    setLoadedFiles(filteredStateFiles);
  };

  const downloadFile = async (fileId) => {
    window.location.href = await getFileDownloadUrl(year, stateCode, fileId);
  };

  const retrieveUploadedFiles = async () => {
    const questionId = question.id;

    setUploadedFilesRetrieved(false);

    const uploadedFiles = await getUploadedFiles(year, stateCode, questionId);
    // *** hide the loading preloader
    setUploadedFilesRetrieved(true);
    setUploadedFiles(uploadedFiles);
  };

  const deleteFile = async (fileId) => {
    await deleteUploadedFile(year, stateCode, fileId);

    await retrieveUploadedFiles();
  };

  /*
   * TODO: when one file errors, the others are loaded but the error stays
   * to duplicate: try loading all 9
   */
  const validateFileByExtension = (event) => {
    if (event.target.files.length > 0) {
      const filesArray = event.target.files; // All files selected by a user
      const filePayload = [];
      const maxFileSize = 25; // in MB

      let errorString = "";

      for (const file of filesArray) {
        const uploadName = file.name;
        const mediaSize = file.size / 1024 / 1024;
        const mediaExtension = uploadName.split(".").pop();
        const fileTypeAllowed = isFileTypeAllowed(mediaExtension);
        const fileNameInvalid = !isFileNameValid(uploadName);

        if (fileTypeAllowed === true) {
          if (fileNameInvalid === true) {
            errorString = errorString.concat(
              `The file name (${uploadName}) contains invalid characters. Only the following characters are allowed: A-Z, a-z, 0-9, -, _, and .`
            );
          } else if (mediaSize <= maxFileSize) {
            filePayload.push(file);
          } else {
            errorString = errorString.concat(
              `${uploadName} exceeds ${maxFileSize}MB file size maximum`
            );
          }
        } else {
          errorString = errorString.concat(
            "Your file is not an approved file type. See below for a list of approved file types."
          );
        }
      }
      setInputErrors(errorString || null);
      setLoadedFiles(
        loadedFiles ? [...loadedFiles, ...filePayload] : [...filePayload]
      );
      setBlockFileSubmission(false);

      if (errorString === "") {
        dispatch(setAnswerEntry(event.target.name, filePayload));
      }
    }
  };

  let submissionsAllowed = false;
  if (year && stateCode) {
    const stateReportStatus = reportStatus[`${stateCode}${year}`];
    submissionsAllowed =
      stateReportStatus.status !== REPORT_STATUS.certified &&
      user.role === AppRoles.STATE_USER &&
      !props?.disabled;
  }

  return (
    <div>
      <div>
        <TextField
          accept=".jpg, .png, .docx, .doc, .pdf, .xlsx, .xls, .xlsm"
          className="file_upload"
          disabled={!submissionsAllowed}
          errorMessage={inputErrors}
          hint="Files must be in one of these formats: PDF, Word, Excel, or a valid image (jpg or png)."
          label="Click Choose Files and make your selection(s) then click Upload to attach your files. Click View Uploaded to see a list of all files attached here."
          multiple
          name={question.id}
          onChange={validateFileByExtension}
          type="file"
        />
      </div>

      {loadedFiles?.map((file, i) => (
        <div key={file.name}>
          <a href={encodeURIComponent(file.name)} download>
            {file.name}
          </a>
          <Button
            data-testid={`unstage-${i}`}
            name={file.name}
            onClick={removeFile}
            size="small"
          >
            x
          </Button>
        </div>
      ))}

      <Button
        onClick={submitUpload}
        size="small"
        disabled={!submissionsAllowed}
        className=""
      >
        Upload
      </Button>

      <Button onClick={viewUploaded} size="small" className="margin-left-1em">
        {displayUploadedFiles ? `Hide Uploaded` : `View Uploaded`}
      </Button>

      {displayUploadedFiles && uploadedFiles?.length > 0 ? (
        <table
          data-testid="uploadedFilesContainer"
          key={"uploadedFilesContainer"}
          summary={
            question.label || "This is a table for the CARTS Application"
          }
        >
          <tbody>
            {!uploadedFilesRetrieved ? (
              <tr>
                <td>
                  <img
                    // eslint-disable-next-line
                    src={`/img/bouncing_ball.gif`}
                    alt="Retrieving uploaded files... Please wait..."
                  />
                  <br />
                  <br />
                  Loading... Please wait...
                </td>
              </tr>
            ) : (
              uploadedFiles.map((file) => {
                return (
                  <tr key={file.aws_filename}>
                    <td>{file.filename}</td>
                    <td>
                      <Button
                        size="small"
                        onClick={() => downloadFile(file.fileId)}
                      >
                        Download
                      </Button>
                    </td>
                    <td>
                      <Button
                        size="small"
                        onClick={() => deleteFile(file.fileId)}
                        disabled={!submissionsAllowed}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      ) : null}
    </div>
  );
};

UploadComponent.propTypes = {
  question: PropTypes.any,
};

export default UploadComponent;
