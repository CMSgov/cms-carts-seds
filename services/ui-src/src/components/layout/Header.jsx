import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector, shallowEqual } from "react-redux";
// components
import { UsaBanner } from "@cmsgov/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import Autosave from "./Autosave";
import Logout from "./Logout";
//utils
import { getCurrentReportStatus } from "../../store/selectors";
//types
import { REPORT_STATUS, AppRoles } from "../../types";
// assets
import appLogo from "../../assets/images/MDCT_CARTS_2x.png";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [stateUser, formData, formYear, reportStatus] = useSelector(
    (state) => [
      state.stateUser,
      state.formData,
      state.global.formYear,
      state.reportStatus,
    ],
    shallowEqual
  );
  const { currentUser } = stateUser;
  const currentReportStatus = getCurrentReportStatus(
    reportStatus,
    formData,
    stateUser,
    formYear
  );
  const location = useLocation();

  const showAutoSaveOnReport = (location, currentUser, currentReportStatus) => {
    const { role } = currentUser;
    if (
      location.pathname.includes("/sections/") &&
      role === AppRoles.STATE_USER
    ) {
      switch (currentReportStatus.status) {
        case REPORT_STATUS.not_started:
        case REPORT_STATUS.in_progress:
        case REPORT_STATUS.uncertified:
          return true;
        default:
          return false;
      }
    }
    return false;
  };

  const shouldShowAutosave = showAutoSaveOnReport(
    location,
    currentUser,
    currentReportStatus
  );

  const closeDropDownMenu = () => {
    setIsMenuOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      if (isMenuOpen) {
        setIsMenuOpen(true);
        window.addEventListener("click", closeDropDownMenu);
      } else {
        window.removeEventListener("click", closeDropDownMenu);
      }
    }, 0);
  }, [isMenuOpen]);

  return (
    <div className="component-header" data-test="component-header">
      <UsaBanner
        data-testid={"usaBanner"}
        className={"usabanner-section-layout"}
      />
      <header className="header">
        <div className="ds-l-container">
          <div className="ds-l-row header-row">
            <div className="site-title ds-l-col--8 ds-u-padding-right--2">
              <Link
                to="/"
                className="ds-u-display--inline-block  ds-u-padding-top--1"
              >
                <img
                  id="carts-logo"
                  src={appLogo}
                  alt="Logo for Medicaid Data Collection Tool (MDCT): CHIP Annual Reporting Template System (CARTS)"
                />
              </Link>
            </div>
            <div className="user-details ds-l-col--4">
              <div
                className="user-details-container ds-l-row"
                data-testid={"userDetailsRow"}
              >
                {currentUser && (
                  <div
                    className="nav-user"
                    id="nav-user"
                    data-testid="headerDropDownMenu"
                  >
                    <ul className="user-email-button">
                      <li>
                        <a
                          data-testid={"headerDropDownMenuButton"}
                          href="#menu"
                          onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                          <FontAwesomeIcon icon={faUser} size="lg" />
                          My Account
                          {isMenuOpen ? (
                            <i
                              data-testid="headerDropDownChevUp"
                              className="fa fa-chevron-up"
                              aria-hidden="true"
                            ></i>
                          ) : (
                            <i
                              data-testid="headerDropDownChevDown"
                              className="fa fa-chevron-down"
                              aria-hidden="true"
                            ></i>
                          )}
                        </a>
                      </li>
                    </ul>
                    {isMenuOpen && (
                      <ul
                        data-testid="headerDropDownLinks"
                        className="menu-block open"
                        id="menu-block"
                      >
                        <li className="contact-us">
                          <a href="mailto:mdct_help@cms.hhs.gov">Contact Us</a>
                        </li>
                        <li className="manage-account">
                          <Link to="/user/profile">Manage Account</Link>
                        </li>
                        <li
                          className="logout"
                          data-testid="header-menu-option-log-out"
                        >
                          <Logout />
                        </li>
                      </ul>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {shouldShowAutosave && (
        <div className="save-container">
          <div className="ds-l-container">
            <div className="ds-l-row header-row">
              <div className="ds-l-col--12 ds-u-padding--2">
                <Autosave />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
