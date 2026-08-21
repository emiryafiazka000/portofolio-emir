/**
 * portfolio-app — Full-stack portfolio website
 * Express + EJS + Glassmorphism UI
 *
 * Endpoints:
 *   GET  /                 → render halaman utama (views/index.ejs)
 *   GET  /api/portfolio    → JSON data dari data/portfolio.json
 *   POST /api/contact      → simpan pesan dari form kontak ke data/messages.json
 */

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const PORTFOLIO_FILE = path.join(DATA_DIR, 'portfolio.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

/* ------------------------------------------------------------------ */
/*  Middleware & view engine                                           */
/* ------------------------------------------------------------------ */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(cors());
app.use(bodyParser.json({ limit: '10kb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

/* Simple request logger (dev-friendly) */
app.use((req, _res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
  next();
});

/* ------------------------------------------------------------------ */
/*  Data helpers                                                       */
/* ------------------------------------------------------------------ */

/** Load & parse data/portfolio.json — dibaca tiap request supaya
 *  perubahan di file langsung kebaca tanpa restart server. */
function loadPortfolio() {
  try {
    const raw = fs.readFileSync(PORTFOLIO_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('❌ Gagal membaca data/portfolio.json:', err.message);
    throw err;
  }
}

/** Ensure data/messages.json exists as an array. */
function ensureMessagesFile() {
  if (!fs.existsSync(MESSAGES_FILE)) {
    fs.writeFileSync(MESSAGES_FILE, '[]', 'utf-8');
  }
}

/** Append a message to data/messages.json. */
function saveMessage(message) {
  ensureMessagesFile();
  const messages = JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
  messages.push(message);
  fs.writeFileSync(MESSAGES_FILE, JSON.stringify(messages, null, 2), 'utf-8');
  return message;
}

/* ------------------------------------------------------------------ */
/*  Routes                                                             */
/* ------------------------------------------------------------------ */

/* GET / → render halaman utama */
app.get('/', (_req, res) => {
  const portfolio = loadPortfolio();
  res.render('index', {
    portfolio,
    currentYear: new Date().getFullYear(),
  });
});

/* GET /api/portfolio → JSON data portofolio */
app.get('/api/portfolio', (_req, res) => {
  res.json(loadPortfolio());
});

/* POST /api/contact → simpan pesan pengunjung */
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body || {};

  const clean = (v) => (typeof v === 'string' ? v.trim() : '');

  const name_ = clean(name);
  const email_ = clean(email);
  const message_ = clean(message);

  if (!name_ || !email_ || !message_) {
    return res.status(400).json({
      success: false,
      error: 'Semua field (nama, email, pesan) wajib diisi.',
    });
  }

  if (!/^\S+@\S+\.\S+$/.test(email_)) {
    return res.status(400).json({
      success: false,
      error: 'Format email nggak valid, coba cek lagi ya.',
    });
  }

  const entry = {
    id: Date.now(),
    name: name_,
    email: email_,
    message: message_,
    createdAt: new Date().toISOString(),
  };

  saveMessage(entry);
  console.log(`💌 Pesan baru dari ${name_} <${email_}>`);

  res.status(201).json({
    success: true,
    message: 'Pesan terkirim! Makasih udah nyapa. 💬',
    data: entry,
  });
});

/* 404 handler */
app.use((_req, res) => {
  res.status(404).json({ success: false, error: 'Halaman nggak ketemu. 404!' });
});

/* Global error handler */
app.use((err, _req, res, _next) => {
  console.error('💥 Server error:', err);
  res.status(500).json({ success: false, error: 'Terjadi kesalahan di server.' });
});

/* ------------------------------------------------------------------ */
/*  Start server                                                       */
/* ------------------------------------------------------------------ */
app.listen(PORT, () => {
  console.log('────────────────────────────────────────────');
  console.log('  🚀  PORTFOLIO // EMIR YAFI');
  console.log(`  🌐  http://localhost:${PORT}`);
  console.log(`  📦  API data : http://localhost:${PORT}/api/portfolio`);
  console.log('────────────────────────────────────────────');
});
