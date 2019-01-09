"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// console.log(faceapi.nets)
// console.log(faceapi.FaceRecognitionNet)
const MODEL_URL = "/models"; //"http://localhost:5000/models"; //path.resolve(__dirname, "./models");
// const weights = require('./static/models/**/*')
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const image = document.getElementById("face");
        // new faceapi.SsdMobilenetv1().load(await faceapi.fetchNetWeights('http://localhost:5000/models/ssd_mobilenetv1_model-weights_manifest.json'))    
        // await faceapi.loadSsdMobilenetv1Model(MODEL_URL)
        // await faceapi.loadFaceLandmarkModel(MODEL_URL)
        // await faceapi.loadFaceRecognitionModel(MODEL_URL)
        // await faceapi.loadTinyFaceDetectorModel(MODEL_URL)
        console.log(1);
        // console.log(faceapi.nets);
    });
}
run();
