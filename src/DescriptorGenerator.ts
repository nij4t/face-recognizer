import * as faceapi from "face-api.js";
import { Image, ImageData, Canvas } from "canvas";
import { resolve } from "path";
import { ImageSet } from "./ImageSet";
import { ImageLoader } from "./ImageLoader";
// import { NetworkStatus } from "./NetworkStatus";

require("@tensorflow/tfjs-node");
faceapi.env.monkeyPatch({ Image, ImageData, Canvas });

export class DescriptorsGenerator {
  private MODEL_URI = resolve(__dirname, "../models");
  private networkready = false;
  private static instance;
  // private networkCallback: NetworkStatus;

  constructor(modelUri?: string) {
    // if (modelUri) this.MODEL_URI = resolve(modelUri);
    // this.loadNetworks();
  }

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
    // await this.loadNetworks();
    return (await faceapi
      .detectSingleFace(image)
      .withFaceLandmarks()
      .withFaceDescriptor()).descriptor;
  }

 public loadNetworks() {
    return Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromDisk(this.MODEL_URI),
      faceapi.nets.faceLandmark68Net.loadFromDisk(this.MODEL_URI),
      faceapi.nets.faceRecognitionNet.loadFromDisk(this.MODEL_URI)
    ]); //.then(() => this.onnetworkready());
  }

  // private onnetworkready() {
  //   this.networkready = true;
  //   this.networkCallback.networkReady();
  // }

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

  // public setNetworkReadyHandler(hander: NetworkStatus) {
  //   this.networkCallback = hander;
  // }
}
