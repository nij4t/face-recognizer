import { resolve } from "path";
import { readdirSync } from "fs";
import { Image } from "canvas";

export class ImageLoader {

  public load(src: string): HTMLImageElement {
    const image = new Image();
    image.src = resolve(src);
    return image;
  }

}
