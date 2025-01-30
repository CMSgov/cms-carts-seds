import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

//components
import { Button } from "@cmsgov/design-system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
//selectors
import { selectSectionsForNav } from "../../store/selectors";
//types
import { AppRoles } from "../../types";

const idToUrl = (id) => `/sections/${id.replace(/-/g, "/")}`;

const FormNavigation = () => {
  const history = useHistory();
  const location = useLocation();

  const [formData, role] = useSelector(
    (state) => [state.formData, state.stateUser?.currentUser?.role],
    shallowEqual
  );

  const sections = selectSectionsForNav(formData);

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
    role !== AppRoles.CMS_ADMIN &&
    role !== AppRoles.INTERNAL_USER &&
    role !== AppRoles.HELP_DESK &&
    role !== AppRoles.CMS_APPROVER &&
    role !== AppRoles.CMS_USER
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
                data-testid="previous"
              >
                <FontAwesomeIcon icon={faAngleLeft} /> Previous
              </Button>
            </div>
          ) : null}

          {nextUrl ? (
            <div className="form-button next">
              <Button
                type="submit"
                className="ds-c-button ds-c-button--solid"
                onClick={() => {
                  history.push(nextUrl);
                }}
                data-testid="next"
                href="#main-content"
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

export default FormNavigation;
