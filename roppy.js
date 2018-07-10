"use strict";

const rekognition = require("./services/rekognition");
const photo = require("./services/photo");
const polly = require("./services/polly");

const Raspi = require("raspi-io");
const five = require("johnny-five");
const board = new five.Board({
  io: new Raspi()
});

const MOTION_PIN = 11;
let motionSensor;

const GREETING_DELAY = 20000;
let previousGreeting;

function interpretFeatures(details) {
  if (details[0].hasOwnProperty("FaceDetails")) {
    const features = details[0].FaceDetails[0];
    const ageAverage = parseInt(
      (parseInt(features.AgeRange.Low) + parseInt(features.AgeRange.High)) / 2
    );
    const gender = features.Gender.Value.toLowerCase();
    const emotion = rekognition.getStrongestEmotion(features.Emotions);

    // Interpret facial features
    polly
      .speak(`You look a bit ${emotion}`)
      .then(() => {
        const sex = gender === "male" ? "man" : "woman";
        return polly.speak(
          `You are a ${sex} and you seem to be approximately ${ageAverage} years old.`
        );
      })
      .catch(console.error);
  }
}

function interpretFaces([faces, fileName]) {
  if (faces.hasOwnProperty("FaceMatches")) {
    const face = faces.FaceMatches[0].Face;

    // Greet person then analise face
    polly
      .speak(`Hi, ${face.ExternalImageId}! How are you today?`)
      .then(() => {
        return rekognition.getFaceDetails(fileName);
      })
      .then(interpretFeatures)
      .catch(console.error);
  } else {
    polly
      .speak("Hello! Who are you? I don't recognise you!")
      .catch(console.error);
  }
}

function recogniseFaces() {
  const fileName = Date.now();

  // If delay has passed
  if (fileName - previousGreeting > GREETING_DELAY) {
    previousGreeting = fileName;

    // Capture photo from camera then pass it for face recognition
    photo
      .capture({
        size: "640x480",
        fileName: fileName + ".jpg",
        environment: "pi"
      })
      .then(rekognition.faceSearch)
      .then(interpretFaces)
      .catch(console.error);
  }
}

function initialise() {
  // Init time of previous greeting
  previousGreeting = Date.now() - GREETING_DELAY;

  // Init motion sensor component
  motionSensor = motionSensor || new five.Motion(`P1-${MOTION_PIN}`);

  // When motion is detected, start face recognition
  motionSensor.on("motionstart", recogniseFaces);
}

board.on("ready", initialise);
