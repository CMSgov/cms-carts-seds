import React from "react";
import { Route, Switch } from "react-router-dom";
import CMSHomepage from "../sections/homepage/CMSHomepage";
import InvokeSection from "../utils/InvokeSection";
import SaveError from "./SaveError";
import ScrollToTop from "../utils/ScrollToTop";
import Sidebar from "./Sidebar";
import Unauthorized from "./Unauthorized";

const CMSHome = () => (
  <>
    <SaveError />
    <ScrollToTop />
    <Switch>
      <Route exact path="/" component={CMSHomepage} />
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
      {/* Add routes from admin that should be unauthorized for cms users */}
      <Route
        path={[
          "/role_user_assoc",
          "/state_assoc",
          "/role_jobcode_assoc",
          "/users",
        ]}
        component={Unauthorized}
      />
    </Switch>
  </>
);

export default CMSHome;
