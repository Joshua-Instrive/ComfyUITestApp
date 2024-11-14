import React, { useEffect, useState } from "react";
import WorkflowTester from "./components/WorkflowTester";
import { ErrorBoundary } from "./lib/errorUtils";
import AuthenticatedLayout from "./components/AuthenticatedLayout";
import LoginForm from "./components/LoginForm";
import { checkAuth } from "./lib/authUtils";
import { styles } from "./styles/workflowStyles";

// Default workflow for background removal and segmentation
const defaultWorkflow = {
  3: {
    inputs: {
      image: ["12", 0],
    },
    class_type: "Image Remove Background (rembg)",
    _meta: {
      title: "Image Remove Background (rembg)",
    },
  },
  4: {
    inputs: {
      images: ["3", 0],
    },
    class_type: "PreviewImage",
    _meta: {
      title: "Preview Image",
    },
  },
  5: {
    inputs: {
      prompt: "subject",
      threshold: 0.3,
      sam_model: ["6", 0],
      grounding_dino_model: ["7", 0],
      image: ["12", 0],
    },
    class_type: "GroundingDinoSAMSegment (segment anything)",
    _meta: {
      title: "GroundingDinoSAMSegment (segment anything)",
    },
  },
  6: {
    inputs: {
      model_name: "sam_vit_h (2.56GB)",
    },
    class_type: "SAMModelLoader (segment anything)",
    _meta: {
      title: "SAMModelLoader (segment anything)",
    },
  },
  7: {
    inputs: {
      model_name: "GroundingDINO_SwinT_OGC (694MB)",
    },
    class_type: "GroundingDinoModelLoader (segment anything)",
    _meta: {
      title: "GroundingDinoModelLoader (segment anything)",
    },
  },
  8: {
    inputs: {
      images: ["5", 0],
    },
    class_type: "PreviewImage",
    _meta: {
      title: "Preview Image",
    },
  },
  9: {
    inputs: {
      mask: ["5", 1],
    },
    class_type: "MaskToImage",
    _meta: {
      title: "Convert Mask to Image",
    },
  },
  10: {
    inputs: {
      images: ["9", 0],
    },
    class_type: "PreviewImage",
    _meta: {
      title: "Preview Image",
    },
  },
  12: {
    inputs: {
      image: "",
      upload: "image",
    },
    class_type: "LoadImage",
    _meta: {
      title: "Load Image",
    },
  },
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedWorkflow, setSelectedWorkflow] = useState("default");
  const [customWorkflow, setCustomWorkflow] = useState("");

  useEffect(() => {
    setIsAuthenticated(checkAuth());
  }, []);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
  };

  const workflowOptions = {
    default: {
      name: "Background Removal & Segmentation",
      workflow: defaultWorkflow,
    },
    // Add more predefined workflows here if needed
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <AuthenticatedLayout>
      <div style={styles.workflowContainer}>
        {/* Workflow Selection Section */}
        <div style={styles.workflowSelectionContainer}>
          <label style={styles.workflowLabel}>Select Workflow</label>
          <select
            style={styles.workflowSelect}
            value={selectedWorkflow}
            onChange={(e) => setSelectedWorkflow(e.target.value)}
          >
            <option value="default">Background Removal & Segmentation</option>
            <option value="custom">Custom Workflow</option>
          </select>
        </div>

        <hr style={styles.divider} />

        {/* Workflow Tester Section */}
        {selectedWorkflow === "custom" ? (
          <WorkflowTester
            initialWorkflow={customWorkflow}
            onWorkflowChange={setCustomWorkflow}
          />
        ) : (
          <ErrorBoundary>
            <WorkflowTester
              initialWorkflow={workflowOptions[selectedWorkflow].workflow}
              title={workflowOptions[selectedWorkflow].name}
            />
          </ErrorBoundary>
        )}
      </div>
    </AuthenticatedLayout>
  );
};

export default App;
