/* ============================================================
   db.js — MySQL connection pool for Urban Bites backend
   Supports both local .env credentials AND Railway's
   auto-provided MYSQL* environment variables.
============================================================ */

require('dotenv').config();
const mysql = require('mysql2/promise');

// Railway provides MYSQLHOST, MYSQLUSER, etc automatically.
// Fall back to our own DB_* vars for local development.
const pool = mysql.createPool({
  host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306', 10),
  user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.DB_PASS || '',
  database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'urban_bites',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.MYSQLHOST ? { rejectUnauthorized: false } : undefined,
});

async function initDB() {
  try {
    const conn = await pool.getConnection();
    conn.release();
    const dbName = process.env.MYSQLDATABASE || process.env.DB_NAME || 'urban_bites';
    console.log('[DB] ✅ MySQL connected — database:', dbName);
  } catch (err) {
    console.error('[DB] ❌ MySQL connection failed:', err.message);
    console.error('     Check DB credentials in environment variables.');
    process.exit(1);
  }
}

module.exports = { pool, initDB };
