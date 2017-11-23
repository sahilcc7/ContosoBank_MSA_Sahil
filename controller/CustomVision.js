var request = require('request'); //node module for http post requests

exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/8ddaf611-03b9-4c46-875c-bf29a898698f/url?iterationId=c9f00642-9dda-4935-a779-f670931d9e6c',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '94e2fea5190b4f34a02a61dce062d879'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        console.log(validResponse(body));
        session.send(validResponse(body));
    });
}

function validResponse(body){
    if (body && body.Predictions && body.Predictions[0].Tag){
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
    }
}