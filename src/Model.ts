import { LabeledFaceDescriptors } from "face-api.js";
import { ISerializable } from "./ISerializable";
import { IDeserializable } from "./IDeserializable";
import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

export class Model
  implements ISerializable, IDeserializable<LabeledFaceDescriptors[]> {
  private descriptors: LabeledFaceDescriptors[];

  deserialize(path: string): void {
    const deserialized = JSON.parse(readFileSync(resolve(path)).toString()).map(
      fr =>
        new LabeledFaceDescriptors(
          fr._label,
          Object.values(fr._descriptors).map(
            val => new Float32Array(Object.values(val))
          )
        )
    );
    this.descriptors = deserialized;
  }

  serialize(path: string): void {
    const serializable = this.descriptors.map(descriptor => ({
      _label: descriptor.label,
      _descriptors: Object.values(descriptor.descriptors).map(val =>
        Object.values(val)
      )
    }));

    writeFileSync(resolve(path), JSON.stringify(serializable));
  }

  getDescriptors(): LabeledFaceDescriptors[] {
    return this.descriptors;
  }

  setDescriptors(descriptors: LabeledFaceDescriptors[]): void {
    this.descriptors = descriptors.map(
      descriptor => new LabeledFaceDescriptors(descriptor.label, descriptor.descriptors)
    )
  }
}
