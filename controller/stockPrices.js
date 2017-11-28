var rest = require('../API/Restclient');
var balance = require('./BankBalance');

var globalCompany;
var globalQuantity;
var globalUsername;

exports.displayStockPrices = function getStock(session, company) {

    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + company + '&interval=1min&apikey=LIAY50ZUOQ4ZPT9O'; 
    globalCompany = company;
    rest.getStockData(url, session, displayStockPrices); //call REST API, displayStockPrices is callback
}

exports.buyStocks = function getStock(session, username, quantity, company) {
    
        var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + company + '&interval=1min&apikey=LIAY50ZUOQ4ZPT9O'; 
        globalCompany = company;
        globalQuantity = quantity;
        globalUsername = username;
        rest.getStockData(url, session, buyStocks); //call REST API, displayStockPrices is callback
}
    
exports.addStockTable = function getStock(session, username, quantity, company) {
    
        var url = 'http://contosobank-msa-sahil.azurewebsites.net/tables/contosobankStocks'; 
        globalCompany = company;
        globalQuantity = quantity;
        globalUsername = username;

        rest.addStockTable(url, session, username, quantity, company, response); //call REST API, displayStockPrices is callback
}


function displayStockPrices(message, session) {

    var stock = JSON.parse(message);
    //console.log(stock);   
    // console.log(stock["Time Series (Daily)"]["2017-11-24"]["1. open"]);

    var stockPrice = stock["Time Series (Daily)"]["2017-11-24"]["1. open"];
    session.send("Stock Price in %s is %s", globalCompany, stockPrice);
}

function buyStocks(message, session) {
    
        var stock = JSON.parse(message);
        //console.log(stock);   
        // console.log(stock["Time Series (Daily)"]["2017-11-24"]["1. open"]);    

        var stockPrice = stock["Time Series (Daily)"]["2017-11-24"]["1. open"];

        var finalPrice = parseFloat(stockPrice) * parseFloat(globalQuantity);
        finalPrice = finalPrice.toString();
        
        session.send("Total Stock Price in %s is %s", globalCompany,finalPrice);
                
        balance.withdrawBalance(message, session, globalUsername, finalPrice);
       
       
}  

exports.getUsername = function getUsername() {
   return globalUsername; 
}

exports.getQuantity = function getQuantity() {
    return globalQuantity; 
 }

 exports.getCompany = function getCompany() {
     return globalCompany;
 }

 