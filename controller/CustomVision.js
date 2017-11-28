var request = require('request'); //node module for http post requests
var stock = require('./stockPrices');
exports.retreiveMessage = function (session){

    request.post({
        url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/ae1c6bb7-478a-407f-934b-3a2ec5997587/url?iterationId=20af887c-2b85-4b33-b741-d66de6de4660',
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': '94e2fea5190b4f34a02a61dce062d879'
        },
        body: { 'Url': session.message.text }
    }, function(error, response, body){
        //console.log(validResponse(body, session));
        session.send(validResponse(body, session));
    });
}

exports.retreiveMessageImage = function (session){
    var attachment = session.message.attachments[0];
    
        request.post({
            url: 'https://southcentralus.api.cognitive.microsoft.com/customvision/v1.0/Prediction/ae1c6bb7-478a-407f-934b-3a2ec5997587/image?iterationId=20af887c-2b85-4b33-b741-d66de6de4660',
            json: true,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Prediction-Key': '94e2fea5190b4f34a02a61dce062d879'
            },
            body: { attachment }
        }, function(error, response, body){
            console.log(validResponse(body, session));
            session.send(validResponse(body, session));
        });
    }

function validResponse(body, session){
    if (body && body.Predictions && body.Predictions[0].Tag) {
        stock.displayStockPrices(session, body.Predictions[0].Tag);
        return "This is " + body.Predictions[0].Tag
    } else{
        console.log('Oops, please try again!');
        console.log(body);
    }
}