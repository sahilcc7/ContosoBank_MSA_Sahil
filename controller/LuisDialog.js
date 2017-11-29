var builder = require('botbuilder');
var balance = require('./BankBalance');
var currencyConvert = require('./currencyConvert');
var itemEntity;
var stock = require('./stockPrices');
var place = require('./yelpItems');
var customVision = require('../controller/CustomVision');
var welcome = require('./welcomeCard');
var stockCard = require('./buyStocksCard');

var accountSetupComplete = false;

exports.startDialog = function (bot) {
    
    // Replace {YOUR_APP_ID_HERE} and {YOUR_KEY_HERE} with your LUIS app ID and your LUIS key, respectively.
    var recognizer = new builder.LuisRecognizer('https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/b8b8739d-56de-4dab-a105-bac246ce891f?subscription-key=02bf9baa9f3b4d96b4815ef11865df32&verbose=true&timezoneOffset=0&q=');
    

    bot.recognizer(recognizer);

    // recognizer.onEnabled(function (context, callback) {        
    //     var enabled = context.dialogStack().length != 0;
    //     console.log("--------2HERE2--------");
    //     callback(null, enabled);
    // });

    bot.dialog('welcomeIntent', function (session, args) { //WELCOME
        if (!isAttachment(session)) {
        session.send('Welcome to the Contoso Bank Bot!');     
        welcome.displayWelcome(session);
        }             
    }).triggerAction({
         matches: 'welcomeIntent'
    });

    bot.dialog('setupAccount', [
    function (session) {
        

        recognizer.onEnabled(function (session, callback) {
            
                // Check to see if this recognizer should be enabled
                if (!accountSetupComplete) {
                  // Do not send to LUIS
                  callback(null, false);
                } else {
                  callback(null, true);
                }
            
            });
                    
            session.send("Welcome to Account Setup.");
            builder.Prompts.text(session, "What is your Name?");
        },
        function (session, results) {
            session.dialogData.name = results.response;
            builder.Prompts.text(session, "Please provide a username (eg 'johnsmith123')");
        },
        function (session, results) {
            session.dialogData.username = results.response;
            builder.Prompts.text(session, "What is your Bank Balance?");
        },
        function (session, results) {
            session.dialogData.balance = results.response;
            builder.Prompts.text(session, "What is your spending goal?");
        },
        function (session, results) {
            session.dialogData.spendingGoal = results.response;

        // Process request and display reservation details
        session.send(`Creating Account. Account details: <br/>Date/Time: ${session.dialogData.name} <br/>Username: ${session.dialogData.username} <br/>Bank Balance: ${session.dialogData.balance}<br/>Spending Goal: ${session.dialogData.spendingGoal}`);
        
        balance.createAccount(session, session.dialogData.name, session.dialogData.username, session.dialogData.balance, session.dialogData.spendingGoal); 

        session.endDialog();
        accountSetupComplete = true;

        }     
        

    ]).triggerAction({
        matches: 'setupAccount'
    });


    bot.dialog('None', function (session, args) { //NONE
        if (!isAttachment(session)) {            
        session.send('Sorry, I did not understand that.');        
        }     
    }).triggerAction({
         matches: 'None'
    });
    
    bot.dialog('getBankBalance', [
        function (session, args, next) {
            
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) { //get the username
                builder.Prompts.text(session, "Enter your username.");                
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
                balance.displayBankBalance(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    }
    ]).triggerAction({
        matches: 'getBankBalance'
    });

    // bot.dialog('getAccountNumber', function (session, args) { //GET ACCOUNT NUMBER
    //     session.send('getAccountNumber intent Found');        
                      
    // }).triggerAction({
    //     matches: 'getAccountNumber'
    // });

    bot.dialog('setSpendingGoal', [
        function (session, args, next) {

            amountEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'amount');            
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) { //get the username
                builder.Prompts.text(session, "Enter your username.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                
                if (results.response) {
                    session.conversationData["username"] = results.response;                    
                }

                if (amountEntity) {
                    session.send('Updating your spending goal to $%s...', amountEntity.entity);
                    balance.updateSpendingGoal(session, session.conversationData["username"], amountEntity.entity); // <-- LINE WE WANT
    
                } else {
                    session.send("Spending goal not specified.");
                }                     

            }
    }
    ]).triggerAction({
        matches: 'setSpendingGoal'
    });

    bot.dialog('getSpendingGoal', [
        function (session, args, next) {
            
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) { //get the username
                builder.Prompts.text(session, "Enter your username.");                
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                
                if (results.response) {
                    session.conversationData["username"] = results.response;                     
                }

                session.send("Retrieving your spending goal");
                balance.displaySpendingGoal(session, session.conversationData["username"]);  // <---- THIS LINE HERE IS WHAT WE NEED 
            
        }
    }
    ]).triggerAction({
        matches: 'getSpendingGoal'
    });

    bot.dialog('afford', [
        function (session, args, next) {

            itemEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'item');   
            session.conversationData["item"] = itemEntity;         
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) { //get the username
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

                balance.forwardBankBalance(session, session.conversationData["username"]);  //find bank balance + use Yelp API    

            }
    }
    ]).triggerAction({
        matches: 'afford'
    });
    
    bot.dialog('currencyConvert', [
        function (session, args, next) {

            amountEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'amount');            
            fromCurrencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'fromCurrency');            
            toCurrencyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'toCurrency');            
            
            session.dialogData.args = args || {};  

            next();
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
            

                if (amountEntity && fromCurrencyEntity && toCurrencyEntity) {
                    
                    session.send('Converting $%s from %s to %s...', amountEntity.entity, fromCurrencyEntity.entity, toCurrencyEntity.entity);
                    currencyConvert.displayCurrency(session, amountEntity.entity, fromCurrencyEntity.entity, toCurrencyEntity.entity); //sending session, currencies, amount
    
                } else {
                    session.send("Please ensure you have all parameters.");
                }                     

            }
    }
    ]).triggerAction({
        matches: 'currencyConvert'
    });

    bot.dialog('deleteAccount', [
        function (session, args, next) {
            session.dialogData.args = args || {};
            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter your username.");
            } else {
                next(); // Skip if we already have this info.
            }
        },
        function (session, results,next) {
            if (!isAttachment(session)) {
                
            if(results.response) {
                session.conversationData["username"] = results.response;
            }

            session.send("Deleting Account.");

            balance.deleteAccount(session,session.conversationData['username']);     
   
        }

    }]).triggerAction({
        matches:'deleteAccount'
    })

    bot.dialog('stocks', [
        function (session, args, next) {
            
            companyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'company');         
            console.log(companyEntity.entity);               
            session.dialogData.args = args || {};  
            next();
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
            
                if (companyEntity) {  //if company specified
                    
                    session.send('Finding stock prices in %s...', companyEntity.entity);
                    stock.displayStockPrices(session, companyEntity.entity);
    
                } else {
                    session.send("Please ensure you define the company name.");
                }                     

            }
    }
    ]).triggerAction({
        matches: 'stocks'
    });

    bot.dialog('buyStocks', [
        function (session, args, next) {
            if (!isAttachment(session)) {
            companyEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'company');
            quantityEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'quantity');        
            console.log(companyEntity.entity);               
            session.dialogData.args = args || {};  

            if (!session.conversationData["username"]) {
                builder.Prompts.text(session, "Enter your username.");
            } else {
                next(); // Skip if we already have this info.
            }
        }
            
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                
                if(results.response) {
                    session.conversationData["username"] = results.response;
                }

                if (companyEntity && quantityEntity) {  //if company && quantity specified
                    
                    session.send('Buying %s stocks in %s...', quantityEntity.entity, companyEntity.entity);
                    //buyStocksCard
                    
                    stock.buyStocks(session, session.conversationData["username"], quantityEntity.entity, companyEntity.entity);
    
                } else {
                    session.send("Please ensure you define the company name and quantity.");
                }                     

            }
    }
    ]).triggerAction({
        matches: 'buyStocks'
    });




    bot.dialog('logout', [
        function (session, args, next) {
            session.dialogData.args = args || {};        
            if (!session.conversationData["username"]) { //check if anyone logged in
                session.endDialog("You are not currently logged in.");                
            } else {
                next(); 
            }
        },
        function (session, results, next) {
            if (!isAttachment(session)) {
                delete session.conversationData["username"]; //delete session data.
                session.endDialog("You have been logged out");
            
        }
    }
    ]).triggerAction({
        matches: 'logout'
    });

    function isAttachment(session) { 
       
        var msg = session.message.text;
        if ((session.message.attachments && session.message.attachments.length > 0)) {
            //call custom vision
            customVision.retreiveMessageImage(session);    
            
            return true;

        }

        else if(msg.includes("http")) {
            
            customVision.retreiveMessage(session); 
            return true;
        }    

        else {
            return false;
        }
    }



}