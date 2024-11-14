import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { styles } from "../styles/workflowStyles";

const ImageUploader = ({ onImageUpload, client, addDebugLog }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const clearImage = () => {
    setPreviewUrl(null);
    onImageUpload(null);
  };

  const processFile = async (file) => {
    if (file && file.type.startsWith("image/")) {
      try {
        // Create local preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Upload to server
        const uploadResult = await client.uploadImage(file);
        onImageUpload(uploadResult);
        addDebugLog(`Image uploaded successfully: ${file.name}`);
      } catch (err) {
        addDebugLog(`Upload error: ${err.message}`);
        setPreviewUrl(null);
        throw err;
      }
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    await processFile(file);
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    await processFile(file);
  };

  return (
    <div style={styles.uploadContainer}>
      <div
        style={{
          ...styles.uploadSection,
          ...(isDragging ? styles.uploadActive : {}),
          ...(previewUrl ? styles.uploadSectionWithPreview : {}),
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {!previewUrl ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ display: "none" }}
              id="file-upload"
            />
            <label htmlFor="file-upload" style={{ cursor: "pointer" }}>
              <div className="flex flex-col items-center gap-4">
                <Upload size={48} className="text-gray-400" />
                <p className="text-gray-600">
                  Drag and drop an image or click to select
                </p>
              </div>
            </label>
          </>
        ) : (
          <div style={styles.previewContainer}>
            <img src={previewUrl} alt="Preview" style={styles.previewImage} />
            <button
              onClick={clearImage}
              style={styles.clearButton}
              title="Remove image"
            >
              <X size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
