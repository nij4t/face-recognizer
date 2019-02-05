import { assert } from "chai";
import { DescriptorsGenerator } from "../src/DescriptorGenerator";
import { testImage } from "./TestImage";

suite("Descriptor generator", () => {
  const dg = DescriptorsGenerator.getInstance();

  test("Loads network", done => {
    dg.loadNetworks().then(() => {
      done();
    });
  }).timeout(10000);

  test("Returns descriptors", done => {
    dg.getFaceDescriptorsAsync(testImage)
      .then(descriptors => {
        assert.isNotNull(descriptors);
        assert.instanceOf(descriptors, Float32Array);
        done();
      })
      .catch(err => {
        assert.fail();
        done();
      });
  });

  test("Returns LabeledFaceDescriptors", done => {
    dg.getAllLabeledDescriptors([{ name: "rock", images: [testImage.src] }])
      .then(labeledFaceDescrs => {
        assert.isNotNull(labeledFaceDescrs);
        assert.isString(labeledFaceDescrs[0].label);
        assert.instanceOf(labeledFaceDescrs[0].descriptors[0], Float32Array)
        done();
      })
      .catch(err => {
        assert.fail();
        done();
      });
  }).timeout(5000);
});
