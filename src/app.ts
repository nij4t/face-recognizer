#!/usr/bin/env node
import * as program from "commander";

import FaceRecognizer from "./FaceRecognizer";

const fr = FaceRecognizer.getInstance();

program
  .version("1.0.0")
  .command("train <classDirPath> <serializedBiasesPath>")
  .description("Train network")
  .action(async (classDirPath, serializedBiasesPath) => {
    await fr.train(classDirPath);
    fr.save(serializedBiasesPath);
  });

program
  .command("predict <serializedBiasesPath> <imageSource>")
  .description("Recognize face from image")
  .action(async (serializedBiasesPath, imageSource) => {
    fr.load(serializedBiasesPath);
    const prediction = await fr.predict(imageSource);
    console.log(prediction.label);
  });

// fr.networkReady = () => program.parse(process.argv);
fr.ready(() => program.parse(process.argv));

// (async () => await fr.train("../face-recognition-data/training/"))();


// TODO: Switch to stateful CLI 
// TODO: Create help screen 