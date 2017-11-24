var builder = require('botbuilder');

var balance = require('./BankBalance');

//var food = require('./FavouriteFoods');
//var restaurant = require('./restaurantCard');
//var nutrition = require('./NutritionCard');
//var customVision = require('../controller/CustomVision');
// Some sections have been omitted

exports.startDialog = function (bot) {
    
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/4dcdafa5-b5c6-416a-b64f-7a263019e094?subscription-key=47edd6f4484c40219f78d8593d7407ec&verbose=true&timezoneOffset=0&q=');
    
    bot.recognizer(recognizer);


    bot.dialog('welcomeIntent', function (session, args) { //WELCOME
        if (!isAttachment(session)) {
        session.send('Welcome to Contoso Bank');     
        session.send('You can check your balance, make a transfer, and more');   
        }             
    }).triggerAction({
         matches: 'welcomeIntent'
    });

    bot.dialog('None', function (session, args) { //NONE
        if (!isAttachment(session)) {            
        session.send('Sorry, I did not understand that.');        
        }     
    }).triggerAction({
         matches: 'None'
    });
    
    // bot.dialog('getBankBalance', function (session, args) { //GET BALANCE
        
    //     session.send('getBankBalance intent Found');        
                      
    // }).triggerAction({
    //     matches: 'getBankBalance'
    // });
    bot.dialog('getBankBalance', [
        function (session, args, next) {
            
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter a username to setup your account.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                
                if (results.response) {
                    
                    session.conversationData["username"] = results.response;
                }

                session.send("Retrieving your bank balance");
                food.displayBankBalance(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    }
    ]).triggerAction({
        matches: 'getBankBalance'
    });

    bot.dialog('getAccountNumber', function (session, args) { //GET ACCOUNT NUMBER
        session.send('getAccountNumber intent Found');        
                      
    }).triggerAction({
        matches: 'getAccountNumber'
    });

    bot.dialog('transferMoney', function (session, args) { //TRANSFER MONEY
        session.send('transferMoney intent Found');        
                      
    }).triggerAction({
        matches: 'transferMoney'
    });


    function isAttachment(session) { 
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0) || msg.includes("http")) {
            //call custom vision
            customVision.retreiveMessage(session);    
            return true;
        }
        else {
            return false;
        }
    }



}