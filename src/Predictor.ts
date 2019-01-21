import { FaceMatcher, FaceMatch, LabeledFaceDescriptors } from "face-api.js";
import { Model } from "./Model";

export class Predictor {
  private DISTANCE_THRESHOLD = 0.6;
  private faceMather: FaceMatcher;

  constructor(model: Model, distance?: number) {
    if (!isNaN(distance)) this.DISTANCE_THRESHOLD = distance;
    this.faceMather = new FaceMatcher(model.getDescriptors(), this.DISTANCE_THRESHOLD);
  }

  public predict(faceDescriptors: Float32Array): FaceMatch {
    return this.faceMather.findBestMatch(faceDescriptors);
  }
}
