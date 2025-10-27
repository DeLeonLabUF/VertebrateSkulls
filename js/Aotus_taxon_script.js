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
          // console.log(nodes);
          // hideshow is the variable created to store the piece gets toggled
          // Replace the name for other models
          const hideshow = Object.values(nodes).find((node) => node.name === "Calotte");
          console.log(hideshow);
          addClickEvent(api, hideshow.instanceID);
        });
    });
}


//Define a function on click
const addClickEvent = (api, hideshow, iframeID) => {
  // Perform an action whenever the iframe is clicked
  let isVisible = true;
  api.addEventListener(
    "click",
    function (info) {
      // show or hide an object
      if (isVisible === true) {
        api.hide(hideshow);
      } else {
        api.show(hideshow);
      }
      isVisible = !isVisible;
    },
    { pick: "fast" }
  );
};

var version = '1.12.1';

initializeSketchfab('53e9657729b34a269111b30933d42d94', 'DWA-Aotus1_Taxon', 'Calotte');
initializeSketchfab('e8bcd539e0594f46a96d54da6ea6d99a', 'Aotus107_Taxon', 'Calotte');
initializeSketchfab('d4e239842d2d45e89ece58016578e4d7', 'Aotus108_Taxon', 'Calotte');

// Author: Valerie Burke DeLeon using codepen.io; I am grateful to the Sketchfab Developer Team and the video tutorial by Klaas Nienhuis (https://www.klaasnienhuis.nl) on YouTube (https://www.youtube.com/live/mVQNDCwbXMM)!
