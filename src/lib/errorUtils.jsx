import React from "react";
import { styles } from "../styles/workflowStyles";

// lib/errorUtils.js
export const validateWorkflowJSON = (jsonString) => {
  try {
    // Basic JSON validation
    const parsed = JSON.parse(jsonString);

    // Schema validation
    const requiredProperties = ["class_type", "inputs"];
    const hasValidNodes = Object.values(parsed).every((node) =>
      requiredProperties.every((prop) => prop in node)
    );

    if (!hasValidNodes) {
      throw new Error(
        "Invalid workflow structure: Missing required node properties"
      );
    }

    // Validate node connections
    for (const [nodeId, node] of Object.entries(parsed)) {
      for (const [inputKey, inputValue] of Object.entries(node.inputs)) {
        if (Array.isArray(inputValue) && inputValue.length === 2) {
          const [sourceNodeId] = inputValue;
          if (!parsed[sourceNodeId]) {
            throw new Error(
              `Invalid node connection: Node ${sourceNodeId} not found`
            );
          }
        }
      }
    }

    return { isValid: true, workflow: parsed };
  } catch (error) {
    return {
      isValid: false,
      error: `Invalid workflow JSON: ${error.message}`,
    };
  }
};

export const handleApiError = async (response) => {
  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    let errorMessage;

    try {
      if (contentType && contentType.includes("application/json")) {
        const errorData = await response.json();
        errorMessage =
          errorData.error || errorData.message || "Unknown error occurred";
      } else {
        errorMessage = await response.text();
      }
    } catch (e) {
      errorMessage = `HTTP error ${response.status}`;
    }

    throw new Error(errorMessage);
  }
  return response;
};

export const ErrorBoundary = ({ children, onError }) => {
  const [hasError, setHasError] = React.useState(false);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    if (hasError) {
      onError?.(error);
    }
  }, [hasError, error, onError]);

  if (hasError) {
    return (
      <div style={styles.errorBoundary}>
        <h3 style={styles.errorBoundaryTitle}>Something went wrong</h3>
        <p style={styles.errorBoundaryMessage}>{error?.message}</p>
        <button
          onClick={() => setHasError(false)}
          style={styles.errorBoundaryButton}
        >
          Try again
        </button>
      </div>
    );
  }

  return children;
};
