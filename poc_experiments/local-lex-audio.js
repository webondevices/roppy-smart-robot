'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');
const ts = require('tailstream');
const exec = require('child_process').exec;

exec('export AUDIODEV=hw:1,0');
exec('export AUDIODRIVER=alsa');

const FULFILLED = 'Fulfilled';
const RESPONSE_FILE = 'response.mpeg';
const REMOVE_REQUEST_FILE = 'rm request.wav';
const SOX_COMMAND = 'sox -d -t wavpcm -c 1 -b 16 -r 16000 -e signed-integer --endian little - silence 1 0 2% 5 0.3t 4% > request.wav';
let streaming = false;
let inputStream;
const lexruntime = new AWS.LexRuntime({
    region: 'us-east-1'
});

const setupStream = function () {
    streaming = true;
    inputStream = ts.createReadStream('./request.wav');
   
    const params = {
        botAlias: '$LATEST',
        botName: 'roppySmartRobot',
        userId: 'user',
        contentType: 'audio/l16; rate=16000; channels=1',
        inputStream: inputStream
    };

    lexruntime.postContent(params, (err, data) => {
        if (err) {
            console.log(err, err.stack);
            process.exit(1);
        } else {
            fs.writeFile(RESPONSE_FILE, data.audioStream, (err) => {
                if (err) {
                    console.log(err);
                    process.exit(1);
                }
            });

            const playback = exec('sudo mpg321 ' + RESPONSE_FILE);
            playback.on('close', () => {
                exec('rm ' + RESPONSE_FILE);

                if (data.dialogState !== FULFILLED) {
                    streaming = false;
                    record();
                }
            });
        }
    });
}

const record = function () {
    const recording = exec(SOX_COMMAND);
    recording.stderr.on('data', function(data) {
        console.log(data);
        if (!streaming) {
            setupStream();
        }
    });
    
    recording.on('close', function() {
        inputStream.done();
        exec(REMOVE_REQUEST_FILE);
    });
}

record();
