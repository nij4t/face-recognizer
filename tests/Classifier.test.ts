import { assert } from "chai";
import { Classifier } from "../src/Classifier";
// import { existsSync } from "fs";

suite("Classifier", () => {
  const classifier = new Classifier();
  test("Returns ImageSets", done => {
    const imageSets = classifier.getImageSets("./tests/");
    assert.isNotNull(imageSets);
    assert.isArray(imageSets);
    assert.isString(imageSets[0].name);
    assert.isArray(imageSets[0].images);
    assert.isString(imageSets[0].images[0]);
    done();
  });
  test("Serializes", done => {
    const file = "./tests/bucket/test.json";
    // classifier.serialize(file);
    // assert.isTrue(existsSync(file));
    done();
  });
});
