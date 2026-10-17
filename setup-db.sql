-- ============================================================
--  setup-db.sql — Urban Bites MySQL setup
--  Run this once in MySQL Workbench or MySQL CLI before
--  starting the Node.js server for the first time.
--
--  In MySQL CLI:
--    mysql -u root -p < setup-db.sql
--
--  In MySQL Workbench:
--    Open this file → click the lightning bolt (Execute) button.
-- ============================================================

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS urban_bites
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE urban_bites;

-- 2. Orders table
--    `items` stores the cart as a JSON string (array of objects)
CREATE TABLE IF NOT EXISTS orders (
  id             INT           NOT NULL AUTO_INCREMENT PRIMARY KEY,
  customer_name  VARCHAR(120)  NOT NULL,
  phone          VARCHAR(30)   NOT NULL,
  address        TEXT          NOT NULL,
  notes          TEXT,
  payment_method VARCHAR(20)   NOT NULL DEFAULT 'cod',
  items          LONGTEXT      NOT NULL,   -- JSON array string
  subtotal       INT           NOT NULL,
  delivery_fee   INT           NOT NULL,
  total          INT           NOT NULL,
  created_at     DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id         INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(120) NOT NULL,
  contact    VARCHAR(120) NOT NULL,   -- phone or email
  message    TEXT         NOT NULL,
  created_at DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Verify
SELECT 'urban_bites database and tables created successfully!' AS status;
