import FaceRecognizer from "./FaceRecognizer";

const fr = FaceRecognizer.getInstance();
const serializedBiasesPath = "./data/trained/app_biases.json";
const testImagePath = "./data/test/rock.jpg";

fr.onnetworkready = () => {
  // fr.train("./data/training/");
  fr.deserialize(serializedBiasesPath)
  fr.predict(testImagePath).then(res => console.log(res.label))
};

// fr.onnetworktrained = () => {
  // fr.predict(testImagePath).then(prediction =>
//     console.log(prediction.label)
//   );
//   fr.serialize(serializedBiasesPath);
// };


// TODO: Build CLI 