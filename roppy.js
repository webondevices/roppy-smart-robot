'use strict';

const rekognition = require('./services/rekognition');
const photo = require('./services/photo');

function start () {
    const fileName = Date.now();

    photo.capture({
        size: '640x480',
        fileName: fileName + '.jpg'
    })
    .then(rekognition.faceSearch)
    .then(faces => {
        const face = faces.FaceMatches[0].Face;
        console.log('Found: ', face.ExternalImageId);
        console.log('Confidence: ', face.Confidence);
    })
    .catch(console.error);
}

start();

// rekognition
//     .faceSearch('./poc_experiments/mate-test.jpg')
//     .then(faces => {
//         const face = faces.FaceMatches[0].Face;
//         console.log('Found: ', face.ExternalImageId);
//         console.log('Confidence: ', face.Confidence);
//     })
//     .catch(console.error);

// rekognition
//     .detectLabels('./poc_experiments/IMG_0342.jpg')
//     .then(labels => {
//         console.log('Success: ', JSON.stringify(labels));
//     })
//     .catch(console.error);
