class ComfyUIDebugClient {
  constructor(host = "http://127.0.0.1:8188") {
    this.host = host;
    this.ws = null;
    this.debug = true;
  }

  log(message, data) {
    if (this.debug) {
      console.log(`[ComfyUI Debug] ${message}`, data || "");
    }
  }

  async testConnection() {
    try {
      // Test HTTP connection
      this.log("Testing HTTP connection...");
      const httpResponse = await fetch(`${this.host}/history`);
      this.log("HTTP Response:", httpResponse.status);

      // Test WebSocket connection
      this.log("Testing WebSocket connection...");
      const ws = new WebSocket(`ws://127.0.0.1:8188/ws`);

      return new Promise((resolve, reject) => {
        ws.onopen = () => {
          this.log("WebSocket connected successfully");
          ws.close();
          resolve({
            status: "success",
            message: "Both HTTP and WebSocket connections successful",
          });
        };

        ws.onerror = (error) => {
          this.log("WebSocket error:", error);
          reject({
            status: "error",
            message: "WebSocket connection failed",
            error: error,
          });
        };

        // Timeout after 5 seconds
        setTimeout(() => {
          reject({
            status: "error",
            message: "Connection timeout after 5 seconds",
          });
        }, 5000);
      });
    } catch (error) {
      this.log("HTTP connection error:", error);
      return {
        status: "error",
        message: "HTTP connection failed",
        error: error,
      };
    }
  }

  async checkServerStatus() {
    try {
      const endpoints = ["/history", "/prompt", "/view"];

      this.log("Checking server endpoints...");

      for (const endpoint of endpoints) {
        try {
          const response = await fetch(`${this.host}${endpoint}`);
          this.log(`Endpoint ${endpoint}:`, response.status);
        } catch (error) {
          this.log(`Endpoint ${endpoint} error:`, error);
        }
      }
    } catch (error) {
      this.log("Server status check failed:", error);
    }
  }
}

// Usage example
const debugClient = new ComfyUIDebugClient();

async function runDebugTests() {
  console.log("Starting ComfyUI Debug Tests...");

  // Test basic connection
  try {
    const connectionResult = await debugClient.testConnection();
    console.log("Connection test result:", connectionResult);
  } catch (error) {
    console.log("Connection test failed:", error);
  }

  // Check server endpoints
  await debugClient.checkServerStatus();
}

export { ComfyUIDebugClient, runDebugTests };
