#!/usr/bin/env node
import * as program from "commander";

import FaceRecognizer from "./FaceRecognizer";
import { readFileSync } from "fs";

const fr = FaceRecognizer.getInstance();

program
  .version("1.0.0")
  .command("train <classDirPath> <serializedBiasesPath>")
  .description("Train network")
  .action(async (classDirPath, serializedBiasesPath) => {
    await fr.train(classDirPath);
    fr.serialize(serializedBiasesPath);
  });

program
  .command("predict <serializedBiasesPath> <imageSource>")
  .description("Recognize face from image")
  .action(async (serializedBiasesPath, imageSource) => {
    fr.deserialize(serializedBiasesPath);
    const prediction = await fr.predict(imageSource);
    console.log(prediction.label);
  });

fr.onnetworkready = () => program.parse(process.argv);

// TODO: Create help screen
