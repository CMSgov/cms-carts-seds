import React from "react";
import { Routes, Route } from "react-router-dom";
import CMSHomepage from "../sections/homepage/CMSHomepage";
import InvokeSection from "../utils/InvokeSection";
import SaveError from "./SaveError";
import ScrollToTop from "../utils/ScrollToTop";
import Sidebar from "./Sidebar";
import Unauthorized from "./Unauthorized";

const Section = () => (
  <>
    <Sidebar />
    <InvokeSection />
  </>
);

const CMSHome = () => (
  <>
    <SaveError />
    <ScrollToTop />
    <Routes>
      <Route path="/" element={<CMSHomepage />} />
      <Route
        path="/views/sections/:state/:year/:sectionOrdinal/:subsectionMarker"
        element={<Section />}
      />
      <Route
        path="/views/sections/:state/:year/:sectionOrdinal"
        element={<Section />}
      />
      {/* Add routes from admin that should be unauthorized for cms users */}
      <Route path={"/role_user_assoc"} element={Unauthorized} />
      <Route path={"/state_assoc"} element={Unauthorized} />
      <Route path={"/role_jobcode_assoc"} element={Unauthorized} />
      <Route path={"/users"} element={Unauthorized} />
    </Routes>
  </>
);

export default CMSHome;
