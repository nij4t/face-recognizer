import * as faceapi from "face-api.js";
import { resolve } from "path";

export class NetworkLoader {

  private static MODEL_URI = resolve(__dirname, "../models");
  public static load() {
    return Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(this.MODEL_URI),
      faceapi.nets.faceLandmark68Net.loadFromDisk(this.MODEL_URI),
      faceapi.nets.faceRecognitionNet.loadFromDisk(this.MODEL_URI)
    ]).then(() => faceapi)
  }
}
