import React, { useEffect } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Button, Dialog } from "@cmsgov/design-system";
import { useNavigate } from "react-router-dom";
// components
import PageInfo from "./PageInfo";
import FormActions from "./FormActions";
// utils
import { format } from "date-fns";
import { loadForm } from "../../actions/initial";
import { certifyAndSubmit } from "../../actions/certify";
import {
  getCurrentReportStatus,
  selectIsFormEditable,
} from "../../store/selectors";
import useModal from "../../hooks/useModal";
// types
import { AppRoles } from "../../types";
import PropTypes from "prop-types";

const Submit = ({ openCertifyConfirmation }) => (
  <>
    <h3>Ready to certify and submit?</h3>
    <p>
      Double check that everything in your CARTS report is accurate. You won’t
      be able to make any edits after submitting, unless you send a request to
      CMS to uncertify your report.
    </p>
    <p>
      Once you’ve reviewed your report, certify that it’s accurate and in
      compliance with Title XXI of the Social Security Act (Section 2109(a) and
      Section 2108(e)).
    </p>
    <Button
      data-testid="certifySubmit"
      onClick={openCertifyConfirmation}
      variation="solid"
    >
      Certify and Submit
    </Button>
  </>
);

Submit.propTypes = { openCertifyConfirmation: PropTypes.func.isRequired };

const Thanks = ({ done: doneDispatch, submitterUsername }) => {
  const lastSave = useSelector(
    (state) =>
      getCurrentReportStatus(
        state.reportStatus,
        state.formData,
        state.stateUser,
        state.global.formYear
      ).lastChanged
  );
  const formattedDate = lastSave ? format(lastSave, "PPP") : "";
  const formattedTime = lastSave ? format(lastSave, "p") : "";
  return (
    <>
      <h3 data-testid={"certifyThankYou"}>
        Thank you for submitting your CARTS report!
      </h3>
      <p>
        Submitted on {formattedDate} at {formattedTime} by {submitterUsername}.
      </p>
      <h3>What to expect next</h3>
      <p>You‘ll hear from CMS if they have any questions about your report.</p>
      <Button onClick={doneDispatch} variation="solid">
        Return Home
      </Button>
    </>
  );
};

Thanks.propTypes = {
  done: PropTypes.func.isRequired,
  submitterUsername: PropTypes.string.isRequired,
};

const CertifyAndSubmit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isShowing, toggleModal } = useModal();
  const [isCertified, submitterUsername, currentUserRole, state] = useSelector(
    (state) => [
      !selectIsFormEditable(
        state.reportStatus,
        state.formData,
        state.stateUser,
        state.global.formYear
      ),
      getCurrentReportStatus(
        state.reportStatus,
        state.formData,
        state.stateUser,
        state.global.formYear
      ).username,
      state.stateUser.currentUser.role,
      state.stateUser.abbr,
    ],
    shallowEqual
  );

  useEffect(() => {
    dispatch(loadForm(state));
  }, [submitterUsername]);

  const confirmCertifyAction = () => {
    dispatch(certifyAndSubmit());
    toggleModal();
  };

  const doneClick = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="section-basic-info ds-l-col--9 content">
      <main className="main">
        {isShowing && (
          <Dialog
            isShowing={isShowing}
            onExit={toggleModal}
            heading="Certify and Submit this Report?"
            actions={[
              <button
                className="ds-c-button ds-u-margin-right--1"
                key="Review Report"
                aria-label="Review Report"
                onClick={toggleModal}
              >
                Review Report
              </button>,
              <button
                className="ds-c-button ds-c-button--solid ds-u-margin-right--1"
                key="Confirm Certify"
                aria-label="Confirm Certify and Submit"
                onClick={confirmCertifyAction}
              >
                Confirm Certify and Submit
              </button>,
            ]}
          >
            You won’t be able to make any edits after submitting, unless you
            send a request to CMS to uncertify your report
          </Dialog>
        )}
        <PageInfo />
        {currentUserRole === AppRoles.STATE_USER && <h2>Certify and Submit</h2>}
        {isCertified ? (
          <Thanks done={doneClick} submitterUsername={submitterUsername} />
        ) : (
          <Submit openCertifyConfirmation={toggleModal} />
        )}
      </main>
      <FormActions />
    </div>
  );
};

export default CertifyAndSubmit;
