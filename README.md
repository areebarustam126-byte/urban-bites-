# Urban Bites — Backend

Node.js + Express + SQLite backend for the Urban Bites restaurant website.

## Requirements

- [Node.js](https://nodejs.org) v18 or higher (LTS recommended)

## Setup & Run

### 1. Install dependencies

Open a terminal, navigate to the `backend` folder inside the project, and run:

```bash
cd "c:\Users\DELL\Desktop\my projects\urban bites\backend"
npm install
```

This installs: `express`, `better-sqlite3`, `cors`, `dotenv`, `express-validator`.

### 2. Start the server

```bash
node server.js
```

The server starts on **http://localhost:3001**

### 3. Open the website

Open **http://localhost:3001** in your browser (instead of double-clicking the HTML files directly). This serves all pages through the backend server.

---

## API Endpoints

### `POST /api/orders`
Places a customer order. Validates all fields and saves to SQLite.

**Request body:**
```json
{
  "name": "Sara Khan",
  "phone": "03001234567",
  "address": "House 5, Block A, Clifton, Karachi",
  "notes": "No onions please",
  "payment": "cod",
  "items": [
    { "id": "ub-smash", "name": "Urban Smash Double", "price": 890, "qty": 2 }
  ]
}
```

**Success response (`200`):**
```json
{ "success": true, "orderId": "UB-A1B2C3D4", "subtotal": 1780, "deliveryFee": 0, "total": 1780 }
```

**Validation error (`422`):**
```json
{ "success": false, "errors": [{ "msg": "Full name must be at least 2 characters.", "path": "name" }] }
```

---

### `POST /api/contact`
Saves a contact form message to SQLite.

**Request body:**
```json
{ "name": "Ali Raza", "contact": "ali@example.com", "message": "When do you open?" }
```

**Success response (`200`):**
```json
{ "success": true }
```

---

### `GET /api/health`
Health check.
```json
{ "status": "ok", "timestamp": "2026-10-14T..." }
```

---

## Database

The SQLite database file `urban_bites.db` is created automatically in the `backend/` folder on first run. It contains two tables:

- **`orders`** — stores all customer orders
- **`contact_messages`** — stores all contact form submissions

### View saved data (PowerShell)

```powershell
cd "c:\Users\DELL\Desktop\my projects\urban bites\backend"
node -e "const db=require('better-sqlite3')('urban_bites.db'); console.log('ORDERS:', JSON.stringify(db.prepare('SELECT * FROM orders').all(), null, 2)); console.log('MESSAGES:', JSON.stringify(db.prepare('SELECT * FROM contact_messages').all(), null, 2));"
```

---

## Quick API Test (PowerShell)

```powershell
# Test contact form
Invoke-RestMethod -Uri "http://localhost:3001/api/contact" -Method POST -ContentType "application/json" -Body '{"name":"Test User","contact":"test@test.com","message":"Hello Urban Bites!"}'

# Test order placement
Invoke-RestMethod -Uri "http://localhost:3001/api/orders" -Method POST -ContentType "application/json" -Body '{"name":"Sara Khan","phone":"03001234567","address":"House 5 Block A Clifton Karachi","payment":"cod","items":[{"id":"ub-smash","name":"Urban Smash Double","price":890,"qty":1}]}'
```

---

## Project Structure

```
urban bites/
├── index.html
├── menu.html
├── cart.html              ← checkout UI (updated: real order submit)
├── contact.html
├── contact.js             ← updated: real fetch to /api/contact
├── cart-page.js           ← updated: real fetch to /api/orders
├── ...other frontend files
│
└── backend/
    ├── server.js          ← Express app entry point
    ├── db.js              ← SQLite setup + table creation
    ├── package.json
    ├── .env               ← PORT=3001
    ├── urban_bites.db     ← created automatically on first run
    └── routes/
        ├── orders.js      ← POST /api/orders
        └── contact.js     ← POST /api/contact
```

## Delivery Fee Logic

| Order Subtotal | Delivery Fee |
|---|---|
| Under PKR 1,000 | PKR 150 |
| PKR 1,000 and above | Free |

> **Note:** Delivery fee is calculated server-side — the frontend total is always verified by the server.
