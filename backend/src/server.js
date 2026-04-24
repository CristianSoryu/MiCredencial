const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "tu_password",
  database: "mi_app"
});

db.connect(err => {
  if (err) throw err;
  console.log("Conectado a MySQL");
});