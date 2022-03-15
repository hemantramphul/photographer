var mysql = require("mysql");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "photographer",
});

connection.connect(function (error) {
  if (!!error) {
    console.log(error);
  } else {
    console.log("Database Connected!");
  }
});

module.exports = connection;
