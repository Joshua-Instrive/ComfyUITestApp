import React, { useState } from "react";
import { layoutStyles } from "../styles/layoutStyles";

const VALID_CREDENTIALS = {
  username: "admin",
  password: "comfy123",
};

const LoginForm = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      credentials.username === VALID_CREDENTIALS.username &&
      credentials.password === VALID_CREDENTIALS.password
    ) {
      const fakeToken = btoa(
        JSON.stringify({
          username: credentials.username,
          timestamp: Date.now(),
        })
      );
      localStorage.setItem("authToken", fakeToken);
      onLogin(fakeToken);
    } else {
      setError("Invalid credentials.");
    }
  };

  return (
    <div style={layoutStyles.loginContainer}>
      <div style={layoutStyles.loginBox}>
        <div style={layoutStyles.loginHeader}>
          <h2 style={layoutStyles.loginTitle}>ComfyUI Workflow Manager</h2>
          <p style={layoutStyles.loginSubtitle}>Please sign in to continue</p>
        </div>

        <form style={layoutStyles.loginForm} onSubmit={handleSubmit}>
          {error && <div style={layoutStyles.loginError}>{error}</div>}

          <input
            type="text"
            required
            style={layoutStyles.loginInput}
            placeholder="Username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />

          <input
            type="password"
            required
            style={layoutStyles.loginInput}
            placeholder="Password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />

          <button type="submit" style={layoutStyles.loginButton}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
