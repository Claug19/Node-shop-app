const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { writer_con,reader_con } = require('./dbseed');

const jsonParser = bodyParser.json();
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.post("/user", jsonParser, function (req, res) {
    if (req.body["username"] && req.body["name"] && req.body["password"]) {
        console.log('Request received');
        writer_con.query(`INSERT INTO main.users (username, name, password, status) VALUES ('${req.body["username"]}', '${req.body["name"]}', '${req.body["password"]}', 1)`, function(err, result, fields) {
            if (err) res.send(err);
            if (result) res.send({username: req.body["username"], name: req.body["name"]});
            if (fields) console.log(fields);
        });
    } else {
        console.log('Missing a parameter');
    }
    // con.connect()
});

app.listen(3000);

console.log('Worker started');