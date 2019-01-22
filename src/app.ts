import * as cfonts from "cfonts";
import FaceRecognizer from "./FaceRecognizer";
import { existsSync } from "fs";

console.clear();

cfonts.say("Face|Recognizer", {
  font: "block", // define the font face
  align: "center", // define text alignment
  colors: ["green", "black"], // define all colors
  background: "transparent", // define the background color, you can also use `backgroundColor` here as key
  letterSpacing: 1, // define letter spacing
  lineHeight: 1, // define the line height
  space: true, // define if the output text should have empty lines on top and on the bottom
  maxLength: "80" // define how many character can be on one line
});

// TODO: Add help screen 

placeholder();

const modes = {
  COMMAND: 0,
  TRAIN: 1,
  LOAD: 2,
  SAVE: 3,
  PREDICT: 4
};

let mode = modes.COMMAND;

process.stdin.on("data", async chunk => {
  const rawInput = String(chunk);
  const input = rawInput.substring(0, rawInput.length - 1);

  switch (mode) {
    case modes.COMMAND:
      switch (input) {
        case "train":
          mode = modes.TRAIN;
          process.stdout.write("Specify training directory: ");
          break;
        case "save":
          mode = modes.SAVE;
          process.stdout.write("Specify file path: ");
          break;
        case "load":
          mode = modes.LOAD;
          process.stdout.write("Specify model path: ");
          break;
        case "predict":
          mode = modes.PREDICT;
          process.stdout.write("Specify image path: ");
          break;
        case "exit":
          console.log("exiting...");
          process.exit(0);
        default:
          console.log("Invalid command");
          placeholder();
          break;
      }
      break;
    case modes.TRAIN:
      mode = modes.COMMAND;
      if (!validpath(input)) {
        console.log("Invalid path");
        placeholder();
        break;
      }
      await fr.ready(async () => {
        console.log("training model...");
        await fr.train(input);
        console.log("successfully trained");
        placeholder();
      });
      break;
    case modes.LOAD:
      mode = modes.COMMAND;
      if (!validpath(input)) {
        console.log("Invalid path");
        placeholder();
        break;
      }
      console.log("loading model...");
      await fr.load(input);
      console.log("successfully loaded");
      placeholder();
      break;
    case modes.SAVE:
      mode = modes.COMMAND;
      console.log("saving model...");
      await fr.save(input);
      console.log("successfully saved");
      placeholder();
      break;
    case modes.PREDICT:
      mode = modes.COMMAND;
      if (!validpath(input)) {
        console.log("Invalid path");
        placeholder();
        break;
      }
      console.log("predicting...");
      fr.ready(() =>
        fr.predict(input).then(match => {
          console.log(match.label);
          placeholder();
        })
      );
      break;
  }
});

function placeholder() {
  process.stdout.write("\x1b[32m \u25A0\u25B6 face-recognizer\u203A \x1b[0m");
}

function validpath(src: string) {
  return existsSync(src);
}

const fr = FaceRecognizer.getInstance();
