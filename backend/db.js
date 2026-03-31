const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Balaji@2618", // change this
  database: "empmaster"
});

db.connect((err) => {
  if (err) {
    console.log("DB Connection Failed:", err);
  } else {
    console.log("MySQL Connected Successfully");
  }
});

module.exports = db;