import React, { useState } from "react";
import { validateWorkflowJSON } from "../lib/errorUtils";
import { styles } from "../styles/workflowStyles";

const WorkflowEditor = ({ workflow, onChange }) => {
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const jsonString = e.target.value;

    try {
      // First check if it's even valid JSON
      JSON.parse(jsonString);

      // Then validate the workflow structure
      const result = validateWorkflowJSON(jsonString);

      if (!result.isValid) {
        setError(result.error);
        // Still update the parent with the raw text so user can continue editing
        onChange(jsonString);
      } else {
        setError(null);
        onChange(jsonString);
      }
    } catch (err) {
      setError(`Invalid JSON format: ${err.message}`);
      // Still update the parent with the raw text so user can continue editing
      onChange(jsonString);
    }
  };

  return (
    <div style={styles.jsonEditor}>
      <h3
        style={{
          fontSize: "1.125rem",
          fontWeight: "600",
          marginBottom: "0.5rem",
        }}
      >
        Workflow JSON
      </h3>

      <textarea
        style={{
          ...styles.textarea,
          borderColor: error ? "#ef4444" : "#ccc",
        }}
        value={
          typeof workflow === "string"
            ? workflow
            : JSON.stringify(workflow, null, 2)
        }
        onChange={handleChange}
        placeholder="Paste your workflow JSON here..."
      />

      {error && (
        <div
          style={{
            color: "#ef4444",
            fontSize: "0.875rem",
            marginTop: "0.5rem",
            padding: "0.5rem",
            backgroundColor: "#fef2f2",
            borderRadius: "0.25rem",
            border: "1px solid #fee2e2",
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default WorkflowEditor;
