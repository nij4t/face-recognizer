import * as faceapi from "face-api.js";
import { Canvas, Image, ImageData } from "canvas";
import { readdirSync, writeFileSync, readFileSync } from "fs";

require("@tensorflow/tfjs-node");
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

const MODEL_URI = "./models/";

export default class FaceRecognizer {
  private static instance: FaceRecognizer;
  public onmodelsready: Function;

  private constructor() {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(MODEL_URI),
      faceapi.nets.faceLandmark68Net.loadFromDisk(MODEL_URI),
      faceapi.nets.faceRecognitionNet.loadFromDisk(MODEL_URI)
    ]).then(() => this.onmodelsready())
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new FaceRecognizer();
    }
    return this.instance;
  }
}
