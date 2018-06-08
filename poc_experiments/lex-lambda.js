'use strict';

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

function dispatch(intentRequest, callback) {
    console.log(`dispatch userId=${intentRequest.userId}, intentName=${intentRequest.currentIntent.name}`);

    const intentName = intentRequest.currentIntent.name;

    if (intentName === 'getTime') {
        return getTime(intentRequest, callback);
    }

    throw new Error(`Intent with name ${intentName} not supported`);
}

exports.handler = (event, context, callback) => {
    try {
        
        // By default, treat the user request as coming from the America/New_York time zone.
        process.env.TZ = 'America/New_York';
        console.log(`event.bot.name=${event.bot.name}`);

        if (event.bot.name !== 'roppySmartRobot') {
             callback('Invalid Bot Name');
        }

        dispatch(event, (response) => callback(null, response));
    } catch (err) {
        callback(err);
    }
};