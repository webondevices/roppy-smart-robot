'use strict';

var AWS = require('aws-sdk');
var iotdata = new AWS.IotData({endpoint: 'a1dofbbl9cybm6.iot.eu-west-2.amazonaws.com'});

//
// Helpers to build responses which match the structure of the necessary dialog actions

function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,
        },
    };
}

function close(sessionAttributes, fulfillmentState, message) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
        },
    };
}

function delegate(sessionAttributes, slots) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots,
        },
    };
}

function getTime (intentRequest, callback) {
    const now = new Date();
    callback(
        close(intentRequest.sessionAttributes,
        'Fulfilled',
        {
            contentType: 'PlainText',
            content: `It is ${now.getHours()} ${now.getMinutes()} right now!`
        }));
}

function switchLight (intentRequest, callback) {
    
    const slots = intentRequest.currentIntent.slots;
    const newState = slots.state;

    const params = {
        topic: 'switchLight',
        payload: `{"state": ${newState}}`,
        qos: 0
    };
    
    iotdata.publish(params, function(err, data){
        if (err) {
            console.log(err);
        } else {
            callback(
                close(intentRequest.sessionAttributes,
                'Fulfilled',
                {
                    contentType: 'PlainText',
                    content: 'Okay, done!'
                }));
        }
    });
}

function dispatch(intentRequest, callback) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

    const intentName = intentRequest.currentIntent.name;

    if (intentName === 'getTime') {
        return getTime(intentRequest, callback);
    }

    if (intentName === 'switchLight') {
        return switchLight(intentRequest, callback);
    }

    throw new Error(`Intent with name ${intentName} not supported`);
}

exports.handler = (event, context, callback) => {
    try {
        
        // By default, treat the user request as coming from the America/New_York time zone.
        process.env.TZ = 'Europe/London';
        console.log(`event.bot.name=${event.bot.name}`);

        if (event.bot.name !== 'roppySmartRobot') {
             callback('Invalid Bot Name');
        }

        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }
};