import React, { useState } from "react";
import WorkflowTester from "./components/WorkflowTester";

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
  const [selectedWorkflow, setSelectedWorkflow] = useState("default");
  const [customWorkflow, setCustomWorkflow] = useState("");

  const workflowOptions = {
    default: {
      name: "Background Removal & Segmentation",
      workflow: defaultWorkflow,
    },
    // Add more predefined workflows here if needed
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">ComfyUI Workflow Manager</h1>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Workflow
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={selectedWorkflow}
              onChange={(e) => setSelectedWorkflow(e.target.value)}
            >
              <option value="default">Background Removal & Segmentation</option>
              <option value="custom">Custom Workflow</option>
            </select>
          </div>

          {selectedWorkflow === "custom" ? (
            <WorkflowTester
              initialWorkflow={customWorkflow}
              onWorkflowChange={setCustomWorkflow}
            />
          ) : (
            <WorkflowTester
              initialWorkflow={workflowOptions[selectedWorkflow].workflow}
              title={workflowOptions[selectedWorkflow].name}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
