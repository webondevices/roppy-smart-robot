'use strict';

const AWS = require('aws-sdk');

const uuid = require('node-uuid');
const fs = require('fs-extra');
const path = require('path');
const config = require('./config');

const rekognition = new AWS.Rekognition({region: config.region});
AWS.config.region = config.region;

function faceSearch(imagePath) {
	const bitmap = fs.readFileSync(imagePath);

	rekognition.searchFacesByImage({
		"CollectionId": config.collectionName,
		"FaceMatchThreshold": 80,
		"Image": { 
			"Bytes": bitmap,
		},
		"MaxFaces": 1
	}, (err, data) => {
		if (err) {
			console.log(err, err.stack);
		} else {
			// console.log('Success: ', data);
            // console.log(JSON.stringify(data.FaceMatches[0].Face));
            const face = data.FaceMatches[0].Face;
            console.log('Found: ', face.ExternalImageId);
            console.log('Confidence: ', face.Confidence);
		}
	});
}

function detectLabels(imagePath) {
	const bitmap = fs.readFileSync(imagePath);

	const params = {
		Image: { 
			Bytes: bitmap
		},
		MaxLabels: 10,
		MinConfidence: 50.0
	};

	rekognition.detectLabels(params, (err, data) => {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log('Success: ', JSON.stringify(data));
		}
	});
}

module.exports.detectLabels = detectLabels;
module.exports.faceSearch = faceSearch;