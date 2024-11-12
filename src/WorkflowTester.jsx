import React, { useState, useEffect } from "react";

const styles = {
  container: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  header: {
    marginBottom: "20px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  textareaContainer: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500",
  },
  textarea: {
    width: "100%",
    height: "200px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#007bff",
    color: "white",
    padding: "10px 20px",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    width: "100%",
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  error: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  success: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    padding: "10px",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginTop: "20px",
  },
  nodeId: {
    fontSize: "14px",
    color: "#666",
    marginBottom: "8px",
  },
  image: {
    width: "100%",
    borderRadius: "4px",
  },
  spinner: {
    display: "inline-block",
    width: "16px",
    height: "16px",
    border: "2px solid #ffffff",
    borderTopColor: "transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    marginRight: "8px",
  },
  jsonPreview: {
    backgroundColor: "#f5f5f5",
    padding: "10px",
    borderRadius: "4px",
    marginTop: "10px",
    fontSize: "14px",
    whiteSpace: "pre-wrap",
  },
  debugInfo: {
    backgroundColor: "#f8f9fa",
    padding: "10px",
    borderRadius: "4px",
    marginTop: "10px",
    fontFamily: "monospace",
    whiteSpace: "pre-wrap",
    fontSize: "12px",
  },
  imageDebug: {
    border: "1px solid #ff4444",
    padding: "10px",
    margin: "10px 0",
    backgroundColor: "#fff8f8",
  },
  imageContainer: {
    marginTop: "20px",
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  rawData: {
    whiteSpace: "pre-wrap",
    fontSize: "12px",
    fontFamily: "monospace",
    backgroundColor: "#f5f5f5",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "4px",
  },
  debugPanel: {
    backgroundColor: "#f8f9fa",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "12px",
  },
};

class ComfyUIClient {
  constructor(host = "http://127.0.0.1:8188") {
    this.host = host;
    this.ws = null;
    this.debug = true;
  }

  log(message, data = null) {
    if (this.debug) {
      console.log(`[ComfyUI Client] ${message}`, data || "");
    }
  }

  async connect() {
    return new Promise((resolve, reject) => {
      const clientId = crypto.randomUUID();
      this.log(`Connecting with client ID: ${clientId}`);

      this.ws = new WebSocket(
        `ws://${this.host.split("//")[1]}/ws?clientId=${clientId}`
      );

      this.ws.onopen = () => {
        this.log("WebSocket connected successfully");
        resolve(clientId);
      };

      this.ws.onerror = (error) => {
        this.log("WebSocket connection failed", error);
        reject(error);
      };
    });
  }

  async queuePrompt(prompt, clientId) {
    const payload = {
      prompt: prompt,
      client_id: clientId,
    };

    this.log("Queueing prompt:", payload);

    const response = await fetch(`${this.host}/prompt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(JSON.stringify(error, null, 2));
    }

    const data = await response.json();
    this.log("Prompt queued:", data);
    return data;
  }

  trackProgress(promptId, onProgress) {
    return new Promise((resolve, reject) => {
      if (!this.ws) reject(new Error("WebSocket not connected"));

      this.ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);
        this.log("WebSocket message received:", message);

        switch (message.type) {
          case "progress":
            onProgress({
              type: "progress",
              value: message.data.value,
              max: message.data.max,
              node: message.data.node,
            });
            break;

          case "execution_cached":
            onProgress({
              type: "cached",
              nodes: message.data.nodes,
            });
            break;

          case "executing":
            if (
              message.data.node === null &&
              message.data.prompt_id === promptId
            ) {
              this.log("Execution completed");
              try {
                const history = await this.getHistory(promptId);
                resolve(history);
              } catch (err) {
                reject(err);
              }
            } else {
              onProgress({
                type: "executing",
                node: message.data.node,
              });
            }
            break;
        }
      };
    });
  }

  async getHistory(promptId) {
    const response = await fetch(`${this.host}/history/${promptId}`);
    if (!response.ok) {
      throw new Error(`History fetch failed: ${response.status}`);
    }
    const data = await response.json();
    this.log("History data:", data);
    return data;
  }

  getImageUrl(filename, subfolder, type = "output") {
    const params = new URLSearchParams({
      filename,
      subfolder: subfolder || "",
      type,
    });
    return `${this.host}/view?${params.toString()}`;
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

const WorkflowTester = () => {
  const [client, setClient] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [workflow, setWorkflow] = useState("");
  const [debugLog, setDebugLog] = useState([]);

  const addDebugLog = (message) => {
    setDebugLog((prev) => [
      ...prev,
      `${new Date().toISOString()} - ${message}`,
    ]);
  };

  useEffect(() => {
    const initClient = async () => {
      const newClient = new ComfyUIClient();
      try {
        const id = await newClient.connect();
        setClient(newClient);
        setClientId(id);
        addDebugLog("Connected to ComfyUI server");
      } catch (err) {
        setError("Failed to connect to ComfyUI server");
        addDebugLog(`Connection error: ${err.message}`);
      }
    };

    initClient();
    return () => {
      if (client) {
        client.disconnect();
        addDebugLog("Disconnected from ComfyUI server");
      }
    };
  }, []);

  const handleProgress = (progressData) => {
    addDebugLog(`Progress update: ${JSON.stringify(progressData)}`);
    setProgress(progressData);
  };

  const handleWorkflowTest = async () => {
    if (!client || !workflow || !clientId) return;

    setStatus("running");
    setError(null);
    setImages([]);
    setProgress(null);
    setDebugLog([]);

    try {
      addDebugLog("Starting workflow execution...");

      // Parse and validate workflow
      const workflowData = JSON.parse(workflow);
      addDebugLog("Workflow parsed successfully");

      // Queue the prompt
      const { prompt_id } = await client.queuePrompt(workflowData, clientId);
      addDebugLog(`Prompt queued with ID: ${prompt_id}`);

      // Track progress and wait for completion
      const history = await client.trackProgress(prompt_id, handleProgress);

      // Process results
      if (history && history[prompt_id]) {
        const outputs = history[prompt_id].outputs;
        addDebugLog(`Processing ${Object.keys(outputs).length} outputs`);

        const newImages = [];
        for (const [nodeId, output] of Object.entries(outputs)) {
          if (output.images) {
            for (const image of output.images) {
              try {
                const imageUrl = client.getImageUrl(
                  image.filename,
                  image.subfolder,
                  image.type
                );
                addDebugLog(`Generated image URL: ${imageUrl}`);
                newImages.push({
                  nodeId,
                  url: imageUrl,
                  filename: image.filename,
                  subfolder: image.subfolder,
                  type: image.type,
                });
              } catch (err) {
                addDebugLog(`Error processing image: ${err.message}`);
              }
            }
          }
        }

        setImages(newImages);
        addDebugLog(`Found ${newImages.length} images`);
      }

      setStatus("complete");
      addDebugLog("Workflow completed successfully");
    } catch (err) {
      addDebugLog(`Error: ${err.message}`);
      setError(err.message);
      setStatus("error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>ComfyUI Workflow Tester</h1>
        {clientId && <p>Client ID: {clientId}</p>}
      </div>

      <div style={styles.textareaContainer}>
        <label style={styles.label}>Workflow JSON:</label>
        <textarea
          style={styles.textarea}
          value={workflow}
          onChange={(e) => setWorkflow(e.target.value)}
          placeholder="Paste your workflow JSON here..."
        />
      </div>

      <button
        onClick={handleWorkflowTest}
        disabled={!client || status === "running"}
        style={{
          ...styles.button,
          ...(!client || status === "running" ? styles.buttonDisabled : {}),
        }}
      >
        {status === "running" ? "Processing..." : "Run Workflow"}
      </button>

      {progress && (
        <div style={styles.progress}>
          {progress.type === "progress" && (
            <span>
              Processing node {progress.node}: Step {progress.value}/
              {progress.max}
            </span>
          )}
          {progress.type === "executing" && (
            <span>Executing node: {progress.node}</span>
          )}
        </div>
      )}

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.debugPanel}>
        <h3>Debug Log:</h3>
        {debugLog.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>

      {images.map((image, index) => (
        <div key={index} style={styles.imageContainer}>
          <p>Node: {image.nodeId}</p>
          <p>Filename: {image.filename}</p>
          <img
            src={image.url}
            alt={`Output ${index + 1}`}
            style={styles.image}
            onLoad={() => addDebugLog(`Image loaded: ${image.url}`)}
            onError={() => addDebugLog(`Failed to load image: ${image.url}`)}
          />
        </div>
      ))}
    </div>
  );
};

export default WorkflowTester;
