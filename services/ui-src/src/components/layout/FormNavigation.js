import React from "react";
import PropTypes from "prop-types";
import { Button } from "@cmsgov/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { selectSectionsForNav } from "../../store/selectors";
import { UserRoles } from "../../types";

const idToUrl = (id) => `/sections/${id.replace(/-/g, "/")}`;

const FormNavigation = (props) => {
  const { history, location, sections, role } = props;

  const items = [];
  sections.forEach((section) => {
    if (section.subsections.length < 2) {
      items.push(idToUrl(section.id));
    } else {
      section.subsections.forEach((subsection) => {
        items.push(idToUrl(subsection.id));
      });
    }
  });

  // Pull year from current location
  const year = location.pathname.split("/")[2];

  // If admin, DO NOT ADD
  if (
    role !== UserRoles.ADMIN &&
    role !== UserRoles.BO &&
    role !== UserRoles.CO
  ) {
    // Add certify and submit page to items array
    items.push(`/sections/${year}/certify-and-submit`);
  }

  // Get current url
  let currentUrl = window.location.pathname;

  // Get currentUrl if in format /views/sections/STATE/YEAR/SECTION
  let currentArray = currentUrl.split("/");
  let viewType = false;
  let state;

  // Get current url if views format
  if (currentArray[1] === "views") {
    // Set viewType to true for use in building next/prev links
    viewType = true;
    // Remove empty first (empty) item and "views"
    currentArray.splice(0, 2);
    // Store then remove state
    state = currentArray[1];
    currentArray.splice(1, 1);
    // Create string
    currentUrl = "/" + currentArray.join("/");
  }

  // Get index of url in items array
  const currentIndex = items.indexOf(currentUrl);

  // Determine previous index
  let previousUrl = items[currentIndex - 1];

  if (viewType === true && items[currentIndex - 1] !== undefined) {
    let previousArray = items[currentIndex - 1].split("/");
    previousArray.splice(1, 1, state);
    previousUrl = "/views/sections" + previousArray.join("/");
  }

  // Determine next index
  let nextUrl = items[currentIndex + 1];
  if (viewType === true && items[currentIndex + 1] !== undefined) {
    let nextArray = items[currentIndex + 1].split("/");
    nextArray.splice(1, 1, state);
    nextUrl = "/views/sections" + nextArray.join("/");
  }

  return (
    <section className="nav-buttons">
      <div className="ds-l-row">
        <div className="ds-l-col form-buttons">
          {previousUrl ? (
            <div className="form-button previous">
              <Button
                type="submit"
                className="ds-c-button"
                onClick={() => {
                  history.push(previousUrl);
                }}
              >
                <FontAwesomeIcon icon={faAngleLeft} /> Previous
              </Button>
            </div>
          ) : null}

          {nextUrl ? (
            <div className="form-button next">
              <Button
                type="submit"
                className="ds-c-button ds-c-button--primary"
                onClick={() => {
                  history.push(nextUrl);
                }}
              >
                Next <FontAwesomeIcon icon={faAngleRight} />
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};

FormNavigation.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  sections: PropTypes.array.isRequired,
  role: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]).isRequired,
};

const mapStateToProps = (state) => ({
  sections: selectSectionsForNav(state),
  role: state.stateUser?.currentUser?.role,
});

export default connect(mapStateToProps)(withRouter(FormNavigation));
