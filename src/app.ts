import * as faceapi from "face-api.js";
import { Canvas, Image, ImageData } from "canvas";
import { readdirSync, writeFileSync, readFileSync } from "fs";

require('@tensorflow/tfjs-node')
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_URI = "./static/models/";
const TRAINING_URI = "./static/data/training/";
const FILE_PATH = process.argv[2];

async function _loadModelsAsync() {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URI);
  await faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URI);
  await faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URI);
}

function _createImage(src): HTMLImageElement {
  const image = new Image();
  image.src = src;
  return image;
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

async function _getImagesAsync(label, origin) {
  const src = origin + label;
  return readdirSync(src).map(file => _createImage(src + "/" + file));
}

function _getAllLabeledDescriptors(labels: string[], origin: string) {
  return Promise.all(
    labels.map(async label => {
      const images = await _getImagesAsync(label, origin);
      const descriptors = await _getDescriptorSetAsync(images);
      return _getLabeledDescriptors(label, descriptors);
    })
  );
}

function _serialize(
  path: string,
  labeledDescriptors: faceapi.LabeledFaceDescriptors[]
) {
  const serializable = labeledDescriptors.map(descriptor => ({
    _label: descriptor.label,
    _descriptors: Object.values(descriptor.descriptors).map(val =>
      Object.values(val)
    )
  }));
  writeFileSync(path, JSON.stringify(serializable));
}

function _deserialize(path: string): faceapi.LabeledFaceDescriptors[] {
  return JSON.parse(readFileSync(path).toString()).map(
    fr =>
      new faceapi.LabeledFaceDescriptors(
        fr._label,
        Object.values(fr._descriptors).map(
          val => new Float32Array(Object.values(val))
        )
      )
  );
}

(async () => {
  await _loadModelsAsync();
  const labels = readdirSync(TRAINING_URI);
  // const labeledSetOfDescriptors = await _getAllLabeledDescriptors(
  //   labels,
  //   TRAINING_URI
  // );

  // _serialize(
  //   "./static/data/trained/" + labels.join("_") + ".json",
  //   labeledSetOfDescriptors
  // );

  const trained: faceapi.LabeledFaceDescriptors[] = _deserialize(
    "./static/data/trained/Dwayne Johnson_Edward Norton.json"
  );

  const descriptorToMatch = await _getFaceDescriptorsAsync(
    _createImage(FILE_PATH)
  );
  const faceMatcher = new faceapi.FaceMatcher(trained, 0.6);
  const result = await faceMatcher.findBestMatch(descriptorToMatch);

  console.log(result);
})();
