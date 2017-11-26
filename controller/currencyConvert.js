var rest = require('../API/Restclient');

var toCurrency;
var amount;
var fromCurrency;

exports.displayCurrency = function convertCurrency(session, amountEntity, fromCurrencyEntity, toCurrencyEntity) {
    fromCurrencyEntity = fromCurrencyEntity.toUpperCase();
    toCurrencyEntity = toCurrencyEntity.toUpperCase();
    toCurrency = toCurrencyEntity;
    fromCurrency = fromCurrencyEntity;
    amount = amountEntity;
    var url = 'https://api.fixer.io/latest?base=' + fromCurrencyEntity +'&symbols=' + fromCurrencyEntity +',' + toCurrencyEntity; //eg base=USD for: conv USD to NZD
    rest.getCurrencyData(url, session, displayCurrency); //call REST API
}

function displayCurrency(message, session) {
    var currency = JSON.parse(message);

    console.log(currency);

    var exchangeRate = currency.rates[toCurrency];

    console.log('-----------');
    
    exchangeRate = parseFloat(exchangeRate);
    amount = parseFloat(amount);

    console.log(toCurrency);

    var converted =  exchangeRate * amount;
    console.log(converted);

    session.send('$%s in %s is $%s in %s',amount, fromCurrency, converted, toCurrency);

}
