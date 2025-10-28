//Define function to initialize each model window
function initializeSketchfab(uid, iframeId, modelName) {
    const iframe = document.getElementById(iframeId);
    const version = '1.12.1';
    const client = new Sketchfab(version, iframe);

    client.init(uid, {
        success: function(api) {
            success(api, iframeId, modelName); // Pass modelName to the success function
        },
        error: function(error) {
            console.error("Sketchfab API error:", error);
        },
        ui_stop: 0,
        preload: 1,
        camera: 0
    });
}

// Define a function for successful load
function success(api, iframeId, modelName) {
    api.start();
    api.addEventListener("viewerready", function () {
        // List objects
        api.getNodeMap(function (err, nodes) {
            if (err) {
            console.error("Error getting node map:", err);
            return;
              }

      // Try to find the named node first
      let hideshow = Object.values(nodes).find((node) => node.name === "Calotte");

      // If not found, fall back to the root node (usually the first in the list)
      if (!hideshow) {
        hideshow = Object.values(nodes).find((node) => node.parentID === -1);
        console.warn("Target node 'Calotte' not found. Using root node:", hideshow.name);
      }

      if (!hideshow) {
        console.error("No valid node found to toggle visibility.");
        return;
      }

      addClickEvent(api, hideshow.instanceID);
    });
  });
}


//Define a function on click
const addClickEvent = (api, hideshowID) => {
  let isVisible = true;
  api.addEventListener(
    "click",
    function (info) {
      if (isVisible) {
        api.hide(hideshowID);
      } else {
        api.show(hideshowID);
      }
      isVisible = !isVisible;
    },
    { pick: "fast" }
  );
};

var version = '1.12.1';

initializeSketchfab('6920446710f64de3a6621ac766255d16', 'DWA-Aotus1_Teeth', '');
initializeSketchfab('9fb6cf5aac834deeac18c92e50cf9259', 'Aotus107_Teeth', '');
initializeSketchfab('f5696596b5bc4338ba1b21a49ee1955e', 'Aotus108_Teeth', '');

// Author: Valerie Burke DeLeon using codepen.io; I am grateful to the Sketchfab Developer Team and the video tutorial by Klaas Nienhuis (https://www.klaasnienhuis.nl) on YouTube (https://www.youtube.com/live/mVQNDCwbXMM)!
