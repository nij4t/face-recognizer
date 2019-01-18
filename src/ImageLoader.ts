import { resolve } from "path";
import { readdirSync } from "fs";
import { Image } from "canvas";

export class ImageLoader {
  public load(src: string) {
    const image = new Image();
    image.src = resolve(src);
    return image;
  }
  public getImagesAsync(origin: string) {
    const src = resolve(origin);
    return readdirSync(src).map(file => this.load(src + "/" + file));
  }
}
