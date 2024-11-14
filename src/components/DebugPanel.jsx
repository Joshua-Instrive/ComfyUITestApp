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
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-semibold">Debug Log:</h3>
        <button
          onClick={() => {
            if (bottomRef.current) {
              bottomRef.current.scrollIntoView({ behavior: "smooth" });
            }
          }}
          className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Scroll to Latest
        </button>
      </div>

      {logs.map((log, index) => (
        <div
          key={index}
          className="text-xs text-gray-600 py-1 border-b border-gray-100 last:border-0"
        >
          {log}
        </div>
      ))}

      {/* Invisible element for auto-scrolling */}
      <div ref={bottomRef} />
    </div>
  );
};

export default DebugPanel;
