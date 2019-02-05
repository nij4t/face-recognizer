import { ISerializable } from "./ISerializable";
import { IDeserializable } from "./IDeserializable";
import { ImageSet } from "./ImageSet";
import { readdirSync, statSync } from "fs";
import { resolve } from "path";

export class Classifier implements ISerializable, IDeserializable<ImageSet[]> {
  serialize(path: string): void {
    throw new Error("Method not implemented.");
  }

  deserialize(path: string): void {
    throw new Error("Method not implemented.");
  }

  public getImageSets(dir: string): ImageSet[] {
    return this.getClassNames(dir).map(className => {
      return {
        name: className,
        images: this.getImages(resolve(dir, className)).map(img =>
          resolve(dir, className, img)
        )
      } as ImageSet;
    });
  }

  private getClassNames(dir: string): string[] {
    return readdirSync(resolve(dir)).filter(entity => statSync(resolve(dir, entity)).isDirectory())
  }

  private getImages(dir: string): string[] {
    return readdirSync(dir);
  }
}
