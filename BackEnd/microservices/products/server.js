const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { writer_con, reader_con } = require('./dbseed');

const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false })

// CONSTANTS
const PORT = 8001;


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
    case "add-product":
        requestQuery =
            `INSERT INTO main.products (id, name, brand, type, image_path, description, specs) 
                SELECT
                '${requestBody["id"]}',
                '${requestBody["name"]}',
                '${requestBody["brand"]}',
                '${requestBody["type"]}',
                '${requestBody["image_path"]}',
                '${requestBody["description"]}',
                '${requestBody["specs"]}';`;
        break;
    case "delete-product":
        requestQuery =
            `DELETE FROM main.products WHERE id='${request.query.id}'`;
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


app.get('/products/products', jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let requestQuery;

    if (req.query.id || req.query.name || req.query.brand || req.query.type)
    {
        requestQuery = `SELECT* FROM main.products WHERE 
            id='${req.query.id}' OR name='${req.query.name}' OR brand='${req.query.brand}' OR type='${req.query.type}';`;
    }
    else
    {
        requestQuery =
            `SELECT * FROM main.products;`;
    }
    writer_con.query(requestQuery , function(err, result, fields) {
        if (err) res.send(err);
        if (result) res.send(result);
        if (fields) console.log(fields);
    });
});


app.post('/products/add-product', jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let badRes = {};
    if (!req.body["id"]){
        badRes.error = "Missing mandatory body parameter: id";
        res.send(badRes);
        return;
    }
    if (!req.body["name"]){
        badRes.error = "Missing mandatory body parameter: name";
        res.send(badRes);
        return;
    }
    if (!req.body["brand"]){
        badRes.error = "Missing mandatory body parameter: brand";
        res.send(badRes);
        return;
    }
    if (!req.body["type"]){
        badRes.error = "Missing mandatory body parameter: type";
        res.send(badRes);
        return;
    }
    if (!req.body["image_path"]){
        badRes.error = "Missing mandatory body parameter: image_path";
        res.send(badRes);
        return;
    }
    if (!req.body["description"]){
        badRes.error = "Missing mandatory body parameter: description";
        res.send(badRes);
        return;
    }
    if (!req.body["specs"]){
        badRes.error = "Missing mandatory body parameter: specs";
        res.send(badRes);
        return;
    }

    let callbackType = "add-product";
    checkValidTokenAndAdminFlag(req, res, callbackType);
});


app.delete('/products/delete-product', jsonParser, function (req, res) {
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


app.listen(PORT);
console.log('Products microservice server successfully started! Port: ', PORT);
