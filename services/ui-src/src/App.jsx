import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useUser } from "./hooks/authHooks";
import { PostLogoutRedirect } from "./components/layout/PostLogoutRedirect";
import AppRoutes from "./AppRoutes";
import Timeout from "./components/layout/Timeout";
import { fireTealiumPageView } from "./util/tealium";
import "font-awesome/css/font-awesome.min.css";
import "./styles/app.scss";
import { LocalLogins } from "components/sections/login/LocalLogins";

function App() {
  const { pathname, key } = useLocation();
  const { user, showLocalLogins, loginWithIDM } = useUser();

  // fire tealium page view on route change
  useEffect(() => {
    fireTealiumPageView(user, window.location.href, pathname);
  }, [key, pathname, user]);

  const authenticatedRoutes = (
    <>
      {user && (
        <div
          className={"App " + window.location.pathname.split("/")[1]}
          data-test="component-app"
        >
          <div className="app-content">
            <Timeout />
            <AppRoutes />
          </div>
        </div>
      )}
      {!user && showLocalLogins && (
        <main>
          <LocalLogins loginWithIDM={loginWithIDM} />;
        </main>
      )}
    </>
  );

  return (
    <div id="app-wrapper">
      <Routes>
        <Route path="*" element={authenticatedRoutes} />
        <Route path="/postLogout" element={<PostLogoutRedirect />} />
      </Routes>
    </div>
  );
}
export default App;
