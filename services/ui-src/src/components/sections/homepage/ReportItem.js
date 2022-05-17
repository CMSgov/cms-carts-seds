import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { theUncertify } from "../../../actions/uncertify";
import { theAccept } from "../../../actions/accept";
import { UserRoles } from "../../../types";
import { Dialog } from "@cmsgov/design-system";
import useModal from "../../../hooks/useModal";

const ReportItem = ({
  link1Text,
  link1URL,
  name,
  statusText,
  statusURL,
  theUncertify: uncertifyAction,
  theAccept: acceptAction,
  userRole,
  year,
  username,
  lastChanged,
}) => {
  const anchorTarget = "_self";
  const stateCode = link1URL.toString().split("/")[3];
  const stateYear = link1URL.toString().split("/")[4];
  const { isShowing, toggleModal } = useModal();
  let theDateTime = "";
  let tempTime = "";
  let stateUser = false;
  if (userRole === UserRoles.STATE) {
    stateUser = true;
  }
  if (lastChanged && lastChanged.toString().includes("T")) {
    theDateTime = lastChanged.split("T");
    tempTime = theDateTime[1].split(":");
    if (Number(tempTime[0]) >= 12) {
      // convert from military time
      if (Number(tempTime[0] === "12")) {
        theDateTime[1] = theDateTime[1].substring(0, 8) + " pm";
      } else {
        theDateTime[1] =
          String(Number(tempTime[0]) - 12) +
          ":" +
          tempTime[1] +
          ":" +
          tempTime[2].substring(0, 2) +
          " pm";
      }
    } else {
      if (Number(tempTime[0] === "00")) {
        theDateTime[1] =
          "12:" + tempTime[1] + ":" + tempTime[2].substring(0, 2) + " am";
      } else {
        theDateTime[1] = theDateTime[1].substring(0, 8) + " am";
      }
    }
  }

  const uncertify = () => {
    uncertifyAction(stateCode, stateYear);
    toggleModal();
    window.location.reload(false);
  };

  const accept = () => {
    if (window.confirm("Are you sure to accept this record?")) {
      acceptAction(stateCode, stateYear);
      // Need to send out a notification ticket #OY2-2416

      //Getting the new statuses to update the page
      window.location.reload(false);
    }
  };

  return (
    <>
      {!stateUser && (
        <div className="report-item ds-l-row">
          <div className="name ds-l-col--1">{year}</div>
          <div className="name ds-l-col--2">{name}</div>
          <div
            className={`status ds-l-col--2 ${
              statusText === "Overdue" && `alert`
            }`}
          >
            {statusURL ? <a href={statusURL}> {statusText} </a> : statusText}
          </div>
          <div className="actions ds-l-col--3">
            {theDateTime[0]} at {theDateTime[1]} by {username}
          </div>
          <div className="actions ds-l-col--auto">
            <Link to={link1URL} target={anchorTarget}>
              {link1Text}
            </Link>
          </div>
          {/* TODO: Remove userRole === UserRoles.ADMIN */}
          {statusText === "Certified and Submitted" &&
          (userRole === UserRoles.CO ||
            userRole === UserRoles.BO ||
            userRole === UserRoles.ADMIN) ? (
            <div className="actions ds-l-col--auto">
              <button className="link" onClick={toggleModal}>
                Uncertify
              </button>
            </div>
          ) : null}
          {/* TODO: Remove userRole === UserRoles.ADMIN */}
          {statusText === "Certified and Submitted" &&
          (userRole === UserRoles.CO || userRole === UserRoles.ADMIN) ? (
            <div className="actions ds-l-col--auto">
              <Link onClick={accept} variation="primary">
                Accept
              </Link>
            </div>
          ) : null}
          {isShowing && (
            <Dialog
              isShowing={isShowing}
              onExit={toggleModal}
              heading="Uncertify this Report?"
              actions={[
                <button
                  className="ds-c-button ds-c-button--primary ds-u-margin-right--1"
                  key="primary"
                  onClick={uncertify}
                >
                  Yes, Uncertify
                </button>,
              ]}
            >
              Uncertifying will send this CARTS report back to the state user
              who submitted it
            </Dialog>
          )}
        </div>
      )}
      {stateUser && (
        <div className="report-item ds-l-row">
          <div className="name ds-l-col--2">{name}</div>
          <div
            className={`status ds-l-col--2 ${
              statusText === "Overdue" && `alert`
            }`}
          >
            {statusURL ? <a href={statusURL}> {statusText} </a> : statusText}
          </div>
          <div className="actions ds-l-col--3">
            {lastChanged && new Date(lastChanged)?.toLocaleDateString("en-US")}
          </div>
          <div className="actions ds-l-col--1">
            <Link to={link1URL} target={anchorTarget}>
              {link1Text}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

ReportItem.propTypes = {
  theUncertify: PropTypes.func.isRequired,
  theAccept: PropTypes.func.isRequired,
  link1Text: PropTypes.string,
  link1URL: PropTypes.string,
  name: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  statusText: PropTypes.string,
  statusURL: PropTypes.string,
  userRole: PropTypes.string,
  year: PropTypes.number.isRequired,
  username: PropTypes.string,
  lastChanged: PropTypes.string,
};
ReportItem.defaultProps = {
  link1Text: "View",
  link1URL: "#",
  statusText: "Missing Status",
  statusURL: "",
};

const mapState = (state) => ({
  user: state.reportStatus.username,
});

const mapDispatch = { theUncertify, theAccept };

export default connect(mapState, mapDispatch)(ReportItem);
