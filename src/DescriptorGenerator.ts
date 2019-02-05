import { nets, detectSingleFace, WithFaceLandmarks, WithFaceDescriptor, env, LabeledFaceDescriptors } from "face-api.js";
import { Image, ImageData, Canvas } from "canvas";
import { resolve } from "path";
import { ImageSet } from "./ImageSet";
import { ImageLoader } from "./ImageLoader";

require("@tensorflow/tfjs-node");
env.monkeyPatch({ Image, ImageData, Canvas });

export class DescriptorsGenerator {
  private MODEL_URI = resolve(__dirname, "../models");
  private networkready = false;
  private static instance: DescriptorsGenerator;

  private constructor() {}

  public static getInstance() {
    if (!this.instance) {
      this.instance = new DescriptorsGenerator();
    }
    return this.instance;
  }

  public getAllLabeledDescriptors(imageSets: ImageSet[]) {
    const imageLoader = new ImageLoader();
    return Promise.all(
      imageSets.map(async imageSet => {
        const images = await imageSet.images.map(img => imageLoader.load(img));
        const descriptorSet = await this.getDescriptorSetAsync(images);
        return this.getLabeledDescriptors(imageSet.name, descriptorSet);
      })
    );
  }

  public async getFaceDescriptorsAsync(image: HTMLImageElement) {
    return (await 
      detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor()).descriptor;
  }

  public loadNetworks() {
    return Promise.all([
      nets.ssdMobilenetv1.loadFromDisk(this.MODEL_URI),
      nets.faceLandmark68Net.loadFromDisk(this.MODEL_URI),
      nets.faceRecognitionNet.loadFromDisk(this.MODEL_URI)
    ]);
  }

  private getDescriptorSetAsync(images: HTMLImageElement[]) {
    return Promise.all(
      images.map(async image => await this.getFaceDescriptorsAsync(image))
    );
  }

  private getLabeledDescriptors(
    label: string,
    descriptors: Float32Array[]
  ): LabeledFaceDescriptors {
    return new LabeledFaceDescriptors(label, descriptors);
  }
}
