import { assert } from "chai";
import FaceRecognizer from "../src/FaceRecognizer";

suite("FaceRecognizer Test Suite", () => {
  let fr = FaceRecognizer.getInstance();

  test("Create FaceRecognizer instance", done => {
    assert.isNotNull(fr);
    assert.instanceOf(fr, FaceRecognizer)
    done();
  });

  test("Load models successful", done => {
    fr.onmodelsready = () => done()
  });

});