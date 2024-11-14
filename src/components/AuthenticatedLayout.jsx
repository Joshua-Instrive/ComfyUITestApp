import React from "react";
import { logout } from "../lib/authUtils";
import { layoutStyles } from "../styles/layoutStyles";

const AuthenticatedLayout = ({ children }) => {
  return (
    <div style={layoutStyles.layoutContainer}>
      <nav style={layoutStyles.navbar}>
        <div style={layoutStyles.navContent}>
          <h1 style={layoutStyles.navTitle}>ComfyUI Workflow Manager</h1>
          <button onClick={logout} style={layoutStyles.logoutButton}>
            Sign Out
          </button>
        </div>
      </nav>
      <main style={layoutStyles.mainContent}>{children}</main>
    </div>
  );
};

export default AuthenticatedLayout;
