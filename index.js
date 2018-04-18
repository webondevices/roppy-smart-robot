'use strict';

const rek = require('./rekognise');
const exec = require('child_process').exec;

function init () {
    const fileName = Date.now();
    exec(`ffmpeg -f avfoundation -video_size 640x480 -framerate 30 -i "0" -vframes 1 ${fileName}.jpg`, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
        } else {
            rek.faceSearch(fileName + '.jpg');
        }
    });
}

init();

// rek.faceSearch('mate-test.jpg');
