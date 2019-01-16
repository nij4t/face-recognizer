import { LabeledFaceDescriptors } from "face-api.js";
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";
import { ISerializable } from "./ISerializable";
import { IDeserializable } from "./IDeserializable";

export class DescriptorIOHander
  implements ISerializable, IDeserializable<LabeledFaceDescriptors[]> {
  private data: LabeledFaceDescriptors[];

  constructor(data: LabeledFaceDescriptors[]) {
    this.data = data;
  }

  serialize(path: string): void {
    const serializable = this.data.map(descriptor => ({
      _label: descriptor.label,
      _descriptors: Object.values(descriptor.descriptors).map(val =>
        Object.values(val)
      )
    }));

    writeFileSync(resolve(path), JSON.stringify(serializable));
  }

  deserialize(path: string): LabeledFaceDescriptors[] {
    const deserialized = JSON.parse(readFileSync(resolve(path)).toString()).map(
      fr =>
        new LabeledFaceDescriptors(
          fr._label,
          Object.values(fr._descriptors).map(
            val => new Float32Array(Object.values(val))
          )
        )
    );
    return deserialized
  }
}
