import { assert } from "chai";
import { ImageLoader } from "../src/ImageLoader";
import { resolve } from "path";

suite("ImageLoader", () => {
  test("Return HTMLImageElement", done => {
    const image = new ImageLoader().load(
      resolve(__dirname, "./assets/rock.jpg")
    );
    assert.isNotNull(image);
    done();
  });
});
