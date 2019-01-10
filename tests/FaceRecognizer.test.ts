import { assert } from "chai";
import FaceRecognizer from "../src/FaceRecognizer";

suite("FaceRecognizer Test Suite", () => {
  const path = "./data/training/";
  const testImagePath = "./data/test/rock.jpg";
  const serializedBiasesPath = "./data/trained/test_biases.json";
  const fr = FaceRecognizer.getInstance();

  test("Create FaceRecognizer instance", done => {
    assert.isNotNull(fr);
    assert.instanceOf(fr, FaceRecognizer);
    done();
  });

  test("Load models successful", done => {
    fr.onnetworkready = () => done();
  });

  test("train network", done => {
    fr.train(path);
    fr.onnetworktrained = () => {
      done();
    };
  });

  test("serialization", done => {
    fr.serialize(serializedBiasesPath);
    done();
  });

  test("deserialization", done => {
    fr.deserialize(serializedBiasesPath);
    done();
  });

  test("prediction should return Dwayne Johnson", done => {
    fr.predict(testImagePath).then(res => {
      assert.isNotNull(res);
      assert.equal(res.label, "Dwayne Johnson");
      done();
    });
  });
});

// TODO: cover FaceRecognizer with tests
