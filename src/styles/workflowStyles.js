export const styles = {
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
  uploadSection: {
    border: "2px dashed #ccc",
    borderRadius: "8px",
    padding: "20px",
    textAlign: "center",
    marginBottom: "20px",
    cursor: "pointer",
  },
  uploadActive: {
    borderColor: "#007bff",
    backgroundColor: "#f8f9fa",
  },
  jsonEditor: {
    marginTop: "20px",
    marginBottom: "20px",
  },
  textarea: {
    width: "100%",
    height: "200px",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontFamily: "monospace",
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
    marginBottom: "10px",
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
  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginTop: "20px",
  },
  imageContainer: {
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "10px",
  },
  image: {
    width: "100%",
    height: "auto",
    borderRadius: "4px",
  },
  imageLabel: {
    marginTop: "8px",
    textAlign: "center",
    fontSize: "14px",
    color: "#666",
  },
  debugPanel: {
    backgroundColor: "#f8f9fa",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "4px",
    fontFamily: "monospace",
    fontSize: "12px",
    maxHeight: "200px",
    overflowY: "auto",
  },
};