import { Image } from "canvas";
import { resolve } from "path";

const imageSource = resolve(__dirname, "./assets/Dwayne Johnson/rock.jpg");
export const testImage: HTMLImageElement = new Image();
testImage.src = imageSource;
