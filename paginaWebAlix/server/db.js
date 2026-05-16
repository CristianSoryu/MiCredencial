const pool = mysql.createPool({
  host: "localhost",
  port: 3307,        // ← puerto de MySQL (XAMPP usa 3306 por defecto)
  user: "root",
  password: "tu_password",
  database: "micredencial",
  connectionLimit: 10
});