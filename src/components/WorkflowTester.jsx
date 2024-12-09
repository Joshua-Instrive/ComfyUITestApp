// src/components/WorkflowTester.jsx
import React, { useState, useEffect } from "react";
import { ComfyUIClient } from "../lib/ComfyUIClient";
import { styles } from "../styles/workflowStyles";
import ImageUploader from "./ImageUploader";
import WorkflowEditor from "./WorkflowEditor";
import ProgressIndicator from "./ProgressIndicator";
import OutputImages from "./Outputimages";
import DebugPanel from "./DebugPanel";

const WorkflowTester = ({
  initialWorkflow = "",
  title = "ComfyUI Workflow Tester",
  onWorkflowChange = null,
}) => {
  const [client, setClient] = useState(null);
  const [clientId, setClientId] = useState(null);
  const [status, setStatus] = useState("idle");
  const [progress, setProgress] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [workflow, setWorkflow] = useState(
    typeof initialWorkflow === "object"
      ? JSON.stringify(initialWorkflow, null, 2)
      : initialWorkflow
  );
  const [debugLog, setDebugLog] = useState([]);
  const [uploadedImage, setUploadedImage] = useState(null);

  const addDebugLog = (message) => {
    setDebugLog((prev) => [
      ...prev,
      `${new Date().toISOString()} - ${message}`,
    ]);
  };

  useEffect(() => {
    if (initialWorkflow) {
      setWorkflow(
        typeof initialWorkflow === "object"
          ? JSON.stringify(initialWorkflow, null, 2)
          : initialWorkflow
      );
    }
  }, [initialWorkflow]);

  const handleWorkflowChange = (newWorkflow) => {
    setWorkflow(newWorkflow);
    if (onWorkflowChange) {
      onWorkflowChange(newWorkflow);
    }
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

  const processWorkflow = async () => {
    if (!client || !workflow || !uploadedImage || !clientId) return;

    setStatus("running");
    setError(null);
    setImages([]);
    setProgress(null);

    try {
      addDebugLog("Starting workflow execution...");

      let parsedWorkflow = workflow;
      if (typeof workflow === "string") {
        parsedWorkflow = JSON.parse(workflow);
      }

      // Queue the prompt with the uploaded image
      const { prompt_id } = await client.queuePrompt(
        parsedWorkflow,
        clientId,
        uploadedImage
      );
      addDebugLog(`Prompt queued with ID: ${prompt_id}`);

      // Track progress and wait for completion
      const history = await client.trackProgress(prompt_id, handleProgress);

      // Log the complete history for debugging
      console.log("Full history object:", history);

      if (history && history[prompt_id]) {
        const promptData = history[prompt_id];
        const { outputs, prompt } = promptData;

        // Get the workflow data from the prompt array's third element (index 2)
        const workflowData = prompt[2];

        addDebugLog(`Processing outputs: ${JSON.stringify(outputs)}`);

        const newImages = [];

        // Process each output node
        for (const [nodeId, output] of Object.entries(outputs)) {
          if (output.images) {
            for (const image of output.images) {
              const imageUrl = client.getImageUrl(
                image.filename,
                image.subfolder,
                image.type
              );

              // Get the node's metadata from the workflow data
              const nodeInfo = workflowData[nodeId];
              const nodeTitle =
                nodeInfo?._meta?.title ||
                nodeInfo?.class_type ||
                "Unknown Node";

              // Get additional node-specific data
              let additionalInfo = {};

              // For text outputs (like from ShowText nodes)
              if (output.text) {
                additionalInfo.text = output.text[0];
              }

              // Add image dimensions if available (from GetImageSizeAndCount nodes)
              if (
                output.text &&
                nodeInfo?.class_type === "GetImageSizeAndCount"
              ) {
                additionalInfo.dimensions = output.text[0];
              }

              addDebugLog(
                `Generated image from node ${nodeId} (${nodeTitle}): ${imageUrl}`
              );

              newImages.push({
                nodeId,
                url: imageUrl,
                filename: image.filename,
                nodeTitle,
                ...additionalInfo,
              });
            }
          }

          // Handle text outputs even if there are no images
          if (output.text) {
            addDebugLog(`Text output from node ${nodeId}: ${output.text[0]}`);
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
        <h1 style={styles.title}>{title}</h1>
        {clientId && <p>Connected to ComfyUI Server</p>}
      </div>

      <ImageUploader
        onImageUpload={setUploadedImage}
        client={client}
        addDebugLog={addDebugLog}
      />

      <WorkflowEditor workflow={workflow} onChange={handleWorkflowChange} />

      <button
        onClick={processWorkflow}
        disabled={
          !client || !uploadedImage || !workflow || status === "running"
        }
        style={{
          ...styles.button,
          ...(!client || !uploadedImage || !workflow || status === "running"
            ? styles.buttonDisabled
            : {}),
        }}
      >
        {status === "running" ? "Processing..." : "Run Workflow"}
      </button>

      {error && <div style={styles.error}>{error}</div>}

      <ProgressIndicator progress={progress} />

      <OutputImages images={images} addDebugLog={addDebugLog} />

      <DebugPanel logs={debugLog} />
    </div>
  );
};

export default WorkflowTester;
