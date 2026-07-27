const { createPool } = require("mysql2/promise");

const pool = createPool({
  host: process.env.DB_HOST || "mysql",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "todo",
  password: process.env.DB_PASSWORD || "todo123",
  database: process.env.DB_NAME || "todolist",
  namedPlaceholders: true,
  waitForConnections: true,
  connectionLimit: 10,
});

module.exports = {
  pool,
};
