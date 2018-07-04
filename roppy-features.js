'use strict';

const gpio = require('rpi-gpio');
const rekognition = require('./services/rekognition');
const photo = require('./services/photo');
const polly = require('./services/polly');

const MOTION_PIN = 11;

function interpretFaces (faces) {
    if (faces.hasOwnProperty('FaceMatches')) {
        const face = faces.FaceMatches[0].Face;
        polly.speak(`Hi, ${face.ExternalImageId}! How are you today?`);
    }  else {
        polly.speak(`Hello! Who are you? I don't recognise you!`);
    }
}

function recogniseFaces () {
    const fileName = Date.now();

    photo.capture({
        size: '640x480',
        fileName: fileName + '.jpg',
        environment: 'pi'
    })
    .then(rekognition.faceSearch)
    .then(interpretFaces)
    .catch(console.error);
}

gpio.setup(MOTION_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);

gpio.on('change', function(channel, value) {
    if (channel === MOTION_PIN && value === true) {
        recogniseFaces();
    }
});
// const rekognition = require('./services/rekognition');
// const photo = require('./services/photo');

// function recogniseFaces () {
//     const fileName = Date.now();

//     photo.capture({
//         size: '640x480',
//         fileName: fileName + '.jpg',
//         environment: 'pi'
//     })
//     .then(rekognition.faceSearch)
//     .then(faces => {
//         const face = faces.FaceMatches[0].Face;
//     })
//     .catch(console.error);
// }

// recogniseFaces();

// rekognition
//     .faceSearch('./poc_experiments/mate-test.jpg')
//     .then(faces => {
//         const face = faces.FaceMatches[0].Face;
//     })
//     .catch(console.error);

// rekognition
//     .detectLabels('./poc_experiments/IMG_0342.jpg')
//     .then(labels => {
//     })
//     .catch(console.error);

// const deviceModule = require('aws-iot-device-sdk').device;
// const gpio = require('rpi-gpio');

// gpio.setup(7, gpio.DIR_OUT, write);

// function connectMQTT() {
//     const device = deviceModule({
//         keyPath: 'roppyTheRobot.private.key',
//         certPath: 'roppyTheRobot.cert.pem',
//         caPath: 'root-CA.crt',
//         clientId: 'roppyTheRobot',
//         host: 'a1dofbbl9cybm6.iot.eu-west-2.amazonaws.com'
//     });

//     // Working with MQTT topics
//     device.subscribe('LED');

//     device.on('message', function(topic, payload) {
//         switch (topic) {
//             case 'LED':
//                 if (payload.light === 'on') {
//                     gpio.write(7, true, (err) => {
//                         if (err) throw err;
//                     });
//                 }
//                 if (payload.light === 'off') {
//                     gpio.write(7, false, (err) => {
//                         if (err) throw err;
//                     });
//                 }
//                 break;
//             default:
//                 break;
//         }
//     });
    
//     // Updating device shadow
//     device.publish('topic_2', JSON.stringify({
//         mode1Process: 'Hello'
//     }));

//     device

// }

// connectMQTT();
