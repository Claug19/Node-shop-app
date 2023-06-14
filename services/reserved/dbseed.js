const mysql = require('mysql');
const writer_host = "database-1.cluster-cmsesr5w26br.eu-north-1.rds.amazonaws.com";
const reader_host = "database-1.cluster-ro-cmsesr5w26br.eu-north-1.rds.amazonaws.com";
const user = "admin";
const password = "adminadmin";

const writer_con = mysql.createConnection({
    host: writer_host,
    user: user,
    password: password
});

const reader_con = mysql.createConnection({
    host: reader_host,
    user: user,
    password: password
})

writer_con.connect(function (err) {
    if (err) throw err;
    console.log("Reserved writer_con successfully connected!");

    writer_con.query('CREATE DATABASE IF NOT EXISTS main;');
    writer_con.query('USE main;');
});

reader_con.connect(function (err) {
    if (err) throw err;
    console.log("Reserved reader_con successfully connected!\n");
});

exports.writer_con = writer_con;
exports.reader_con = reader_con;