import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { UserProvider, useUser } from "./hooks/authHooks";
import { PostLogoutRedirect } from "./components/layout/PostLogoutRedirect";
import AppRoutes from "./AppRoutes";
import { fireTealiumPageView } from "./util/tealium";
import "font-awesome/css/font-awesome.min.css";
import "./styles/app.scss";

function App() {
  const { pathname, key } = useLocation();
  const { user } = useUser();

  // fire tealium page view on route change
  useEffect(() => {
    fireTealiumPageView(user, window.location.href, pathname);
  }, [key, pathname, user]);

  return (
    <div id="app-wrapper">
      <UserProvider>
        <Routes>
          <Route path="*" element={<AppRoutes />} />
          <Route path="/postLogout" element={<PostLogoutRedirect />} />
        </Routes>
      </UserProvider>
    </div>
  );
}
export default App;
