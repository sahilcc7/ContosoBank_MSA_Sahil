var rest = require('../API/Restclient');
var bankBalance = null;
var place = require('./yelpItems');


exports.displayBankBalance = function getBankBalance(session, username){ //GETS BANK BALANCE
    var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank';
    rest.getBankBalance(url, session, username, handleBankBalanceResponse);
};

exports.displaySpendingGoal = function getSpendingGoal(session, username){ //GETS SPENDING GOAL
    var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank';
    rest.getSpendingGoal(url, session, username, handleSpendingGoalResponse);
};

exports.updateSpendingGoal = function updateSpendingGoal(session, username, spendingGoal){  //UPDATES SPENDING GOAL
    var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank'; 
    
    //Need to GET spending goal first
    rest.getSpendingGoal(url, session, username, function(message, session, username) {
        var allGoals = JSON.parse(message);

        for(var i in allGoals) {
            if (allGoals[i].username === username) { //check if fav food and username match
                var id = allGoals[i].id;
                
            }
        }
        rest.updateSpendingGoal(url, id, spendingGoal, handleUpdateSpendingGoalResponse);
        session.send("Your spending goal has been updated.");                
        
    });
};

exports.forwardBankBalance = function forwardBankBalance(session, username){ //GETS BANK BALANCE
    var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank';
    rest.getBankBalance(url, session, username, handleForwardedBankBalanceResponse);
};

function handleBankBalanceResponse(message, session, username) {
    var bankBalanceResponse = JSON.parse(message);

    for (var index in bankBalanceResponse) { //loop through database rows
        
        var usernameReceived = bankBalanceResponse[index].username; 
        var bankBalance = bankBalanceResponse[index].balance;
        var nameReceived = bankBalanceResponse[index].name;
                
        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) { //check if username matches database
            session.conversationData["bankbalance"] = bankBalance;  
            break; //break out of loop as we have found the entry
        }        
    }    
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your bank balance is: $%s", nameReceived, bankBalance);                
    
}

function handleForwardedBankBalanceResponse(message, session, username) {
    handleBankBalanceResponse(message, session, username);
    var item = session.conversationData["item"];
    if (item) {
        session.send("Looking for %s's...", item.entity);
        place.displayPlaces(item.entity, "auckland", session);
    } else {
        session.send("No items identified! Please try again"); //finding affordable food
    } 
    
}


function handleSpendingGoalResponse(message, session, username) {
    var spendingGoalResponse = JSON.parse(message);

    for (var index in spendingGoalResponse) { //loop through database rows
        var usernameReceived = spendingGoalResponse[index].username; 
        var spendingGoal = spendingGoalResponse[index].spendingGoal;
        var nameReceived = spendingGoalResponse[index].name;
                
        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) { //check if username matches database
            session.conversationData["spendinggoal"] = spendingGoal;  
            break; //break out of loop as we have found the entry
        }        
    }    
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your spending goal is: $%s", nameReceived, spendingGoal);                
    
}

exports.getBankBalanceValue = function getBankBalanceValue() {
    return bankBalance;
}