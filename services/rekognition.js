'use strict';

const AWS = require('aws-sdk');
const fs = require('fs-extra');
const config = require('./../config').rekognition;

const rekognition = new AWS.Rekognition({region: config.region});

function getFaceDetails(imagePath) {
	const bitmap = fs.readFileSync(imagePath);

	return new Promise((resolve, reject) => {
		rekognition.detectFaces({
			"Image": { 
				"Bytes": bitmap
			},
			"Attributes": ["ALL"]
		})
		.promise()
		.then(result => {
			resolve([result, imagePath])
		})
		.catch(reject);
	});
}

function faceSearch(imagePath) {
	const bitmap = fs.readFileSync(imagePath);

	return new Promise((resolve, reject) => {
		rekognition.searchFacesByImage({
			"CollectionId": config.collectionName,
			"FaceMatchThreshold": config.FaceMatchThreshold,
			"Image": { 
				"Bytes": bitmap
			},
			"MaxFaces": config.MaxFaces
		})
		.promise()
		.then(result => {
			resolve([result, imagePath])
		})
		.catch(reject);
	});
}

function detectLabels(imagePath) {
	const bitmap = fs.readFileSync(imagePath);

	return new Promise((resolve, reject) => {
		rekognition.detectLabels({
			"Image": { 
				"Bytes": bitmap
			},
			"MaxLabels": config.MaxLabels,
			"MinConfidence": config.MinConfidence
		})
		.promise()
		.then(result => {
			resolve([result, imagePath])
		})
		.catch(reject);
	});
}

module.exports.detectLabels = detectLabels;
module.exports.faceSearch = faceSearch;
module.exports.getFaceDetails = getFaceDetails;