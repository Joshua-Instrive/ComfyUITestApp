import React, { useState } from "react";
import { Upload } from "lucide-react";
import { styles } from "../styles/workflowStyles";

const ImageUploader = ({ onImageUpload, client, addDebugLog }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const uploadResult = await client.uploadImage(file);
        onImageUpload(uploadResult);
        addDebugLog(`Image uploaded successfully: ${file.name}`);
      } catch (err) {
        addDebugLog(`Upload error: ${err.message}`);
        throw err;
      }
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      try {
        const uploadResult = await client.uploadImage(file);
        onImageUpload(uploadResult);
        addDebugLog(`Image uploaded successfully: ${file.name}`);
      } catch (err) {
        addDebugLog(`Upload error: ${err.message}`);
        throw err;
      }
    }
  };

  return (
    <div
      style={{
        ...styles.uploadSection,
        ...(isDragging ? styles.uploadActive : {}),
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
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
    </div>
  );
};

export default ImageUploader;
