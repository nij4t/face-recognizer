import { Model } from "./Model";
import { Classifier } from "./Classifier";
import { DescriptorsGenerator } from "./DescriptorGenerator";
import { Predictor } from "./Predictor";
import { ImageLoader } from "./ImageLoader";

process.env["TF_CPP_MIN_LOG_LEVEL"] = "2";

export default class FaceRecognizer {
  private static instance: FaceRecognizer;

  private model: Model;
  private classifier: Classifier;
  private descriptorGenerator: DescriptorsGenerator;
  private predictor: Predictor;
  private imageLoader: ImageLoader;


  constructor() {
    this.model = new Model();
    this.classifier = new Classifier();
    this.descriptorGenerator = DescriptorsGenerator.getInstance();
    this.imageLoader = new ImageLoader();
  }

  static getInstance(): FaceRecognizer {
    if (!this.instance) {
      this.instance = new FaceRecognizer();
    }
    return this.instance;
  }

  public ready(cb: Function) {
    this.descriptorGenerator.loadNetworks().then(() => cb.call(this)) 
  }

  public load(src: string) {
    this.model.deserialize(src);
  }

  public save(path: string) {
    this.model.serialize(path);
  }

  public async train(dir: string) {
    const imageSets = 
    this.classifier.getImageSets(dir);
    const descriptors = await this.descriptorGenerator.getAllLabeledDescriptors(
      imageSets
    );
    this.model.setDescriptors(descriptors);
  }

  public async predict(src: string) {
    this.predictor = new Predictor(this.model);
    return this.predictor.predict(
      await this.descriptorGenerator.getFaceDescriptorsAsync(
        this.imageLoader.load(src)
      )
    );
  }

}
