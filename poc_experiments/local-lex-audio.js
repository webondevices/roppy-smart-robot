// https://aws.amazon.com/blogs/machine-learning/build-a-voice-kit-with-amazon-lex-and-a-raspberry-pi/

const AWS = require('aws-sdk');

AWS.config.update({region: 'us-east-1'});

const lex = new AWS.LexRuntime();


var params = {
    botAlias: '$LATEST',
    botName: 'OrderFlowers',
    contentType: 'audio/x-l16; sample-rate=16000',
    userId: 'BlogPostTesting',
    accept: 'audio/mpeg'
};

params.inputStream = engine.addAudioCallback(processAudio);

lex.postContent(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
});

