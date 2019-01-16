import * as faceapi from "face-api.js";
import { Canvas, Image, ImageData } from "canvas";
import { readdirSync, writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import { DescriptorIOHander } from "./DescriptorIOHander";

require("@tensorflow/tfjs-node");
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

process.env['TF_CPP_MIN_LOG_LEVEL'] = '2'

export default class FaceRecognizer {
  private static instance: FaceRecognizer;

  private labeledFaceDescriptors = new Array<faceapi.LabeledFaceDescriptors>();
  private MODEL_URI = resolve(__dirname, "../models");
  private DISTANCE_THRESHOLD = 0.6;
  private ioHandler = new DescriptorIOHander(this.labeledFaceDescriptors);
  public onnetworkready: Function = () => {};
  public onnetworktrained: Function = () => {};

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
  /**
   * @param classPath Specify path for your classes
   */
  public async train(classPath: string) {
    const labels = this.getClassNames(classPath);
    const labeledDescriptions = await this.getAllLabeledDescriptors(
      labels,
      classPath
    );
    this.labeledFaceDescriptors.push(...labeledDescriptions);
    this.onnetworktrained();
  }
  /**
   * @param path Path to the object that stores biases for your model
   */
  public deserialize(path: string): void {
    this.labeledFaceDescriptors = this.ioHandler.deserialize(path);
  }
  /**
   *
   * @param path Desired path for saving biases of your model
   */
  public serialize(path: string) {
    this.ioHandler.serialize(path)
  }
  /**
   *
   * @param src Image file path to for prediction
   */
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
    image.src = resolve(src);
    return image;
  }

  private getClassNames(dir: string): string[] {
    return readdirSync(resolve(dir));
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
    const src = resolve(origin, label);
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
