const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { writer_con, reader_con } = require('./dbseed');

const jsonParser = bodyParser.json();
// const urlencodedParser = bodyParser.urlencoded({ extended: false })

// CONSTANTS
const PORT = 8003;
const tokenMap = new Map();


function generateToken(username){
    let token = (Math.random() + 1).toString(36).substring(2);

    let requestQuery =
        `UPDATE main.users
        SET token='${token}'
        WHERE username='${username}'`;

    writer_con.query(requestQuery);
    tokenMap.set(username, token);
    return token;
}


function checkValidToken(requestBody)
{
    let badRes = {};

    if (!requestBody["token"]) {
        badRes.error = "Missing token";
        return [false, badRes];
    }

    for (let [, value] of tokenMap.entries()){
        if (value === requestBody["token"]){
            return [true, ];
        }
    }

    badRes.error = "Invalid token";
    return [false, badRes];
}


function deleteToken(token){
    for (let [user, value] of tokenMap.entries()){
        if (value === token){
            let requestQuery =
                `UPDATE main.users
                SET token=NULL
                WHERE username='${user}'`;

            writer_con.query(requestQuery);
            tokenMap.delete(user);
            return user;
        }
    }
    return "";
}


app.post("/users/register", jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let requestQuery =
        `INSERT INTO main.users (username, name, password, email, admin_flag) 
            SELECT '${req.body["username"]}', '${req.body["name"]}', '${req.body["password"]}', '${req.body["email"]}', false
            WHERE NOT EXISTS
                (SELECT * FROM main.users WHERE username = '${req.body["username"]}')`;

    let badRes = {};

    if (!req.body["username"] || !req.body["name"] || !req.body["password"] || !req.body["email"]) {
        let errorMessage = "Missing mandatory parameters:";
        if (!req.body["username"]){
            errorMessage += " username,";
        }
        if (!req.body["name"]){
            errorMessage += " name,";
        }
        if (!req.body["password"]){
            errorMessage += " password,";
        }
        if (!req.body["email"]){
            errorMessage += " email,";
        }
        errorMessage = errorMessage.substr(0, errorMessage.length - 1);
        console.log(errorMessage, "\n");
        badRes.errorMessage = errorMessage;
        res.send(badRes);
        return;
    }

    writer_con.query(requestQuery , function(err, result, fields) {
        if (err) res.send(err);
        if (result) {
            console.log("Result: ", result, "\n");
            let sentResult = {};
            if (result["affectedRows"]===1){
                sentResult.status = "Registration successful!";
            } else {
                sentResult.status = "Registration failed!";
                sentResult.reason = "Username already taken";
            }
            res.send(sentResult);
        }
        if (fields) console.log(fields, "\n");
    });
});


app.get("/users/login", jsonParser, function (req, res) {
    console.log('Request received. url:', req.url, "\n");

    let badRes = {};

    if (!req.body["username"] || !req.body["password"]) {
        let errorMessage = "Missing mandatory parameters:";
        if (!req.body["username"]){
            errorMessage += " username,";
        }
        if (!req.body["password"]){
            errorMessage += " password,";
        }
        errorMessage = errorMessage.substr(0, errorMessage.length - 1);
        badRes.error = errorMessage;
        res.send(badRes);
        return;
    }

    let requestQuery =
        `SELECT username FROM main.users WHERE username='${req.body["username"]}' AND password='${req.body["password"]}'`;

    writer_con.query(requestQuery , function(err, result, fields) {
        if (err) res.send(err);
        if (result) {
            console.log("Result: ", result, "\n");
            if (Object.keys(result).length === 1){
                let createdToken = generateToken(req.body["username"]);

                let okLogin = {};
                okLogin.username = req.body["username"]
                okLogin.token = createdToken;
                res.send(okLogin);
            }
            else
            {
                let nokLogin = {};
                nokLogin.response = "Login failed!";
                res.send(nokLogin);
            }
        }
        if (fields) console.log(fields, "\n");
    });
});


app.get("/users/logout", jsonParser, function (req, res) {
    console.log('Request received. url:', req.url, "\n");

    let [isValidToken, badRes] = checkValidToken(req.body);
    if (!isValidToken) {
        res.send(badRes);
        return;
    }

    let okLogout = {};
    okLogout.logoutUser = deleteToken(req.body["token"]);
    res.send(okLogout);
});


app.get("/users/users", jsonParser, function (req, res) {
    console.log('Request received. url:', req.url, "\n");

    let [isValidToken, badRes] = checkValidToken(req.body);
    if (!isValidToken) {
        res.send(badRes);
        return;
    }

    let requestQuery =
        `SELECT username, name FROM main.users;`;

    reader_con.query(requestQuery , function(err, result, fields) {
        if (err) res.send(err);
        if (result) {
            console.log("Result: ", result, "\n");
            res.send(result);
        }
        if (fields) console.log(fields, "\n");
    });
});


app.get("/users/user", jsonParser, function (req, res) {
    console.log('Request received. url: ', req.url, "\n");

    let [isValidToken, badRes] = checkValidToken(req.body);
    if (!isValidToken) {
        res.send(badRes);
        return;
    }

    let requestQuery =
        `SELECT username, name FROM main.users WHERE id='${req.query.id}' OR username='${req.query.username}';`;

    if (!req.query.id && !req.query.username) {
        badRes.error = "Missing query parameters";
        res.send(badRes);
        return;
    }

    writer_con.query(requestQuery , function(err, result, fields) {
        if (err) res.send(err);
        if (result) {
            console.log("Result: ", result, "\n");
            res.send(result);
        }
        if (fields) console.log(fields, "\n");
    });
});


app.listen(PORT);
console.log('Users microservice server successfully started! Port: ', PORT);
