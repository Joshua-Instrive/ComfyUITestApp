import { getAuthToken } from "./authUtils";
import { handleApiError } from "./errorUtils";

export class ComfyUIClient {
  constructor(host = "http://165.173.4.30:8188") {
    this.host = host;
    this.ws = null;
    this.debug = true;
  }

  getHeaders() {
    const token = getAuthToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
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

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${this.host}/upload/image`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getAuthToken()}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data;
  }

  async queuePrompt(workflow, clientId, uploadedImage) {
    try {
      // Create a deep copy of the workflow to avoid modifying the original
      let modifiedWorkflow =
        typeof workflow === "string"
          ? JSON.parse(workflow)
          : JSON.parse(JSON.stringify(workflow));

      // Find the LoadImage node
      const loadImageNode = Object.entries(modifiedWorkflow).find(
        ([_, node]) => node.class_type === "LoadImage"
      );

      // Update the image input if we have both a LoadImage node and an uploaded image
      if (loadImageNode && uploadedImage) {
        const [nodeId] = loadImageNode;
        modifiedWorkflow[nodeId].inputs.image = uploadedImage.name;
      }

      const payload = {
        prompt: modifiedWorkflow,
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
    } catch (error) {
      this.log("Error queueing prompt:", error);
      throw error;
    }
  }

  trackProgress(promptId, onProgress) {
    return new Promise((resolve, reject) => {
      if (!this.ws) reject(new Error("WebSocket not connected"));

      this.ws.onmessage = async (event) => {
        const message = JSON.parse(event.data);

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
    const response = await fetch(`${this.host}/history/${promptId}`, {
      headers: this.getHeaders(),
    });
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
