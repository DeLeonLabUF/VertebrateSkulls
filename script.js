//Define a function to initialize each window
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
            console.log(nodes);
            let hideshow;
            if (modelName !== null) {
                hideshow = Object.values(nodes).find((node) => node.name === modelName);
            } else {
                hideshow = null;
            }
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

initializeSketchfab('271bd5c6d9854fe6997f8a31475e9d2c', 'api-frame-dog');
initializeSketchfab('423318aa8fd14782976d528fd8e2a5d0', 'api-frame-other');

