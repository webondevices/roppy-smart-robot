"use strict";

const AWS = require("aws-sdk");
const fs = require("fs-extra");
const config = require("./../config").rekognition;

const rekognition = new AWS.Rekognition({ region: config.region });

function getStrongestEmotion(emotionsArray) {
  const confidences = emotionsArray.map(emotion => emotion.Confidence);
  const highestConfidence = Math.max(...confidences);
  const strongestEmotion = emotionsArray.find(
    emotion => emotion.Confidence === highestConfidence
  );

  return strongestEmotion.Type;
}

function getFaceDetails(imagePath) {
  const bitmap = fs.readFileSync(imagePath);

  return new Promise((resolve, reject) => {
    rekognition
      .detectFaces({
        Image: {
          Bytes: bitmap
        },
        Attributes: ["ALL"]
      })
      .promise()
      .then(result => {
        resolve([result, imagePath]);
      })
      .catch(reject);
  });
}

function faceSearch(imagePath) {
  const bitmap = fs.readFileSync(imagePath);

  return new Promise((resolve, reject) => {
    rekognition
      .searchFacesByImage({
        CollectionId: config.collectionName,
        FaceMatchThreshold: config.FaceMatchThreshold,
        Image: {
          Bytes: bitmap
        },
        MaxFaces: config.MaxFaces
      })
      .promise()
      .then(result => {
        resolve([result, imagePath]);
      })
      .catch(reject);
  });
}

function detectLabels(imagePath) {
  const bitmap = fs.readFileSync(imagePath);

  return new Promise((resolve, reject) => {
    rekognition
      .detectLabels({
        Image: {
          Bytes: bitmap
        },
        MaxLabels: config.MaxLabels,
        MinConfidence: config.MinConfidence
      })
      .promise()
      .then(result => {
        resolve([result, imagePath]);
      })
      .catch(reject);
  });
}

module.exports.detectLabels = detectLabels;
module.exports.faceSearch = faceSearch;
module.exports.getFaceDetails = getFaceDetails;
module.exports.getStrongestEmotion = getStrongestEmotion;
