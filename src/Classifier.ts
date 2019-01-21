import { ISerializable } from "./ISerializable";
import { IDeserializable } from "./IDeserializable";
import { ImageSet } from "./ImageSet";
import { readdirSync } from "fs";
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
        images: this.getImages(resolve(dir, className))
      };
    });
  }

  private getClassNames(dir: string): string[] {
    return readdirSync(resolve(dir));
  }

  private getImages(dir: string): string[] {
    return readdirSync(dir);
  }

}
