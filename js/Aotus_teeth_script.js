/**************************************************************
 * Sketchfab Initialization Script (Multi-node Aware)
 **************************************************************/

/* ====== CONFIGURATION (CHOOSE NODES) ====== */

// List of node names to control in each model.
// Add or remove names here as needed.
const TARGET_NODE_NAMES = ["Mandible_forTeeth", "Maxilla", "Maxilla_forTeeth"];

// Sketchfab API version
const VERSION = "1.12.1";


/* ====== MAIN INITIALIZATION ====== */

function initializeSketchfab(uid, iframeId, modelName = "") {
  const iframe = document.getElementById(iframeId);
  const client = new Sketchfab(VERSION, iframe);

  client.init(uid, {
    success: function (api) {
      success(api, iframeId, modelName);
    },
    error: function (error) {
      console.error("Sketchfab API error:", error);
    },
    ui_stop: 0,
    preload: 1,
    camera: 0,
  });
}

/* ======= LIST ALL NODES ======== */

function logAllNodes(api, modelName = "") {
  api.getNodeMap(function (err, nodes) {
    if (err) {
      console.error("Error getting node map:", err);
      return;
    }
    console.group(`Nodes in model: ${modelName}`);
    Object.values(nodes).forEach((node) =>
      console.log(`${node.name} (instanceID: ${node.instanceID}, parentID: ${node.parentID})`)
    );
    console.groupEnd();
  });
}

function logMeshNodes(api, modelName = "") {
  api.getNodeMap((err, nodes) => {
    if (err) {
      console.error("Error getting node map:", err);
      return;
    }

    const nodeArray = Object.values(nodes);

    // Filter nodes that have both a name and a geometry type
    const meshNodes = nodeArray.filter(
      (node) => node.type === "Geometry" && node.name
    );

    if (meshNodes.length === 0) {
      console.warn(`⚠️ No mesh nodes found in model '${modelName}'.`);
      return;
    }

    console.group(`🦴 Mesh Nodes in model: ${modelName}`);
    meshNodes.forEach((node) =>
      console.log(
        `${node.name} (instanceID: ${node.instanceID}, parentID: ${node.parentID})`
      )
    );
    console.groupEnd();

    console.log(
      `✅ Found ${meshNodes.length} named mesh nodes (out of ${
        nodeArray.length
      } total nodes).`
    );
  });
}

/* ====== SUCCESS HANDLER ====== */

function success(api, iframeId, modelName) {
  api.start();
  api.addEventListener("viewerready", function () {
    api.getNodeMap(function (err, nodes) {
      if (err) {
        console.error("Error getting node map:", err);
        return;
      }
      
      logAllNodes(api, modelName);

function logMeshNodes(api, modelName = "") {
  return new Promise((resolve) => {
    api.getNodeMap((err, nodes) => {
      if (err) {
        console.error("Error getting node map:", err);
        resolve([]); // Return empty array on error
        return;
      }

      const nodeArray = Object.values(nodes);

      // Keep only named geometry nodes
      const meshNodes = nodeArray.filter(
        (node) => node.type === "Geometry" && node.name
      );

      if (meshNodes.length === 0) {
        console.warn(`⚠️ No mesh nodes found in model '${modelName}'.`);
        resolve([]); // Return empty array if none
        return;
      }

      console.group(`🦴 Mesh Nodes in model: ${modelName}`);
      meshNodes.forEach((node) =>
        console.log(
          `${node.name} (instanceID: ${node.instanceID}, parentID: ${node.parentID})`
        )
      );
      console.groupEnd();

      console.log(
        `✅ Found ${meshNodes.length} named mesh nodes (out of ${nodeArray.length} total).`
      );

      resolve(meshNodes); // Return the filtered list
    });
  });
}
      
      // Convert nodes object to an array for easier filtering
      const nodeArray = Object.values(nodes);

      // Find all nodes whose names match any of the TARGET_NODE_NAMES
      let hideshowNodes = nodeArray.filter((node) =>
        TARGET_NODE_NAMES.includes(node.name)
      );

      // Fallback: if no matching nodes found, use root-like node
      if (hideshowNodes.length === 0) {
        // Try common root indicators
        const rootNode =
        nodeArray.find((node) => node.parentID === -1) ||
        nodeArray.find((node) => node.parentID === null) ||
        nodeArray[0]; // fallback to first node in the list

    if (rootNode) {
        console.warn(
        `No target nodes (${TARGET_NODE_NAMES.join(
          ", "
          )}) found in model '${modelName}'. Using root node: ${rootNode?.name || "Unnamed root"}`
        );
      hideshowNodes = [rootNode];
      } else {
        console.error("No valid nodes found in model:", modelName);
        return;
        }
      }

      // Add click event to toggle visibility for all found nodes
      const nodeIDs = hideshowNodes.map((n) => n.instanceID);
      addClickEvent(api, nodeIDs);
    });
  });
}

/* ====== CLICK HANDLER ====== */

function addClickEvent(api, nodeIDs) {
  let isVisible = true;

  api.addEventListener(
    "click",
    function () {
      if (isVisible) {
        nodeIDs.forEach((id) => api.hide(id));
      } else {
        nodeIDs.forEach((id) => api.show(id));
      }
      isVisible = !isVisible;
    },
    { pick: "fast" }
  );
}

/* ====== MODEL INITIALIZATIONS ====== */

initializeSketchfab("6920446710f64de3a6621ac766255d16", "DWA-Aotus1_Teeth", "Aotus1");
initializeSketchfab("9fb6cf5aac834deeac18c92e50cf9259", "Aotus107_Teeth", "Aotus107");
initializeSketchfab("f5696596b5bc4338ba1b21a49ee1955e", "Aotus108_Teeth", "Aotus108");



// Author: Valerie Burke DeLeon using codepen.io; I am grateful to the Sketchfab Developer Team and the video tutorial by Klaas Nienhuis (https://www.klaasnienhuis.nl) on YouTube (https://www.youtube.com/live/mVQNDCwbXMM)!
