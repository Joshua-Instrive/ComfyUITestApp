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
            alt={`${image.filename} output`}
            style={styles.image}
            onLoad={() => addDebugLog(`Image loaded: ${image.url}`)}
            onError={() => addDebugLog(`Failed to load image: ${image.url}`)}
          />
          <div style={styles.imageInfo}>
            <p style={styles.imageLabel}>{image.filename}</p>
            {image.dimensions && (
              <p style={styles.imageMeta}>Size: {image.dimensions}</p>
            )}
            {image.text && (
              <p style={styles.imageMeta}>Details: {image.text}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OutputImages;
