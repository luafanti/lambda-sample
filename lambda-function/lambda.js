var AWS = require('aws-sdk');
AWS.config.update({region: 'eu-west-1'});
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});


exports.handler = (event, context, callback) => {
    const body = JSON.parse(event.body);
    console.log('Received event with body:', JSON.stringify(body));


    var dynamoObject = {
        TableName: 'contacts',
        Item: {
            'email' : {S: body.email},
            'name' : {S: body.name}
        }};


    ddb.putItem(dynamoObject, function(err, data) {
        if (err) {
            console.log("Error", err);
        } else {
            console.log("Success", data);
        }
    });


    var snsObject = {
        Message: 'New registration with email '+ body.email,
        TopicArn: 'arn:aws:sns:eu-west-1:67XXXX01:contact-topic'
    };

    var sns = new AWS.SNS({apiVersion: '2010-03-31'}).publish(snsObject).promise();
    sns.then(
        function(data) {
            console.log('Message send with success to sns');
        }).catch(
        function(err) {
            console.error(err, err.stack);
        });

    var response = {
        "statusCode": 200
    };
    callback(null, response);
};
