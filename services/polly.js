"use strict";

// Load the SDK
const AWS = require("aws-sdk");
const fs = require("fs");
const player = require("play-sound")({});
const config = require("./../config").rekognition;

// Create an Polly client
const Polly = new AWS.Polly({
  signatureVersion: "v4",
  region: config.region
});

function speak(text) {
  let params = {
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Kimberly"
  };

  return new Promise((resolve, reject) => {
    Polly.synthesizeSpeech(params, (error, data) => {
      if (error) {
        reject(error);
      } else if (data) {
        if (data.AudioStream instanceof Buffer) {
          fs.writeFile("./speech.mp3", data.AudioStream, function(error) {
            if (error) {
              reject(error);
            }
            player.play("./speech.mp3", function(error) {
              if (error) {
                reject(error);
              } else {
                resolve();
              }
            });
          });
        }
      }
    });
  });
}

module.exports.speak = speak;
