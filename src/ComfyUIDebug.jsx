import React, { useState } from "react";
import { ComfyUIDebugClient } from "./debug-client";

const ComfyUIDebug = () => {
  const [logs, setLogs] = useState([]);
  const [serverStatus, setServerStatus] = useState(null);

  const runTests = async () => {
    const client = new ComfyUIDebugClient();
    setLogs([]);

    // Override console.log to capture debug output
    const originalLog = console.log;
    console.log = (...args) => {
      setLogs((prev) => [...prev, args.join(" ")]);
      originalLog(...args);
    };

    try {
      setServerStatus("testing");
      await client.testConnection();
      await client.checkServerStatus();
    } catch (error) {
      setServerStatus("error");
    }

    // Restore original console.log
    console.log = originalLog;
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "20px" }}>ComfyUI Connection Debug</h1>

      <button
        onClick={runTests}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          marginBottom: "20px",
          cursor: "pointer",
        }}
      >
        Run Debug Tests
      </button>

      <div
        style={{
          backgroundColor: "#f5f5f5",
          padding: "15px",
          borderRadius: "4px",
          fontFamily: "monospace",
          whiteSpace: "pre-wrap",
        }}
      >
        {logs.map((log, index) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComfyUIDebug;
