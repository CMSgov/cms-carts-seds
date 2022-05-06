import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Autosave from "./Autosave";
import Logout from "./Logout";

class Header extends Component {
  constructor() {
    super();

    this.toggleUserNav = this.toggleUserNav.bind(this);
  }

  // eslint-disable-next-line
  toggleUserNav(e) {
    e.preventDefault();

    document.getElementById("menu-block").classList.toggle("open");
    document.getElementById("nav-user").classList.toggle("open");

    // Close menu when leaving focus
    const root = document.getElementById("root");
    root.addEventListener(
      "click",
      () => {
        document.getElementById("menu-block").classList.remove("open");
        document.getElementById("nav-user").classList.remove("open");
      },
      false
    );
  }

  render() {
    const { currentUser } = this.props;
    const { currentYear } = this.props;
    const { email } = currentUser;
    const isLoggedIn = !!currentUser.username;
    return (
      <div className="header" data-test="component-header">
        <div className="ds-l-container">
          <div className="ds-l-row header-row">
            <div className="site-title ds-l-col--4 ds-u-padding--2">
              <a href="/">CARTS-{currentYear}</a>
            </div>
            <div className="user-details ds-l-col--8 ds-u-padding--2">
              <div className="ds-l-row">
                <Autosave />
                {isLoggedIn && renderMenu(this.toggleUserNav, email)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
function renderMenu(toggleUserNav, email) {
  return (
    <div className="nav-user" id="nav-user">
      <RenderEmailMenuItem toggleUserNav={toggleUserNav} email={email} />
      <ul className="menu-block" id="menu-block">
        <li className="contact-us">
          <a href="mailto:mdct_help@cms.hhs.gov">Contact Us</a>
        </li>
        <li className="manage-account">
          <a href="/user/profile">Manage Account</a>
        </li>
        <li className="logout">
          <Logout />
        </li>
      </ul>
    </div>
  );
}
function RenderEmailMenuItem({ toggleUserNav, email }) {
  return (
    <ul className="user-email-button">
      <li>
        <a
          href="#menu"
          className="nav--dropdown__trigger"
          onClick={toggleUserNav}
        >
          {email}
        </a>
      </li>
    </ul>
  );
}

Header.propTypes = {
  currentUser: PropTypes.object.isRequired,
  currentYear: PropTypes.number.isRequired,
};

RenderEmailMenuItem.propTypes = {
  toggleUserNav: PropTypes.func.isRequired,
  email: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  currentUser: state.stateUser.currentUser,
  currentYear: state.global.currentYear,
});

export default connect(mapStateToProps)(Header);
