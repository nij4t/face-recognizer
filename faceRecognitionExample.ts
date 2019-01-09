import * as faceapi from "face-api.js";

const MODEL_URL = "http://localhost:5000/models";

async function _loadModelsAsync() {
  await faceapi.loadSsdMobilenetv1Model(MODEL_URL);
  await faceapi.loadFaceLandmarkModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

async function _getTwoImageSamplesAsync(label: string, origin: string) {
  return [
    await faceapi.fetchImage(`${origin + label} 1.jpg`),
    await faceapi.fetchImage(`${origin + label} 2.jpg`)
  ];
}

async function _getFaceDescriptorsAsync(image: HTMLImageElement) {
  return (await faceapi
    .detectSingleFace(image)
    .withFaceLandmarks()
    .withFaceDescriptor()).descriptor;
}

function _getDescriptorSetAsync(images: HTMLImageElement[]) {
  return Promise.all(
    images.map(async image => await _getFaceDescriptorsAsync(image))
  );
}

function _getLabeledDescriptors(
  label: string,
  descriptors: Float32Array[]
): faceapi.LabeledFaceDescriptors {
  return new faceapi.LabeledFaceDescriptors(label, descriptors);
}

function _getAllLabeledDescriptors(labels: string[], origin: string) {
  return Promise.all(
    labels.map(async label => {
      const images = await _getTwoImageSamplesAsync(label, origin);
      const descriptors = await _getDescriptorSetAsync(images);
      return _getLabeledDescriptors(label, descriptors);
    })
  );
}

const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
document.querySelector("#root").appendChild(canvas);

_loadModelsAsync().then(async () => {
  const origin = "http://localhost:5000/data/raw_faces/";
  const labels = ["edward norton", "dwayne johnson"];
  const labeledDescriptors = await _getAllLabeledDescriptors(labels, origin);
  const maxDesciptorDistance = 0.6;
  const testImageSource = origin.replace("raw_faces", "test") + "edward.jpg";
  const testImage = await faceapi.fetchImage(testImageSource);
  canvas.width = testImage.width;
  canvas.height = testImage.height;
  ctx.drawImage(testImage, 0, 0);
  const descriptorToMatch = await _getFaceDescriptorsAsync(testImage);
  const faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDesciptorDistance
  );
  const result = faceMatcher.findBestMatch(descriptorToMatch);
  faceapi.drawDetection(
    canvas,
    new faceapi.BoxWithText(
      (await faceapi.detectSingleFace(testImage)).box,
      result.label
    )
  );
  console.log(result);
});
