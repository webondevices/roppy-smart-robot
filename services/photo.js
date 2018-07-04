'use strict';

const exec = require('child_process').exec;

function capture(settings) {
    return new Promise((resolve, reject) => {
        if (settings.environment === 'mac') {
            exec(`ffmpeg -f avfoundation -video_size ${settings.size} -framerate 30 -i "0" -vframes 1 ${settings.fileName}`, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(settings.fileName);
                }
            });
        }

        if (settings.environment === 'pi') {
            const sizes = settings.size.split('x');
            exec(`raspistill -o ${settings.fileName} --width ${sizes[0]} --height ${sizes[1]} --timeout 500`, (error, stdout, stderr) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(settings.fileName);
                }
            });
        }
    });
}

module.exports.capture = capture;