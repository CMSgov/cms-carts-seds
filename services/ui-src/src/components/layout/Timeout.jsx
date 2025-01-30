import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
//components
import { Dialog } from "@cmsgov/design-system";
//auth
import {
  refreshCredentials,
  updateTimeout,
  useUser,
} from "../../hooks/authHooks";

const calculateTimeLeft = (expiresAt) => {
  if (!expiresAt) return 0;
  return (new Date(expiresAt).valueOf() - Date.now()) / 1000;
};

const Timeout = () => {
  const { showTimeout, expiresAt } = useSelector((state) => state.stateUser);
  const { logout } = useUser();
  const history = useHistory();

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiresAt));

  useEffect(() => {
    const unlisten = history.listen(() => {
      updateTimeout();
    });

    if (!showTimeout) return;
    // eslint-disable-next-line no-unused-vars
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(expiresAt));
    }, 500);
    return () => {
      unlisten();
      clearInterval(timer);
    };
  });

  const logoutClick = () => {
    logout();
  };
  const refreshAuth = async () => {
    await refreshCredentials();
  };

  if (!showTimeout) return <></>;

  const expired = new Date(expiresAt).valueOf() < Date.now();
  const body = expired
    ? "You have been logged out due to inactivity. Please log in again."
    : `Due to inactivity, you will be logged out in ${Math.floor(
        timeLeft
      )} seconds.`;
  const logOutText = expired ? "Log In" : "Log Out";
  return (
    <>
      <Dialog
        isOpen={showTimeout}
        onExit={refreshAuth}
        data-testid="timeout-dialog"
        heading="You are about to be logged out."
        actions={[
          <button
            className="ds-c-button ds-u-margin-right--1"
            disabled={expired}
            key="Stay Logged In"
            aria-label="Stay Logged In"
            onClick={refreshAuth}
            data-testid="timeout-stay-logged-in"
          >
            Stay Logged In
          </button>,
          <button
            className="ds-c-button ds-c-button--solid ds-u-margin-right--1"
            key="Log Out"
            aria-label={logOutText}
            onClick={logoutClick}
            data-testid="timeout-log-out"
          >
            {logOutText}
          </button>,
        ]}
      >
        {body}
      </Dialog>
    </>
  );
};

export default Timeout;
