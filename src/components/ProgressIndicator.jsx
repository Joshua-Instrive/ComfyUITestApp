import React from "react";
import { styles } from "../styles/workflowStyles";

const ProgressIndicator = ({ progress }) => {
  if (!progress) return null;

  return (
    <div style={styles.progressContainer}>
      {progress.type === "progress" && (
        <div style={styles.progressBar}>
          <div style={styles.progressBarTrack}>
            <div
              style={{
                ...styles.progressBarFill,
                width: `${(progress.value / progress.max) * 100}%`,
              }}
            />
          </div>
          <span style={styles.progressText}>
            {Math.round((progress.value / progress.max) * 100)}%
          </span>
        </div>
      )}
      {progress.type === "executing" && (
        <p style={styles.progressStatus}>Processing node: {progress.node}</p>
      )}
    </div>
  );
};

export default ProgressIndicator;
