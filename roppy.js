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
  const now = Date.now();

  // If delay has passed
  if (now - previousGreeting > GREETING_DELAY) {
    previousGreeting = now;

    // Capture photo then pass it for face recognition
    photo
      .capture(config.photo)
      .then(rekognition.faceSearch)
      .then(interpretFaces)
      .catch(console.error);
  }
}

function interpretLabels([labels, fileName]) {
  if (labels.Labels.length > 0) {
    // Greet person then make not of visible object
    const message = `I can see a ${labels.Labels[0].Name}, a ${
      labels.Labels[1].Name
    } and also a ${labels.Labels[2].Name}.`;
    polly.speak(message).catch(console.error);
  } else {
    polly
      .speak("I'm sorry, but I really don't see anything!")
      .catch(console.error);
  }
}

function interpretSurroundings() {
  // Capture photo then pass it for object recognition
  photo
    .capture(config.photo)
    .then(rekognition.detectLabels)
    .then(interpretLabels)
    .catch(console.error);
}

function getFaceDetails(callback) {
  // Capture photo then pass it for face recognition
  photo
    .capture(config.photo)
    .then(rekognition.getFaceDetails)
    .then(callback)
    .catch(console.error);
}

function tellAge() {
  getFaceDetails(details => {
    if (details[0].hasOwnProperty("FaceDetails")) {
      const features = details[0].FaceDetails[0];
      const ageAverage = parseInt(
        (features.AgeRange.Low + features.AgeRange.High) / 2
      );

      // Interpret facial features
      polly
        .speak(`you seem to be approximately ${ageAverage} years old.`)
        .catch(console.error);
    }
  });
}

function tellSex() {
  getFaceDetails(details => {
    if (details[0].hasOwnProperty("FaceDetails")) {
      const features = details[0].FaceDetails[0];
      const gender = features.Gender.Value.toLowerCase();
      const sex = gender === "male" ? "man" : "woman";

      // Interpret facial features
      polly.speak(`I think you are a ${sex}.`).catch(console.error);
    }
  });
}

function handleNewMessage(topic, payload) {
  if (topic === config.mqtt.topic) {
    const parsedLoad = JSON.parse(payload);
    const command = parsedLoad.command;

    switch (command) {
      case "interpretSurroundings":
        interpretSurroundings();
        break;

      case "tellAge":
        tellAge();
        break;

      case "tellSex":
        tellSex();
        break;

      default:
        console.log("Command not recognised: ", command);
        break;
    }
  }
}

function subscribeMQTT(suscriptionTopic) {
  const device = deviceModule({
    keyPath: config.mqtt.keyPath,
    certPath: config.mqtt.certPath,
    caPath: config.mqtt.caPath,
    clientId: config.mqtt.clientId,
    host: config.mqtt.host
  });

  device.subscribe(suscriptionTopic);

  device.on("message", handleNewMessage);
}

function initialise() {
  // Subscribe to MQTT topic
  subscribeMQTT(config.mqtt.topic);

  // Init time of previous greeting
  previousGreeting = Date.now() - GREETING_DELAY;

  // Init motion sensor component
  motionSensor = motionSensor || new five.Motion(`P1-${MOTION_PIN}`);

  // When motion is detected, start face recognition
  motionSensor.on("motionstart", recogniseFaces);
}

board.on("ready", initialise);
