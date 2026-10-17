/* ============================================================
   setup-db.js — Run this ONCE to create the urban_bites
   database and tables in MySQL.

   Usage:  node setup-db.js
============================================================ */

require('dotenv').config();
const mysql = require('mysql2/promise');

async function setup() {
    console.log('');
    console.log('🔧  Urban Bites — MySQL Database Setup');
    console.log('');

    const host = process.env.DB_HOST || 'localhost';
    const port = parseInt(process.env.DB_PORT || '3306', 10);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASS || '';
    const db = process.env.DB_NAME || 'urban_bites';

    // Step 1 — Connect WITHOUT a database to CREATE it
    const root = await mysql.createConnection({ host, port, user, password });
    await root.query(`CREATE DATABASE IF NOT EXISTS \`${db}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`✅  Database \`${db}\` created (or already exists)`);
    await root.end();

    // Step 2 — Connect WITH the database to create tables
    const conn = await mysql.createConnection({ host, port, user, password, database: db });

    await conn.query(`
        CREATE TABLE IF NOT EXISTS orders (
            id               INT           AUTO_INCREMENT PRIMARY KEY,
            order_id         VARCHAR(20)   NOT NULL UNIQUE,
            customer_name    VARCHAR(100)  NOT NULL,
            phone            VARCHAR(30)   NOT NULL,
            address          TEXT          NOT NULL,
            notes            TEXT,
            payment_method   VARCHAR(20)   NOT NULL DEFAULT 'cod',
            items            JSON          NOT NULL,
            subtotal         INT           NOT NULL,
            delivery_fee     INT           NOT NULL DEFAULT 0,
            total            INT           NOT NULL,
            created_at       DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✅  Table `orders` ready');

    await conn.query(`
        CREATE TABLE IF NOT EXISTS contact_messages (
            id          INT           AUTO_INCREMENT PRIMARY KEY,
            name        VARCHAR(100)  NOT NULL,
            contact     VARCHAR(100)  NOT NULL,
            message     TEXT          NOT NULL,
            created_at  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);
    console.log('✅  Table `contact_messages` ready');

    await conn.end();

    console.log('');
    console.log('🎉  Setup complete! Start the server with:');
    console.log('       node server.js');
    console.log('');
    console.log('📊  Open MySQL Workbench → connect → urban_bites database to see the tables.');
    console.log('');
}

setup().catch((err) => {
    console.error('');
    console.error('❌  Setup failed:', err.message);
    console.error('');
    process.exit(1);
});
