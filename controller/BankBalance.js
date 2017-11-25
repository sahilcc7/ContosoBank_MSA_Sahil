var rest = require('../API/Restclient');
var bankBalance = '000000000000000000000'
exports.displayBankBalance = function getBankBalance(session, username){
    var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank';
    rest.getBankBalance(url, session, username, handleBankBalanceResponse)
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
