var request = require('request');

exports.getBankBalance = function getData(url, session, username, callback){ //exports used to call function from other file
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetResponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

exports.getSpendingGoal = function getData(url, session, username, callback){ //exports used to call function from other file
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetResponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session, username);
        }
    });
};

exports.updateSpendingGoal = function sendData(url, id, spendingGoal){ 
    var options = {
        url: url,
        method: 'PATCH',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "id" : id,
            "spendingGoal" : spendingGoal
        }
      };
      
      request(options, function (error, response, body) { //callback
        if (!error && response.statusCode === 200) {
            console.log(body);
        }
        else{
            console.log(error);
        }
      });
};

exports.getCurrencyData = function getData (url, session, callback) {
    request.get(url, {'headers':{'ZUMO-API-VERSION': '2.0.0'}}, function handleGetResponse(err,res,body){
        if(err){
            console.log(err);
        }else {
            callback(body, session);
        }
    });
};

exports.getYelpData = function getData(url,bearer,session, callback){
    
        request.get(url,{'auth': { 'bearer': bearer}} ,function(err,res,body){
            if(err){
                console.log(err);
            }else {
                callback(body,session);
            }
        });
    };
    

exports.createAccount = function createAccount(url, name, username, balance, spendingGoal, callback){ 
    var options = {
        url: url,
        method: 'POST',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
            "name" : name,            
            "username": username,
            "balance": balance,
            "spendingGoal": spendingGoal            
        }
      };
      
      request(options, function (error, response, body) { //callback
        if (!error && response.statusCode === 200) {
            console.log(body);
            callback(body, session, username);
        }
        else{
            console.log(error);
        }
      });
};

exports.deleteAccount = function deleteSpendingGoal(url, session, username, id, callback){ //need ID of row
    
    var options = {
        url: url + "/" + id, //appended ID to URL
        method: 'DELETE',
        headers: {
            'ZUMO-API-VERSION': '2.0.0',
            'Content-Type':'application/json'
        },
        json: {
                   
        }
    };

    request(options,function (err, res, body) {
        if( !err && res.statusCode === 200){
            console.log(body);
            callback(body,session,username);
        }else {
            console.log(err);
            console.log(res);
        }
    })
};


// exports.postFavouriteFood = function sendData(url, username, favouriteFood){ 
//     var options = {
//         url: url,
//         method: 'POST',
//         headers: {
//             'ZUMO-API-VERSION': '2.0.0',
//             'Content-Type':'application/json'
//         },
//         json: {
//             "username" : username,
//             "favouriteFood" : favouriteFood
//         }
//       };
      
//       request(options, function (error, response, body) { //callback
//         if (!error && response.statusCode === 200) {
//             console.log(body);
//         }
//         else{
//             console.log(error);
//         }
//       });
// };

