-- ============================================================
--  Urban Bites — MySQL Database Setup
--  Run this in phpMyAdmin > SQL tab
-- ============================================================

CREATE DATABASE IF NOT EXISTS urban_bites
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE urban_bites;

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  order_id      VARCHAR(20)  NOT NULL UNIQUE,
  customer_name VARCHAR(100) NOT NULL,
  phone         VARCHAR(30)  NOT NULL,
  address       TEXT         NOT NULL,
  notes         TEXT,
  payment_method VARCHAR(20) NOT NULL,
  items         JSON         NOT NULL,
  subtotal      INT          NOT NULL,
  delivery_fee  INT          NOT NULL DEFAULT 0,
  total         INT          NOT NULL,
  created_at    TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contacts (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  contact    VARCHAR(100) NOT NULL,
  message    TEXT         NOT NULL,
  created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);
