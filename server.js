/* ============================================================
   server.js — Urban Bites Express backend
   Serves static frontend files + API routes for orders and
   contact messages. Saves data to MySQL.

   Start: node server.js
   Default: http://localhost:3001
============================================================ */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import DB initialiser and routes
const { initDB } = require('./db');
const ordersRouter = require('./routes/orders');
const contactRouter = require('./routes/contact');

const app = express();
const PORT = process.env.PORT || 3001;

// ── Middleware ─────────────────────────────────────────────

// Allow the static frontend pages to call the API
app.use(cors({
    origin: '*',          // open – fine for local development
    methods: ['GET', 'POST'],
}));

app.use(express.json());

// ── Serve static frontend files ────────────────────────────
// All HTML / CSS / JS files live one level up from backend/
const FRONTEND_DIR = path.join(__dirname, '..');
app.use(express.static(FRONTEND_DIR));

// ── API routes ─────────────────────────────────────────────
app.use('/api/orders', ordersRouter);
app.use('/api/contact', contactRouter);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── 404 for unknown API routes ─────────────────────────────
app.use('/api', (_req, res) => {
    res.status(404).json({ success: false, message: 'API route not found.' });
});

// ── Global error handler ───────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err.message);
    res.status(500).json({ success: false, message: 'An unexpected server error occurred.' });
});

// ── Initialise MySQL DB then start server ──────────────────
async function start() {
    await initDB();   // exits process if MySQL is unreachable

    app.listen(PORT, () => {
        console.log('');
        console.log('┌─────────────────────────────────────────┐');
        console.log(`│  🔥 Urban Bites backend running          │`);
        console.log(`│     http://localhost:${PORT}               │`);
        console.log('│                                         │');
        console.log('│  Database: MySQL (urban_bites)          │');
        console.log('│                                         │');
        console.log('│  API endpoints:                         │');
        console.log('│    POST /api/orders   — place an order  │');
        console.log('│    POST /api/contact  — contact form    │');
        console.log('│    GET  /api/health   — health check    │');
        console.log('└─────────────────────────────────────────┘');
        console.log('');
    });
}

start();
