
const URL = "https://teachablemachine.withgoogle.com/models/GjDFbOt_E/";
let model, webcam, maxPredictions;

init();
var dir;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // or files from your local hard drive
    // Note: the pose library adds "tmImage" object to your window (window.tmImage)
    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Convenience function to setup a webcam
    const flip = true; // whether to flip the webcam
    webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
    await webcam.setup(); // request access to the webcam
    await webcam.play();
    window.requestAnimationFrame(loop);

    // append elements to the DOM
    document.getElementById("webcam-container").appendChild(webcam.canvas);
    labelContainer = document.getElementById("label-container");
    for (let i = 0; i < maxPredictions; i++) { // and class labels
        labelContainer.appendChild(document.createElement("div"));
    }
}

async function loop() {
    webcam.update(); // update the webcam frame
    await predict();
    window.requestAnimationFrame(loop);
}

// run the webcam image through the image model
async function predict() {
    // predict can take in an image, video or canvas html element
    const prediction = await model.predict(webcam.canvas);

    var up = document.getElementById("up");
    var down = document.getElementById("down");
    var left = document.getElementById("left");
    var right = document.getElementById("right");
    var none = document.getElementById("none");
    up.setAttribute("style", "width: " + (parseFloat(prediction[0].probability.toFixed(2)) * 100).toString() + "%");
    down.setAttribute("style", "width: " + (parseFloat(prediction[1].probability.toFixed(2)) * 100).toString() + "%");
    left.setAttribute("style", "width: " + (parseFloat(prediction[2].probability.toFixed(2)) * 100).toString() + "%");
    right.setAttribute("style", "width: " + (parseFloat(prediction[3].probability.toFixed(2)) * 100).toString() + "%");
    none.setAttribute("style", "width: " + (parseFloat(prediction[4].probability.toFixed(2)) * 100).toString() + "%");

    if(prediction[0].probability.toFixed(2) > 0.80) dir = 0;
    else if(prediction[1].probability.toFixed(2) > 0.80) dir = 1;
    else if(prediction[2].probability.toFixed(2) > 0.80) dir = 2;
    else if(prediction[3].probability.toFixed(2) > 0.80) dir = 3;
}