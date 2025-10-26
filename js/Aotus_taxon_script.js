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
          const hideshow = Object.values(nodes).find((node) => node.name === "Calotte_v6_2");
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

initializeSketchfab('271bd5c6d9854fe6997f8a31475e9d2c', 'api-frame-dog', 'Calotte_v6_2');
initializeSketchfab('423318aa8fd14782976d528fd8e2a5d0', 'api-frame-other', null);

// Author: Valerie Burke DeLeon using codepen.io; I am grateful to the Sketchfab Developer Team and the video tutorial by Klaas Nienhuis (https://www.klaasnienhuis.nl) on YouTube (https://www.youtube.com/live/mVQNDCwbXMM)!
