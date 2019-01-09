import * as faceapi from "face-api.js";

const MODEL_URL = "http://localhost:5000/models";

async function loadModels() {
  await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

async function getFaceFeatures(
  input: HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | string
) {
  return await faceapi
    .detectAllFaces(input)
    .withFaceLandmarks()
    .withFaceDescriptors();
}

function drawFaceRects(canvas: HTMLCanvasElement, detection: faceapi.FaceDetection[]) {
    faceapi.drawDetection(canvas, detection, { withScore: true })
}

loadModels().then(() => {
    getFaceFeatures(canvas).then(descriptions => {
        drawFaceRects(canvas, descriptions.map( description => description.detection ))
    });
});

const root = document.querySelector("#root");

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
root.appendChild(canvas);

const image = document.querySelector("#face") as HTMLImageElement;
image.style.visibility = "hidden";

canvas.width = image.width;
canvas.height = image.height;
ctx.drawImage(image, 0, 0);
