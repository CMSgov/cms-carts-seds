import React from "react";
import { Link, Route, Routes } from "react-router-dom";
// components
import FormTemplates from "./FormTemplates";
import CMSHomepage from "../sections/homepage/CMSHomepage";
import Sidebar from "./Sidebar";
// utils
import InvokeSection from "../utils/InvokeSection";
import ScrollToTop from "../utils/ScrollToTop";

const AdminLanding = () => (
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
);

const Section = () => (
  <>
    <Sidebar />
    <InvokeSection />
  </>
);

const AdminHome = () => (
  <>
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<AdminLanding />} />
      <Route
        path="/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker"
        element={<Section />}
      />
      <Route
        path="/views/sections/:state/:year/:sectionOrdinal"
        element={<Section />}
      />

      <Route path="/state-reports" element={<CMSHomepage />} />
      <Route path="/templates" element={<FormTemplates />} />
    </Routes>
  </>
);

export default AdminHome;
