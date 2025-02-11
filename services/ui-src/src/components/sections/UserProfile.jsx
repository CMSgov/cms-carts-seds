import React from "react";
import { useSelector } from "react-redux";

const UserProfile = () => {
  const currentUser = useSelector((state) => state.stateUser.currentUser);
  return (
    <div className="page-info ds-l-container ds-content">
      <div className="ds-l-col--12">
        <header>
          <h1>User Profile</h1>
        </header>
        <main className="main">
          If any information is incorrect, please contact the{" "}
          <a href="mailto:mdct_help@cms.hhs.gov">mdct_help@cms.hhs.gov</a>.
          <div className="profile-information">
            <div>
              <div>EUA Id: </div>
              <div>{currentUser.username}</div>
            </div>
            <div>
              <div>Name: </div>
              <div>
                {currentUser.firstname} {currentUser.lastname}
              </div>
            </div>
            <div>
              <div>Email: </div>
              <div>{currentUser.email}</div>
            </div>
            <div>
              <div>Role: </div>
              <div>{currentUser.role}</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserProfile;
