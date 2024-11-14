import React from "react";

const ProgressIndicator = ({ progress }) => {
  if (!progress) return null;

  return (
    <div className="mt-4 p-4 bg-gray-100 rounded-lg">
      {progress.type === "progress" && (
        <div className="flex items-center gap-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full"
              style={{ width: `${(progress.value / progress.max) * 100}%` }}
            ></div>
          </div>
          <span className="text-sm text-gray-600">
            {Math.round((progress.value / progress.max) * 100)}%
          </span>
        </div>
      )}
      {progress.type === "executing" && (
        <p className="text-sm text-gray-600">
          Processing node: {progress.node}
        </p>
      )}
    </div>
  );
};

export default ProgressIndicator;
