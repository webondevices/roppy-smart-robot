'use strict';

const AWS = require('aws-sdk');

const uuid = require('node-uuid');
const fs = require('fs-extra');
const path = require('path');
const config = require('./config')

const rekognition = new AWS.Rekognition({region: config.region});
AWS.config.region = config.region;

function createCollection() {
	rekognition.createCollection( { "CollectionId": config.collectionName }, (err, data) => {
        if (err) {
            console.log(err, err.stack);
        } else {
            console.log('Created collection: ', data);
        }
	});
}

function indexFaces() {
	const klawSync = require('klaw-sync')
	const paths = klawSync('./faces', {nodir: true, ignore: ["*.json"]});

	paths.forEach(file => {
		console.log('Loading: ', file.path);
		const p = path.parse(file.path);
		const name = p.name.replace(/\W/g, '');
		const bitmap = fs.readFileSync(file.path);

		rekognition.indexFaces({
		    "CollectionId": config.collectionName,
		    "DetectionAttributes": ["ALL"],
		    "ExternalImageId": name,
		    "Image": { 
			    "Bytes": bitmap
		    }
		}, (err, data) => {
			if (err) {
				console.log(err, err.stack);
			} else {
				console.log('Indexed image: ', data);
				fs.writeJson(file.path + ".json", data, err => {
					if (err) return console.error(err)
				});
			}
		});
	});
}

createCollection();
indexFaces();
