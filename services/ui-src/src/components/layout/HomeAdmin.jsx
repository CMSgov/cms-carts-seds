import React from "react";
import { Link, Route, Switch } from "react-router-dom";
// components
import FormTemplates from "./FormTemplates";
import CMSHomepage from "../sections/homepage/CMSHomepage";
import Sidebar from "./Sidebar";
// utils
import InvokeSection from "../utils/InvokeSection";
import ScrollToTop from "../utils/ScrollToTop";

const AdminHome = () => {
  return (
    <>
      <ScrollToTop />
      <Route exact path="/">
        <main className="homepage ds-l-col--12">
          <div className="ds-l-container">
            <div className="ds-l-row">
              <h1 className="page-title ds-u-margin-bottom--0">
                CHIP Annual Reporting Template System (CARTS)
              </h1>
            </div>
            <div className="ds-l-row">
              <ul>
                <li>
                  <Link to="/templates">Generate Form Base Templates</Link>
                </li>
              </ul>
            </div>
            <div className="cmslist">
              <CMSHomepage />
            </div>
          </div>
        </main>
      </Route>
      <Switch>
        <Route
          exact
          path="/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker"
        >
          <Sidebar />
          <InvokeSection />
        </Route>
        <Route path="/views/sections/:state/:year/:sectionOrdinal">
          <Sidebar />
          <InvokeSection />
        </Route>
        <Route exact path="/state-reports" component={CMSHomepage} />
        <Route exact path="/templates" component={FormTemplates} />
      </Switch>
    </>
  );
};

export default AdminHome;
