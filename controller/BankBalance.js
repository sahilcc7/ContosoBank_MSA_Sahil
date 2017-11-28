var rest = require('../API/Restclient');
var bankBalance = null;
var place = require('./yelpItems');
var stock = require('./stockPrices');

var globalAmount;
var globalID;

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

exports.createAccount = function createAccount(session, name, username, balance, spendingGoal){  
    var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank'; 
    
        rest.createAccount(url, name, username, balance, spendingGoal, handleCreateAccountResponse);
        session.send("Your account has been created.");                
};

exports.deleteAccount = function deleteAccount(session,username){ //favourite food you want to delete
    var url  = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank';

    rest.getSpendingGoal(url,session, username,function(message,session,username) {
     var   allGoals = JSON.parse(message); //get list of all spending goals to get ID
        for(var i in allGoals) {

            if (allGoals[i].username === username) { //check if goals and username match 
                               
                rest.deleteAccount(url,session,username, allGoals[i].id, deleteAccount); //delete              //NOT WORK.  
            }
        }

    });

};

exports.withdrawBalance = function withdrawBalance(message, session, username, amount){ 
    var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank';    
    globalAmount = amount;
    rest.getBankBalance(url, session, username, handleWithdrawResponse);
};

exports.getBankBalanceValue = function getBankBalanceValue() {
    return bankBalance;
}

function deleteAccount(message, session, username) {
    console.log("DELETED ACCOUNT -------------");
    session.send("Your account has been deleted.");
}

function handleBankBalanceResponse(message, session, username) {
    var bankBalanceResponse = JSON.parse(message);

    for (var index in bankBalanceResponse) { //loop through database rows
        
        var usernameReceived = bankBalanceResponse[index].username; 
        var bankBalance = bankBalanceResponse[index].balance;
        var nameReceived = bankBalanceResponse[index].name;
        globalID =  bankBalanceResponse[index].id;
                
        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) { //check if username matches database
            session.conversationData["bankbalance"] = bankBalance;  
            // Print all favourite foods for the user that is currently logged in
            session.send("%s, your bank balance is: $%s", nameReceived, parseInt(bankBalance));     
            var found = true;
            break; //break out of loop as we have found the entry
        }        
        else {
            found = false; 
        }
    }
    
    if (!found) {
        session.send("Username '%s' not found, please setup an account.", username); 
    }
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

function handleWithdrawResponse(message,session,username) {
    //console.log(globalAmount);
    
    handleBankBalanceResponse(message, session, username);

    console.log(session.conversationData["bankbalance"]);

    if (parseFloat(session.conversationData["bankbalance"]) >=  parseFloat(globalAmount)) {
        //session.send("You can afford to buy the stock.");
        
        //Update balance.
        var newBankBalance = (parseFloat(session.conversationData["bankbalance"])- (parseFloat(globalAmount))).toString();
        var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank';
        rest.updateBankBalance(url, globalID, newBankBalance, handleUpdatedBankBalanceResponse);
        //session.send("Your balance is now $%s", newBankBalance);

        //Update stock table

        globalUsername = stock.getUsername();
        globalQuantity = stock.getQuantity();
        globalCompany = stock.getCompany();

        url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobankStocks';
        rest.addStockTable(url, globalUsername, globalQuantity, globalCompany, handleAddStockResponse);

        
    }

    else {
        session.send("You cannot afford to buy the stock.");
    }
}


function handleSpendingGoalResponse(message, session, username) {
    var spendingGoalResponse = JSON.parse(message);

    for (var index in spendingGoalResponse) { //loop through database rows
        var usernameReceived = spendingGoalResponse[index].username; 
        var spendingGoal = spendingGoalResponse[index].spendingGoal;
        var nameReceived = spendingGoalResponse[index].name;
        
        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) { //check if username matches database       //CHECK THIS
            session.conversationData["spendinggoal"] = spendingGoal;  
            // Print all favourite foods for the user that is currently logged in
            session.send("%s, your spending goal is: $%s", nameReceived, spendingGoal); 
            var found = true;
            break; //break out of loop as we have found the entry
        }
        
        else {
            found = false; 
        }
    }
    
    if (!found) {
        session.send("Username '%s' not found, please setup an account.", username); 
    }
       
}

function handleCreateAccountResponse(message, session, username) {
    console.log("ACCOUNT CREATED _____________________");
}

function handleUpdatedBankBalanceResponse(message, session, username) {
    console.log("UPDATED BALANCE");
}

function handleAddStockResponse(message, session, username) {
    console.log("ADDED STOCK");
}
