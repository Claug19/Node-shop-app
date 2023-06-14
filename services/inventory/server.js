const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { writer_con, reader_con } = require('./dbseed');

const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false })


function checkValidTokenAndAdminFlag(request, requestResult, callbackType)
{
    let badRes = {};
    let requestBody = request.body;

    if (!requestBody["token"]) {
        badRes.error = "Missing token";
        requestResult.send(badRes);
    }

    let token = requestBody["token"];

    let requestQuery =
        `SELECT token, admin_flag FROM main.users WHERE token='${token}';`

    reader_con.query(requestQuery , function(err, result, fields) {
        if (err) requestResult.send(err);
        if (result) {
            console.log("Result: ", result, "\n");
            if (Object.keys(result).length === 0 || result[0]["token"] !== token)
            {
                badRes.error = "Invalid token";
                requestResult.send(badRes);
                return;  
            }
            if (result[0]["admin_flag"] === 0)
            {
                badRes.error = "Access denied!";
                requestResult.send(badRes);
                return;  
            }
            sendQueryAfterValidation(request, requestResult, callbackType);
            return;
        }
        if (fields) console.log(fields);
    });
}


function checkValidToken(request, requestResult, callbackType)
{
    let badRes = {};
    let requestBody = request.body;

    if (!requestBody["token"]) {
        badRes.error = "Missing token";
        requestResult.send(badRes);
    }

    let token = requestBody["token"];

    let requestQuery =
        `SELECT token, FROM main.users WHERE token='${token}';`

    reader_con.query(requestQuery , function(err, result, fields) {
        if (err) requestResult.send(err);
        if (result) {
            console.log("Result: ", result, "\n");
            if (Object.keys(result).length === 0 || result[0]["token"] !== token)
            {
                badRes.error = "Invalid token";
                requestResult.send(badRes);
                return;  
            }
            sendQueryAfterValidation(request, requestResult, callbackType);
            return;
        }
        if (fields) console.log(fields);
    });
}


function sendQueryAfterValidation(request, requestResult, callbackType){

    let requestQuery = ``;
    let requestBody = request.body;

    switch(callbackType){
    case "products":
        requestQuery =
            `SELECT * FROM main.inventory`;
        break;
    case "product":
        requestQuery =
            `SELECT * FROM main.inventory WHERE id='${request.query.id}'`;
        break;
    case "add-product":
        requestQuery =
            `INSERT INTO main.inventory (id, product_id, product_name) 
                SELECT
                '${requestBody["id"]}', '${requestBody["product_id"]}', '${requestBody["product_name"]}';`;
        break;
    case "delete-product":
        requestQuery =
            `DELETE FROM main.inventory WHERE id='${request.query.id}'`;
        break;
    default:
        console.log("CallbackType is not valid.");
    }

    writer_con.query(requestQuery , function(err, result, fields) {
        if (err) requestResult.send(err);
        if (result) requestResult.send(result);
        if (fields) console.log(fields);
    });
}


app.get('/inventory/products', jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let callbackType = "products";
    checkValidTokenAndAdminFlag(req, res, callbackType);
});


app.get('/inventory/product', jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let badRes = {};

    if (!req.query.id) {
        badRes.error = "Missing id query parameter";
        res.send(badRes);
        return;
    }

    let callbackType = "product";
    checkValidTokenAndAdminFlag(req, res, callbackType);
});


app.post('/inventory/add-product', jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let badRes = {};
    if (!req.body["id"]){
        badRes.error = "Missing mandatory body parameter: id";
        res.send(badRes);
        return;
    }
    if (!req.body["product_id"]){
        badRes.error = "Missing mandatory body parameter: product_id";
        res.send(badRes);
        return;
    }
    if (!req.body["product_name"]){
        badRes.error = "Missing mandatory body parameter: product_name";
        res.send(badRes);
        return;
    }

    let callbackType = "add-product";
    checkValidTokenAndAdminFlag(req, res, callbackType);
});


app.delete('/inventory/delete-product', jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let badRes = {};

    if (!req.query.id) {
        badRes.error = "Missing id query parameter";
        res.send(badRes);
        return;
    }

    let callbackType = "delete-product";
    checkValidTokenAndAdminFlag(req, res, callbackType);
});


app.listen(3000);
console.log('Worker started: inventory server');
