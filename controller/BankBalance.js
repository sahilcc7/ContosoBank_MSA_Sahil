var rest = require('../API/Restclient');

exports.displayBankBalance = function getBankBalance(session, username){
    var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobank';
    rest.getBankBalance(url, session, username, handleBankBalanceResponse)
};

function handleBankBalanceResponse(message, session, username) {
    var bankBalanceResponse = JSON.parse(message);
    var allFoods = [];
    for (var index in bankBalanceResponse) {
        var usernameReceived = bankBalanceResponse[index].username;
        var favouriteFood = bankBalanceResponse[index].bankbalance;

        //Convert to lower case whilst doing comparison to ensure the user can type whatever they like
        if (username.toLowerCase() === usernameReceived.toLowerCase()) {
            //Add a comma after all favourite foods unless last one
            if(bankBalanceResponse.length - 1) {
                allFoods.push(bankBalance);
            }
            else {
                allFoods.push(bankBalance + ', ');
            }
        }        
    }
    
    // Print all favourite foods for the user that is currently logged in
    session.send("%s, your favourite foods are: %s", username, allFoods);                
    
} 
