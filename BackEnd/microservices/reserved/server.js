const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { writer_con, reader_con } = require('./dbseed');

const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false })

// CONSTANTS
const PORT = 8002;


function checkValidToken(request, requestResult, callbackType) {

    let badRes = {};
    let requestBody = request.body;

    if (!requestBody["token"]) {
        badRes.error = "Missing token";
        requestResult.send(badRes);
    }

    let token = requestBody["token"];

    let requestQuery =
        `SELECT id FROM main.users WHERE token='${token}';`

    reader_con.query(requestQuery , function(err, result, fields) {
        if (err) requestResult.send(err);
        if (result) {
            console.log("Result: ", result, "\n");
            if (Object.keys(result).length === 0)
            {
                badRes.error = "Invalid token";
                requestResult.send(badRes);
                return;  
            }
            retrieveReservationProductId(request, requestResult, callbackType, result[0]["id"]);
            return;
        }
        if (fields) console.log(fields);
    });
}


function retrieveReservationProductId(request, requestResult, callbackType, foundId) {

    let badRes = {};
    let requestQuery;

    switch(callbackType) {
    case "reserve":
        requestQuery =
            `SELECT id FROM main.inventory WHERE reserved_by IS NULL AND product_name='${request.query.name}';`
        break;
    case "delete-reservation":
        requestQuery =
            `SELECT id FROM main.inventory WHERE reserved_by='${foundId}' AND product_name='${request.query.name}';`;
        break;
    default:
        console.log("CallbackType is not valid.\n");
    }

    writer_con.query(requestQuery , function(err, result, fields) {
        if (err) requestResult.send(err);
        if (result){
            if (Object.keys(result).length === 0){
                badRes.error = "Could not find corresponding inventory item!";
                requestResult.send(badRes);
                return;
            }
            updateReservation(requestResult, callbackType, foundId, result[0]["id"]);
            return;
        }
        if (fields) console.log(fields);
    });
}


function updateReservation(requestResult, callbackType, userId, productId) {

    let requestQuery;

    switch(callbackType){
    case "reserve":
        requestQuery =
            `UPDATE main.inventory
                SET reserved_by = '${userId}'
                WHERE id=${productId};`;
        break;
    case "delete-reservation":
        requestQuery =
            `UPDATE main.inventory
                SET reserved_by = null
                WHERE id='${productId}';`;
        break;
    default:
        console.log("CallbackType is not valid.\n");
    }

    writer_con.query(requestQuery , function(err, result, fields) {
        if (err) requestResult.send(err);
        if (result) requestResult.send(result);
        if (fields) console.log(fields);
    });
}


app.patch('/reserved/reserve', jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let badRes = {};
    if (!req.query.name){
        badRes.error = "Missing name query parameter";
        res.send(badRes);
        return;
    }

    let callbackType = "reserve";
    checkValidToken(req, res, callbackType);
});


app.patch('/reserved/delete-reservation', jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let badRes = {};

    if (!req.query.name) {
        badRes.error = "Missing name query parameter";
        res.send(badRes);
        return;
    }

    let callbackType = "delete-reservation";
    checkValidToken(req, res, callbackType);
});


app.listen(PORT);
console.log('Reserved microservice server successfully started! Port: ', PORT);
