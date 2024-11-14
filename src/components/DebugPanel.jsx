import React, { useRef, useEffect } from "react";
import { styles } from "../styles/workflowStyles";

const DebugPanel = ({ logs }) => {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  if (!logs.length) return null;

  return (
    <div style={styles.debugPanel} ref={scrollRef}>
      <div style={styles.debugPanelHeader}>
        <h3 style={styles.debugPanelTitle}>Debug Log:</h3>
        <button
          onClick={() => {
            if (bottomRef.current) {
              bottomRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
          style={styles.debugPanelScrollButton}
        >
          Scroll to Latest
        </button>
      </div>

      {logs.map((log, index) => (
        <div
          key={index}
          style={{
            ...styles.debugLogEntry,
            ...(index === logs.length - 1 ? styles.lastDebugLogEntry : {}),
          }}
        >
          {log}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  );
};

export default DebugPanel;
