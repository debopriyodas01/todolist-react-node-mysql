const { createPool } = require("mysql2/promise");

const pool = createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  namedPlaceholders: true,
  waitForConnections: true,
  connectionLimit: 10,
});

async function migrate() {
  console.log("Checking database...");

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id CHAR(36) PRIMARY KEY,
      todo VARCHAR(255) NOT NULL
    )
  `);

  console.log("✓ Database ready");
}

module.exports = {
  pool,
  migrate,
};
