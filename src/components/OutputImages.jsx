import React from "react";
import { styles } from "../styles/workflowStyles";

const OutputImages = ({ images, addDebugLog }) => {
  if (!images.length) return null;

  return (
    <div style={styles.imageGrid}>
      {images.map((image, index) => (
        <div key={index} style={styles.imageContainer}>
          <img
            src={image.url}
            alt={`Output ${index + 1}`}
            style={styles.image}
            onLoad={() => addDebugLog(`Image loaded: ${image.url}`)}
            onError={() => addDebugLog(`Failed to load image: ${image.url}`)}
          />
          <p style={styles.imageLabel}>
            {index === 0
              ? "Original with Background Removed"
              : index === 1
              ? "Segmented Image"
              : "Segmentation Mask"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OutputImages;
