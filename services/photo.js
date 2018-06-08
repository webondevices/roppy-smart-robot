'use strict';

const exec = require('child_process').exec;

function capture(settings) {
    return new Promise((resolve, reject) => {
        exec(`ffmpeg -f avfoundation -video_size ${settings.size} -framerate 30 -i "0" -vframes 1 ${settings.fileName}`, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(settings.fileName);
            }
        });
    });
}

module.exports.capture = capture;