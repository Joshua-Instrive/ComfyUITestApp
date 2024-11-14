import React from "react";
import { styles } from "../styles/workflowStyles";

const WorkflowEditor = ({ workflow, onChange }) => {
  const handleChange = (e) => {
    try {
      const parsed = JSON.parse(e.target.value);
      onChange(parsed);
    } catch (error) {
      // Allow invalid JSON while typing
      onChange(e.target.value);
    }
  };

  return (
    <div style={styles.jsonEditor}>
      <h3 className="text-lg font-semibold mb-2">Workflow JSON</h3>
      <textarea
        style={styles.textarea}
        value={
          typeof workflow === "string"
            ? workflow
            : JSON.stringify(workflow, null, 2)
        }
        onChange={handleChange}
        placeholder="Paste your workflow JSON here..."
      />
    </div>
  );
};

export default WorkflowEditor;
