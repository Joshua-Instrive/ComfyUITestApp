// src/styles/layoutStyles.js
export const layoutStyles = {
  // Login Form Styles
  loginContainer: {
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    padding: "1rem",
  },
  loginBox: {
    width: "100%",
    maxWidth: "28rem",
    backgroundColor: "white",
    borderRadius: "0.5rem",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    padding: "2rem",
  },
  loginHeader: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  loginTitle: {
    fontSize: "1.875rem",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "0.5rem",
  },
  loginSubtitle: {
    fontSize: "0.875rem",
    color: "#6b7280",
  },
  loginForm: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },
  loginError: {
    backgroundColor: "#fee2e2",
    color: "#b91c1c",
    padding: "0.75rem",
    borderRadius: "0.25rem",
    textAlign: "center",
  },
  loginInput: {
    width: "100%",
    padding: "0.75rem",
    borderRadius: "0.375rem",
    border: "1px solid #d1d5db",
    fontSize: "0.875rem",
    outline: "none",
  },
  loginButton: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "0.375rem",
    fontSize: "0.875rem",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },

  // Authenticated Layout Styles
  layoutContainer: {
    minHeight: "100vh",
    backgroundColor: "#f3f4f6",
  },
  navbar: {
    backgroundColor: "white",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
  },
  navContent: {
    maxWidth: "64rem",
    margin: "0 auto",
    padding: "0.75rem 1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navTitle: {
    fontSize: "1.25rem",
    fontWeight: "600",
    color: "#111827",
  },
  logoutButton: {
    fontSize: "0.875rem",
    color: "#4b5563",
    padding: "0.5rem 1rem",
    borderRadius: "0.375rem",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    transition: "color 0.2s",
  },
  mainContent: {
    maxWidth: "64rem",
    margin: "0 auto",
    padding: "2rem 1rem",
  },
};
