# 🚀 Urban Bites — Railway Deployment Guide

## Step 1: Push Code to GitHub

Open a terminal in the `urban bites` root folder:

```bash
git init
git add .
git commit -m "Ready for Railway deploy"
```

Then create a repo on [github.com](https://github.com/new) and push:

```bash
git remote add origin https://github.com/YOUR_USERNAME/urban-bites.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy on Railway

1. Go to [railway.app](https://railway.app) → **Login with GitHub**
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your `urban-bites` repo
4. Railway will detect Node.js automatically ✅

### Set the Root Directory:
- Click your service → **Settings** tab
- Set **Root Directory** to: `backend`
- Set **Start Command** to: `node server.js`

---

## Step 3: Add MySQL Database

1. In your Railway project → Click **+ New** → **Database** → **MySQL**
2. Railway creates a MySQL instance automatically ✅
3. Railway **automatically injects** these variables into your app:
   - `MYSQLHOST`, `MYSQLPORT`, `MYSQLUSER`, `MYSQLPASSWORD`, `MYSQLDATABASE`
   - *(Your `db.js` already reads these — no manual config needed!)*

### Create the tables:
- Click the MySQL service → **Query** tab
- Paste and run:

```sql
CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(20) NOT NULL UNIQUE,
  customer_name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  address TEXT NOT NULL,
  notes TEXT,
  payment_method VARCHAR(20) NOT NULL DEFAULT 'cod',
  items JSON NOT NULL,
  subtotal INT NOT NULL,
  delivery_fee INT NOT NULL DEFAULT 0,
  total INT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(100) NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## Step 4: Add Optional Environment Variables

In your Railway service → **Variables** tab, add:

| Key | Value |
|-----|-------|
| `EMAIL_USER` | `areebarustam126@gmail.com` |
| `EMAIL_PASS` | *(Gmail App Password)* |
| `WHATSAPP_NUMBER` | `923115848297` |

---

## Step 5: Done! 🎉

Railway gives you a public URL like:
```
https://urban-bites-backend.up.railway.app
```

Your full website (frontend + backend + MySQL) will be live! ✅

> **Tip:** Go to Railway MySQL service → **Data** tab to see your orders and messages in a visual table view — just like MySQL Workbench!
