import React from "react";
import { styles } from "../styles/workflowStyles";

const WorkflowEditor = ({ workflow, onChange }) => {
  const handleChange = (e) => {
    const result = validateWorkflowJSON(e.target.value);
    if (!result.isValid) {
      setError(result.error);
    } else {
      setError(null);
      onChange(result.workflow);
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
