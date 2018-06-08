const AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});

const lex = new AWS.LexRuntime();

var params = {
    botName: 'roppySmartRobot',
    botAlias: '$LATEST',
    inputText: "What's the time?",
    userId: 'user'
};

lex.postText(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});