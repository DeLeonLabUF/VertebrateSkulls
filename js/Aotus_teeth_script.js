/**************************************************************
 * Sketchfab Initialization Script (Multi-node Aware)
 **************************************************************/

/* ====== CONFIGURATION ====== */

// Editable list of node names to toggle
const TARGET_NODE_NAMES = ["Mandible_forTeeth", "Maxilla", "Maxilla_forTeeth"];

// Sketchfab API version
const VERSION = "1.12.1";


/* ====== INITIALIZATION ====== */

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

    // Prevent optimization that merges materials/nodes
    preload: 0,
    graph_optimizer: 0,
    ui_stop: 0,
    camera: 0,
    ui_infos: 0,
    ui_controls: 0,
  });
}


/* ====== SUCCESS HANDLER ====== */

function success(api, iframeId, modelName) {
  api.start();
  api.addEventListener("viewerready", function () {
    console.log(`Viewer ready for model: ${modelName}`);

    // Wait briefly to ensure materials and nodes are fully loaded
    setTimeout(() => {
      logAllNodes(api, modelName);
      logMaterials(api, modelName);
    }, 1000);

    api.getNodeMap(function (err, nodes) {
      if (err) {
        console.error("Error getting node map:", err);
        return;
      }

      const nodeArray = Object.values(nodes);

      // Filter to target nodes
      let hideshowNodes = nodeArray.filter((node) =>
        TARGET_NODE_NAMES.includes(node.name)
      );

      // Fallback if not found — use root node
      if (hideshowNodes.length === 0) {
        const rootNode =
          nodeArray.find((node) => node.parentID === -1) ||
          nodeArray.find((node) => node.parentID === null) ||
          nodeArray[0];

        if (rootNode) {
          console.warn(
            `No target nodes (${TARGET_NODE_NAMES.join(
              ", "
            )}) found in model '${modelName}'. Using root node: ${
              rootNode.name || "Unnamed root"
            }`
          );
          hideshowNodes = [rootNode];
        } else {
          console.error("No valid nodes found in model:", modelName);
          return;
        }
      }

      // Add click toggling
      const nodeIDs = hideshowNodes.map((n) => n.instanceID);
      addClickEvent(api, nodeIDs, modelName);
    });
  });
}


/* ====== LOGGING HELPERS ====== */

function logAllNodes(api, modelName = "") {
  api.getNodeMap(function (err, nodes) {
    if (err) return console.error("Error getting node map:", err);
    console.group(`🦴 Nodes in model: ${modelName}`);
    Object.values(nodes).forEach((node) =>
      console.log(
        `${node.name || "undefined"} (instanceID: ${node.instanceID}, parentID: ${node.parentID})`
      )
    );
    console.groupEnd();
  });
}

function logMaterials(api, modelName = "") {
  api.getMaterialList((err, mats) => {
    if (err) return console.error("Error getting materials:", err);
    console.group(`🎨 Materials in model: ${modelName}`);
    mats.forEach((mat) => {
      console.log(
        `${mat.name} | transparent: ${mat.transparent || false} | opacity: ${
          mat.opacity ?? "n/a"
        }`
      );
    });
    console.groupEnd();
  });
}


/* ====== CLICK HANDLER ====== */

function addClickEvent(api, nodeIDs, modelName) {
  let visibilityState = 0; // 0 = full, 1 = transparent, 2 = hidden

  api.addEventListener(
    "click",
    function () {
      visibilityState = (visibilityState + 1) % 3;

      switch (visibilityState) {
        case 0: // Full opacity
          nodeIDs.forEach((id) => api.show(id));
          setMaterialOpacity(api, 1.0);
          console.log(`${modelName}: Visible (100%)`);
          break;

        case 1: // Transparent
          nodeIDs.forEach((id) => api.show(id));
          setMaterialOpacity(api, 0.03);
          console.log(`${modelName}: Transparent (3%)`);
          break;

        case 2: // Hidden
          nodeIDs.forEach((id) => api.hide(id));
          console.log(`${modelName}: Hidden`);
          break;
      }
    },
    { pick: "fast" }
  );
}


/* ====== OPACITY CONTROL ====== */

function setMaterialOpacity(api, value) {
  api.getMaterialList((err, mats) => {
    if (err) return console.error("Error getting materials:", err);

    mats.forEach((mat) => {
      // Apply opacity ONLY to target materials
      if (TARGET_NODE_NAMES.includes(mat.name)) {
        if (mat.channels?.Opacity) {
          mat.channels.Opacity.enable = true;
          mat.channels.Opacity.factor = value;
          mat.transparent = true;
          api.setMaterial(mat);
          console.log(`🎨 Set ${mat.name} opacity to ${value}`);
        } else {
          console.warn(`⚠️ ${mat.name} has no Opacity channel`);
        }
      }
    });
  });
}


/* ====== MODEL INITIALIZATIONS ====== */

initializeSketchfab("6920446710f64de3a6621ac766255d16", "DWA-Aotus1_Teeth", "Aotus1");
initializeSketchfab("9fb6cf5aac834deeac18c92e50cf9259", "Aotus107_Teeth", "Aotus107");
initializeSketchfab("f5696596b5bc4338ba1b21a49ee1955e", "Aotus108_Teeth", "Aotus108");

// Author: Valerie Burke DeLeon using codepen.io; I am grateful to the Sketchfab Developer Team and the video tutorial by Klaas Nienhuis (https://www.klaasnienhuis.nl) on YouTube (https://www.youtube.com/live/mVQNDCwbXMM)!
