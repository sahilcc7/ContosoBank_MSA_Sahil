var rest = require('../API/Restclient');

var globalCompany;

exports.displayStockPrices = function getStock(session, company, fromCurrencyEntity, toCurrencyEntity) {

    var url = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=' + company + '&interval=1min&apikey=LIAY50ZUOQ4ZPT9O'; 
    globalCompany = company;
    rest.getCurrencyData(url, session, displayStockPrices); //call REST API, displayStockPrices is callback
}

function displayStockPrices(message, session) {

    var stock = JSON.parse(message);
    console.log(stock);   
    // console.log(stock["Time Series (Daily)"]["2017-11-24"]["1. open"]);

    var stockPrice = stock["Time Series (Daily)"]["2017-11-24"]["1. open"];
    session.send("Stock Price for %s is %s", globalCompany, stockPrice);
}
