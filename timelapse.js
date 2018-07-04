'use strict';

const photo = require('./services/photo');

const DELAY = 300;
let count = 0;

setInterval(() => {
    photo.capture({
        size: '640x480',
        fileName: `photo${++count}.jpg`
    });
}, DELAY * 1000);