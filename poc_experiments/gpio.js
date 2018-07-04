'use strict';

const gpio = require('rpi-gpio');

const LED_PIN = 7;
const MOTION_PIN = 11;

function setLED(value) {
    gpio.write(LED_PIN, value, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}

gpio.on('change', function(channel, value) {
    console.log('Channel ' + channel + ' value is now ' + value);
    setLED(value);
});

gpio.setup(LED_PIN, gpio.DIR_OUT, setLED);
gpio.setup(MOTION_PIN, gpio.DIR_IN, gpio.EDGE_BOTH);
 
// var gpio = require('rpi-gpio');
 
// var pin   = 7;
// var delay = 2000;
// var count = 0;
// var max   = 3;
 
// gpio.setup(pin, gpio.DIR_OUT, on);
 
// function on() {
//     if (count >= max) {
//         gpio.destroy(function() {
//             console.log('Closed pins, now exit');
//         });
//         return;
//     }
 
//     setTimeout(function() {
//         gpio.write(pin, 1, off);
//         count += 1;
//     }, delay);
// }
 
// function off() {
//     setTimeout(function() {
//         gpio.write(pin, 0, on);
//     }, delay);
// }

// gpio.setup(LED_PIN, gpio.DIR_OUT, setLED);
// gpio.setup(MOTION_PIN, gpio.DIR_IN, readMotion);
 
// function readMotion(err) {
//     if (err) throw err;
    
//     gpio.read(MOTION_PIN, function(err, value) {
//         if (err) throw err;
//         console.log('The value is ' + value);

//         setLED(value);
//     });
// }

// function setLED(value) {
//     gpio.write(LED_PIN, value, function(err) {
//         if (err) throw err;
//         console.log('Written to pin');
//     });
// }