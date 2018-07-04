'use strict';
const deviceModule = require('aws-iot-device-sdk').device;
const Raspi = require('raspi-io');
const five = require('johnny-five');
const board = new five.Board({
  io: new Raspi()
});

const LED_PIN = 7;
let led;

function setLED(value) {
    led = led || new five.Led(`P1-${LED_PIN}`);
    
    if (value) {
        led.on();
    } else {
        led.off();
    }
}

function processTest() {
    const device = deviceModule({
        keyPath: 'roppyTheRobot.private.key',
        certPath: 'roppyTheRobot.cert.pem',
        caPath: 'root-CA.crt',
        clientId: 'roppyTheRobot',
        host: 'a1dofbbl9cybm6.iot.eu-west-2.amazonaws.com'
    });

    device.subscribe('switchLight');

    device.on('message', function(topic, payload) {
        switch (topic) {
            case 'switchLight':
                const parsedLoad = JSON.parse(payload);
                const newState = parsedLoad.state;

                switch (newState) {
                    case 'on':
                        console.log('Switching lights ON');
                        setLED(true);
                        break;
                    
                    case 'off':
                        console.log('Switching lights OFF');
                        setLED(false);
                        break;

                    default:
                        console.log('State not recognised: ', newState);
                        break;
                }
                break;

            default:
                console.log('Topic not recognised: ', topic);
                break;
        }
    });

    device.on('connect', function() {
        console.log('connect');
    });
    device.on('close', function() {
        console.log('close');
    });
    device.on('reconnect', function() {
        console.log('reconnect');
    });
    device.on('offline', function() {
        console.log('offline');
    });
    device.on('error', function(error) {
        console.log('error', error);
    });
}

board.on('ready', processTest);
