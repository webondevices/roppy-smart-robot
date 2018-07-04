'use strict';

const rekognition = require('./services/rekognition');
const photo = require('./services/photo');
const polly = require('./services/polly');

const Raspi = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new Raspi()
});

const MOTION_PIN = 11;
let motionSensor;

const GREETING_DELAY = 20000;
let previousGreeting;

function getStrongestEmotion(emotionsArray) {
    let strongestEmotion;
    let max = 0;
    
    emotionsArray.forEach(emotion => {
        if (emotion.Confidence > max) {
            strongestEmotion = emotion.Type;
            max = emotion.Confidence;
        }
    });

    return strongestEmotion;
}

function interpretFeatures (details) {

    if (details[0].hasOwnProperty('FaceDetails')) {

        const features = details[0].FaceDetails[0];
        const ageAverage = parseInt((parseInt(features.AgeRange.Low) + parseInt(features.AgeRange.High)) / 2);
        const gender = features.Gender.Value.toLowerCase();
        const emotion = getStrongestEmotion(features.Emotions);

        console.log(features, ageAverage, gender, emotion);

        polly.speak(`You look a bit ${emotion}`)
        .then(() => {
            const sex = gender === 'male' ? 'man' : 'woman';
            return polly.speak(`You are a ${sex} and you seem to be approximately ${ageAverage} years old.`);
        })
        .catch(console.error);
    }
}

function interpretFaces ([faces, fileName]) {

    if (faces.hasOwnProperty('FaceMatches')) {
        const face = faces.FaceMatches[0].Face;
        polly.speak(`Hi, ${face.ExternalImageId}! How are you today?`)
        .then(() => {
            console.log('SPOKEN, init face details with', fileName);
            return rekognition.getFaceDetails(fileName)
        })
        .then(interpretFeatures)
        .catch(console.error);
    }  else {
        polly.speak('Hello! Who are you? I don\'t recognise you!')
        .catch(console.error);
    }
}

function recogniseFaces () {
    const fileName = Date.now();

    if (fileName - previousGreeting > GREETING_DELAY) {
        previousGreeting = fileName;

        console.log('CAPTURE AND RESET');

        photo.capture({
            size: '640x480',
            fileName: fileName + '.jpg',
            environment: 'pi'
        })
        .then(rekognition.faceSearch)
        .then(interpretFaces)
        .catch(console.error);
    } else {
        console.log('DELAY IS: ', fileName - previousGreeting);
    }
}

function initialise () {
    previousGreeting = Date.now() - GREETING_DELAY;
    motionSensor = motionSensor || new five.Motion(`P1-${MOTION_PIN}`);
    motionSensor.on('motionstart', recogniseFaces);
}

board.on('ready', initialise);
