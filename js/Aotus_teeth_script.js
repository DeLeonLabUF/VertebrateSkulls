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

    // These options affect scene optimization:
    preload: 0,        // Load full material list; prevents scene baking
    ui_stop: 0,        // Keep UI hidden but don’t strip features
    camera: 0,
    ui_infos: 0,
    ui_controls: 0
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
      console.log(
        `${node.name} (instanceID: ${node.instanceID}, parentID: ${node.parentID})`
      )
    );
    console.groupEnd();
  });
}

function logMeshNodes(api, modelName = "") {
  return new Promise((resolve) => {
    api.getNodeMap((err, nodes) => {
      if (err) {
        console.error("Error getting node map:", err);
        resolve([]);
        return;
      }

      const nodeArray = Object.values(nodes);

      // Keep all nodes that have a name (ignore internal transforms)
      const meshNodes = nodeArray.filter((node) => node.name);

      if (meshNodes.length === 0) {
        console.warn(`⚠️ No named nodes found in model '${modelName}'.`);
        resolve([]);
        return;
      }

      console.group(`🦴 Named Nodes in model: ${modelName}`);
      meshNodes.forEach((node) =>
        console.log(
          `${node.name} (type: ${node.type}, instanceID: ${node.instanceID}, parentID: ${node.parentID})`
        )
      );
      console.groupEnd();

      console.log(
        `✅ Found ${meshNodes.length} named nodes (out of ${nodeArray.length} total nodes).`
      );

      resolve(meshNodes);
    });
  });
}


/* ====== SUCCESS HANDLER ====== */

function success(api, iframeId, modelName) {
  api.start();
  window.api = api;

  api.addEventListener("viewerready", function () {
    // Wait briefly for the scene to fully populate before accessing node data
    setTimeout(async () => {
      // List and retrieve mesh nodes
      const meshNodes = await logMeshNodes(api, modelName);
      console.log("Mesh node names:", meshNodes.map((n) => n.name));

      // Retrieve complete node map
      api.getNodeMap(function (err, nodes) {
        if (err) {
          console.error("Error getting node map:", err);
          return;
        }

        logAllNodes(api, modelName);

        const nodeArray = Object.values(nodes);

        // Find all nodes whose names match any of the TARGET_NODE_NAMES
        let hideshowNodes = nodeArray.filter((node) =>
          TARGET_NODE_NAMES.includes(node.name)
        );

        // Fallback: if no matching nodes found, use root-like node
        if (hideshowNodes.length === 0) {
          const rootNode =
            nodeArray.find((node) => node.parentID === -1) ||
            nodeArray.find((node) => node.parentID === null) ||
            nodeArray[0]; // fallback to first node in the list

          if (rootNode) {
            console.warn(
              `No target nodes (${TARGET_NODE_NAMES.join(
                ", "
              )}) found in model '${modelName}'. Using root node: ${
                rootNode?.name || "Unnamed root"
              }`
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
    }, 300); // delay for full initialization
  });
}

/* ====== CLICK HANDLER ====== */

function addClickEvent(api, nodeIDs) {
  // 0 = fully visible, 1 = semi-transparent, 2 = hidden
  let visibilityState = 0;

  api.getMaterialList(function (err, materials) {
    if (err) {
      console.error("Error getting material list:", err);
      return;
    }

    api.addEventListener(
      "click",
      function (info) {
        if (!info || !info.instanceID) return;

        // Step 1️⃣ → make semi-transparent
        if (visibilityState === 0) {
          materials.forEach((mat) => {
            mat.opacity = 0.03;              // 3 % visible
            mat.transparent = true;         // enable alpha blending
            mat.blending = "BLENDING_NORMAL";
            mat.depthWrite = false;         // prevent z-fighting
            api.setMaterial(mat);
          });
          visibilityState = 1;
        }

        // Step 2️⃣ → hide completely
        else if (visibilityState === 1) {
          nodeIDs.forEach((id) => api.hide(id));
          visibilityState = 2;
        }

        // Step 3️⃣ → restore full opacity
        else {
          nodeIDs.forEach((id) => api.show(id));
          materials.forEach((mat) => {
            mat.opacity = 1.0;
            mat.transparent = false;
            mat.depthWrite = true;
            api.setMaterial(mat);
          });
          visibilityState = 0;
        }
      },
      { pick: "slow" }
    );
  });
}


/* ====== MODEL INITIALIZATIONS ====== */

initializeSketchfab("6920446710f64de3a6621ac766255d16", "DWA-Aotus1_Teeth", "Aotus1");
initializeSketchfab("9fb6cf5aac834deeac18c92e50cf9259", "Aotus107_Teeth", "Aotus107");
initializeSketchfab("f5696596b5bc4338ba1b21a49ee1955e", "Aotus108_Teeth", "Aotus108");

// Author: Valerie Burke DeLeon using codepen.io; I am grateful to the Sketchfab Developer Team and the video tutorial by Klaas Nienhuis (https://www.klaasnienhuis.nl) on YouTube (https://www.youtube.com/live/mVQNDCwbXMM)!
