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
   console.log("Inventory writer_con successfully connected!");

   let createTableQuery =
      `CREATE TABLE IF NOT EXISTS inventory(
        id int NOT NULL, 
        product_id int, 
        product_name varchar(100),
        reserved_by varchar(100),
        PRIMARY KEY(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
      );`;

   writer_con.query('CREATE DATABASE IF NOT EXISTS main;');
   writer_con.query('USE main;');
   writer_con.query(createTableQuery, function(error, result, fields) {
      if (err) console.log(err, "\n");
      if (result) console.log(result, "\n");
      if (fields) console.log(fields, "\n");
   });
});

reader_con.connect(function (err) {
   if (err) throw err;
   console.log("Inventory reader_con successfully connected!\n");
});

exports.writer_con = writer_con;
exports.reader_con = reader_con;
