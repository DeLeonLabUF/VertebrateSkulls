//Define a function on click
const addClickEvent = (api, hideshow) => {
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

// Define a function for successful load
const success = (api) => {
  // Tell the api to load the 3D model
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
    })                     
   })
}

var iframe-dog = document.getElementById( 'api-frame-dog' );
var iframe-other = document.getElementById( 'api-frame-other' );
var version = '1.12.1';
var client-dog = new Sketchfab( version, iframe-dog );
var client-other = new Sketchfab( version, iframe-other );

// Sketchfab unique identifier (UID)
// Replace for other models
var uid-dog = '271bd5c6d9854fe6997f8a31475e9d2c';

  client-dog.init(uid-dog, {
    success: success,
    //  error: () => console.error("Sketchfab API error"),
    ui_stop: 0,
    preload: 1,
    camera: 0
  });
