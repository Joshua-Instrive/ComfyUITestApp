export class ComfyUIClient {
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

  async uploadImage(file) {
    const formData = new FormData();
    formData.append("image", file);

    const response = await fetch(`${this.host}/upload/image`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data;
  }

  async queuePrompt(workflow, clientId, uploadedImage) {
    // If there's an uploaded image, modify the workflow to use it
    let modifiedWorkflow = JSON.parse(JSON.stringify(workflow));

    // Find the LoadImage node
    const loadImageNode = Object.entries(modifiedWorkflow).find(
      ([_, node]) => node.class_type === "LoadImage"
    );

    if (loadImageNode && uploadedImage) {
      loadImageNode[1].inputs.image = uploadedImage.name;
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
