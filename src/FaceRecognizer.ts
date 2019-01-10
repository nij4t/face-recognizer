import * as faceapi from "face-api.js";
import { Canvas, Image, ImageData } from "canvas";
import { readdirSync, writeFileSync, readFileSync } from "fs";

require("@tensorflow/tfjs-node");
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

export default class FaceRecognizer {
  private static instance: FaceRecognizer;

  private labeledFaceDescriptors = new Array<faceapi.LabeledFaceDescriptors>();
  private MODEL_URI = "./models/";
  private DISTANCE_THRESHOLD = 0.6;

  public onnetworkready: Function;
  public onnetworktrained: Function;

  private constructor() {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(this.MODEL_URI),
      faceapi.nets.faceLandmark68Net.loadFromDisk(this.MODEL_URI),
      faceapi.nets.faceRecognitionNet.loadFromDisk(this.MODEL_URI)
    ]).then(() => this.onnetworkready());
  }

  static getInstance(): FaceRecognizer {
    if (!this.instance) {
      this.instance = new FaceRecognizer();
    }
    return this.instance;
  }

  public async train(dir: string) {
    const labels = this.getClassNames(dir);
    const labeledDescriptions = await this.getAllLabeledDescriptors(labels, dir);
    this.labeledFaceDescriptors.push(
      ...labeledDescriptions
    );
    this.onnetworktrained();
  }

  public deserialize(path: string) {
    const deserialized = JSON.parse(readFileSync(path).toString()).map(
      fr =>
        new faceapi.LabeledFaceDescriptors(
          fr._label,
          Object.values(fr._descriptors).map(
            val => new Float32Array(Object.values(val))
          )
        )
    );
    this.labeledFaceDescriptors = deserialized;
  }

  public serialize(path: string) {
    const serializable = this.labeledFaceDescriptors.map(descriptor => ({
      _label: descriptor.label,
      _descriptors: Object.values(descriptor.descriptors).map(val =>
        Object.values(val)
      )
    }));
    writeFileSync(path, JSON.stringify(serializable));
  }

  public async predict(src: string) {
    const faceMatcher = new faceapi.FaceMatcher(
      this.labeledFaceDescriptors,
      this.DISTANCE_THRESHOLD
    );
    return faceMatcher.findBestMatch(
      await this.getFaceDescriptorsAsync(this.loadImage(src))
    );
  }

  private loadImage(src): HTMLImageElement {
    const image = new Image();
    image.src = src;
    return image;
  }

  private getClassNames(dir: string): string[] {
    return readdirSync(dir);
  }

  private async getFaceDescriptorsAsync(image: HTMLImageElement) {
    return (await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor()).descriptor;
  }

  private getDescriptorSetAsync(images: HTMLImageElement[]) {
    return Promise.all(
      images.map(async image => await this.getFaceDescriptorsAsync(image))
    );
  }

  private getLabeledDescriptors(
    label: string,
    descriptors: Float32Array[]
  ): faceapi.LabeledFaceDescriptors {
    return new faceapi.LabeledFaceDescriptors(label, descriptors);
  }

  private async getImagesAsync(label, origin) {
    const src = origin + label;
    return readdirSync(src).map(file => this.loadImage(src + "/" + file));
  }

  private getAllLabeledDescriptors(labels: string[], origin: string) {
    return Promise.all(
      labels.map(async label => {
        const images = await this.getImagesAsync(label, origin);
        const descriptors = await this.getDescriptorSetAsync(images);
        return this.getLabeledDescriptors(label, descriptors);
      })
    );
  }
}
// TODO: High Cohesive Refactor 
