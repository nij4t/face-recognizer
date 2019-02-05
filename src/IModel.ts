import { LabeledFaceDescriptors } from "face-api.js";

export interface IModel {
    getDescriptors(): LabeledFaceDescriptors[];
    setDescriptors(descriptors: LabeledFaceDescriptors[]): void;
}