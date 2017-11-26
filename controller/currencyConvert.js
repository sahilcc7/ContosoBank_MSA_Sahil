var rest = require('../API/Restclient');

var toCurrency;

exports.displayCurrency = function convertCurrency(session, amountEntity, fromCurrencyEntity, toCurrencyEntity) {
    fromCurrencyEntity = fromCurrencyEntity.toUpperCase();
    toCurrencyEntity = toCurrencyEntity.toUpperCase();
    toCurrency = toCurrencyEntity;
    var url = 'https://api.fixer.io/latest?base=' + fromCurrencyEntity +'&symbols=' + fromCurrencyEntity +',' + toCurrencyEntity; //eg base=USD for: conv USD to NZD
    rest.getCurrencyData(url, session, displayCurrency); //call REST API
}

function displayCurrency(message, session) {
    var currency = JSON.parse(message);

    console.log(currency);

    var exchangeRate = currency.rates[toCurrency];

    console.log('-----------');
    console.log(exchangeRate);

    exchangeRate = parseInt(exchangeRate);
    toCurrency = parseInt(toCurrency);
    var converted =  exchangeRate * toCurrency;
    console.log(converted);
    converted = toString(converted);
    console.log(converted);
    session.send('Converted: %s', converted);

}
