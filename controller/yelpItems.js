var rest = require('../API/Restclient');
var builder = require('botbuilder');

var balanceAfter;

//Calls 'getYelpData' in RestClient.js with 'displayRestaurantCards' as callback to get list of restaurant information
exports.displayPlaces = function getPlaceData(item, location, session){
    var url ='https://api.yelp.com/v3/businesses/search?term='+item+'&location='+location + '&limit=5';
    var auth ='wzBWFHVcPp4lL55pCkMMOi6U2W-dja0kMEZ0cRB1CadupFRir2BqEcvSVd1x2X83s-MAQ0XQZsMA8jWrBeS55E42U1ux5hDg99FLiKXN6UKSBXWKMNe9iaVwMxIWWnYx';
    rest.getYelpData(url,auth,session,displayPlaceCards);
}

function displayPlaceCards(message, session) {
    var attachment = [];
    var restaurants = JSON.parse(message);
    
    //For each restaurant, add herocard with name, address, image and url in attachment
    for (var index in restaurants.businesses) {
        var restaurant = restaurants.businesses[index];
        var name = restaurant.name;
        var imageURL = restaurant.image_url;
        var url = restaurant.url;
        var address = restaurant.location.address1 + ", " + restaurant.location.city;
        var price = restaurant.price;
        

        var card = new builder.HeroCard(session)
            .title(name)
            .subtitle(price)
            .text(address)
            .images([
                builder.CardImage.create(session, imageURL)])
            .buttons([
                builder.CardAction.openUrl(session, url, 'More Information')
            ]);

        if (canAfford(price, session.conversationData["bankbalance"])) {
            attachment.push(card);
        }
        else {
            //session.send("You cannot afford it.");
        }        

    }
    
    //Displays restaurant hero card carousel in chat box 
    var message = new builder.Message(session)
        .attachmentLayout(builder.AttachmentLayout.carousel)
        .attachments(attachment);
        session.send("Here are some you can afford.")
        session.send(message);
        session.send("Your balance after will be approximately $%s", balanceAfter);
}


function canAfford (priceLevel, balance) { //this function compares price level with bank balance

    balance = parseInt(balance);
    if (priceLevel == '$' && balance >= 10) {
        balanceAfter = balance - 10;
        return true;
    }
    else if (priceLevel == '$$' && balance >= 25) {
        balanceAfter = balance - 25;
        return true;
    }
    else if (priceLevel == '$$$' && balance >= 100) {
        balanceAfter = balance - 100;
        return true;
    }
    else if (priceLevel == '$$$$' && balance >= 250) {
        balanceAfter = balance - 250;
        return true;
    }

    else {
        balanceAfter = balance;
        return false;
    }
}