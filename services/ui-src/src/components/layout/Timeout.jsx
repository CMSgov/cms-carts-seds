import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
//components
import { Dialog } from "@cmsgov/design-system";
//auth
import {
  IDLE_WINDOW,
  PROMPT_AT,
  refreshCredentials,
  updateTimeout,
  useUser,
} from "../../hooks/authHooks";
import { add } from "date-fns";

const calculateRemainingSeconds = (expiresAt) => {
  if (!expiresAt) return 0;
  return (new Date(expiresAt).valueOf() - Date.now()) / 1000;
};

const Timeout = () => {
  const { logout } = useUser();
  const [timeLeft, setTimeLeft] = useState((IDLE_WINDOW - PROMPT_AT) / 1000);
  const [showTimeout, setShowTimeout] = useState(false);
  const [timeoutPromptId, setTimeoutPromptId] = useState();
  const [timeoutForceId, setTimeoutForceId] = useState();
  const [updateTextIntervalId, setUpdateTextIntervalId] = useState();
  const location = useLocation();

  useEffect(() => {
    setTimer();
    return () => {
      clearTimers();
    };
  }, [location]);

  const setTimer = () => {
    const expiration = add(Date.now(), { seconds: IDLE_WINDOW / 1000 });
    if (timeoutPromptId) {
      clearTimers();
    }
    updateTimeout();
    setShowTimeout(false);

    // Set the initial timer for when a prompt appears
    const promptTimer = window.setTimeout(() => {
      // Once the prompt appears, set timers for logging out, and for updating text on screen
      setTimeLeft(calculateRemainingSeconds(expiration));
      setShowTimeout(true);
      const forceLogoutTimer = window.setTimeout(() => {
        clearTimers();
        logout();
      }, IDLE_WINDOW - PROMPT_AT);
      const updateTextTimer = window.setInterval(() => {
        setTimeLeft(calculateRemainingSeconds(expiration));
      }, 500);
      setTimeoutForceId(forceLogoutTimer);
      setUpdateTextIntervalId(updateTextTimer);
    }, PROMPT_AT);
    setTimeoutPromptId(promptTimer);
  };

  const clearTimers = () => {
    clearTimeout(timeoutPromptId);
    clearTimeout(timeoutForceId);
    clearTimeout(updateTextIntervalId);

    //clear interval function call
    setUpdateTextIntervalId(undefined);
  };

  const logoutClick = () => {
    logout();
  };
  const refreshAuth = async () => {
    await refreshCredentials();
    setShowTimeout(false);
    setTimer();
  };

  const expired = new Date(timeLeft).valueOf() <= 0;
  const formatTime = (time) => {
    if (time < 0) return `0 seconds`;
    return `${Math.floor(time)} seconds`;
  };

  return (
    <>
      {showTimeout && (
        <Dialog
          isShowing={showTimeout}
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
              onClick={logoutClick}
              data-testid="timeout-log-out"
            >
              Log out
            </button>,
          ]}
        >
          Due to inactivity, you will be logged out in {formatTime(timeLeft)}.
          Choose to stay logged in or log out. Otherwise, you will be logged out
          automatically.
        </Dialog>
      )}
    </>
  );
};

export default Timeout;
