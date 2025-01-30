import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { Dialog } from "@cmsgov/design-system";
// utils
import { uncertifyReport } from "../../../actions/uncertify";
import useModal from "../../../hooks/useModal";
// types
import { AppRoles } from "../../../types";

const ReportItem = ({
  link1Text = "View",
  link1URL = "#",
  name,
  statusText = "Missing Status",
  userRole,
  year,
  username,
  lastChanged,
  timeZone,
}) => {
  const dispatch = useDispatch();
  const anchorTarget = "_self";
  const stateCode = link1URL.toString().split("/")[3];
  const stateYear = link1URL.toString().split("/")[4];
  const { dialogOpen, showModal, hideModal } = useModal();
  let lastEditedNote = "";
  const isStateUser = userRole === AppRoles.STATE_USER;

  if (lastChanged) {
    const date = new Date(lastChanged);
    // Using en-CA as they format the date to YYYY-MM-DD, HH:MM:SS where as en-US formats to DD/MM/YYYY, HH:MM:SS
    const time = new Intl.DateTimeFormat("en-CA", {
      hour12: true,
      second: "numeric",
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone,
    }).format(date);
    const splitTime = time.split(",");
    lastEditedNote = splitTime?.[1]
      ? `${splitTime[0]} at ${splitTime[1].trim()}`
      : `${splitTime[0]}`;
    lastEditedNote += username ? ` by ${username}` : "";
  }

  const uncertify = async () => {
    await dispatch(uncertifyReport(stateCode, stateYear));
    hideModal();
    window.location.reload(false);
  };

  const rolesThatUncertify = [
    AppRoles.CMS_ADMIN,
    AppRoles.CMS_USER,
    AppRoles.CMS_APPROVER,
  ];

  return (
    <>
      {!isStateUser && (
        <div className="report-item ds-l-row">
          <div className="name ds-l-col--1">{year}</div>
          <div className="name ds-l-col--2">{name}</div>
          <div className="status ds-l-col--2">{statusText}</div>
          <div className="actions ds-l-col--3">{lastEditedNote}</div>
          <div className="actions ds-l-col--auto">
            <Link
              to={link1URL}
              target={anchorTarget}
              aria-label={`${link1Text} ${name} ${year}`}
            >
              {link1Text}
            </Link>
            {statusText === "Certified and Submitted" &&
              rolesThatUncertify.includes(userRole) && (
                <span>
                  {" "}
                  <button
                    data-testid={"uncertifyButton"}
                    className="link"
                    onClick={showModal}
                  >
                    Uncertify
                  </button>
                </span>
              )}
          </div>

          <Dialog
            data-testid={"uncertifyModal"}
            onExit={hideModal}
            isOpen={dialogOpen}
            heading="Uncertify this Report?"
            actions={[
              <button
                className="ds-c-button ds-c-button--solid ds-u-margin-right--1"
                key="primary"
                onClick={uncertify}
                aria-label="Uncertify this Report"
              >
                Yes, Uncertify
              </button>,
            ]}
          >
            Uncertifying will send this CARTS report back to the state user who
            submitted it
          </Dialog>
        </div>
      )}
      {isStateUser && (
        <div className="report-item ds-l-row">
          <div className="name ds-l-col--2">{name}</div>
          <div className="status ds-l-col--2">{statusText}</div>
          <div className="actions ds-l-col--3">{lastEditedNote}</div>
          <div className="actions ds-l-col--1">
            <Link
              to={link1URL}
              target={anchorTarget}
              data-testid="report-action-button"
            >
              {link1Text}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

ReportItem.propTypes = {
  link1Text: PropTypes.string,
  link1URL: PropTypes.string.isRequired,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  statusText: PropTypes.string,
  userRole: PropTypes.string.isRequired,
  year: PropTypes.number.isRequired,
  username: PropTypes.string,
  lastChanged: PropTypes.string.isRequired,
  timeZone: PropTypes.string,
};

export default ReportItem;
