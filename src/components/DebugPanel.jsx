import React from "react";
import { styles } from "../styles/workflowStyles";

const DebugPanel = ({ logs }) => {
  if (!logs.length) return null;

  return (
    <div style={styles.debugPanel}>
      <h3 className="text-sm font-semibold mb-2">Debug Log:</h3>
      {logs.map((log, index) => (
        <div key={index} className="text-xs text-gray-600">
          {log}
        </div>
      ))}
    </div>
  );
};

export default DebugPanel;
