/**
 * build.js — Static export untuk hosting statis (Netlify, Vercel, dll).
 *
 * Netlify (gratis) tidak menjalankan server Express, jadi halaman utama
 * harus di-render sekali menjadi HTML statis. Script ini:
 *
 *   1. Membaca data/portfolio.json
 *   2. Merender views/index.ejs  →  dist/index.html
 *   3. Menyalin aset statis (css/, js/, images/) ke dist/
 *   4. Menyalin data/portfolio.json  →  dist/api/portfolio.json
 *      (supaya tautan "/api/portfolio" di footer tetap berfungsi)
 *   5. Membuat dist/_redirects supaya /api/portfolio ter-resolve ke file JSON
 *
 * Jalankan:  npm run build
 */

const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const VIEWS = path.join(ROOT, 'views');
const PUBLIC = path.join(ROOT, 'public');
const DIST = path.join(ROOT, 'dist');

/* ------------------------------------------------------------------ */
/*  1. Baca data portofolio                                            */
/* ------------------------------------------------------------------ */
const portfolio = JSON.parse(
  fs.readFileSync(path.join(ROOT, 'data', 'portfolio.json'), 'utf-8')
);

/* ------------------------------------------------------------------ */
/*  2. Render views/index.ejs → dist/index.html                        */
/* ------------------------------------------------------------------ */
// Dipakai ejs.compile + render (bukan renderFileSync) karena API
// renderFileSync tidak tersedia di ejs 3.1.x. Opsi `filename` penting
// supaya <%- include('partials/...') %> ter-resolve dari folder views/.
const renderPage = ejs.compile(
  fs.readFileSync(path.join(VIEWS, 'index.ejs'), 'utf-8'),
  { filename: path.join(VIEWS, 'index.ejs') }
);

const html = renderPage({
  portfolio,
  currentYear: new Date().getFullYear(),
});

/* ------------------------------------------------------------------ */
/*  3. Bersihkan & siapkan folder dist/                                */
/* ------------------------------------------------------------------ */
fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

fs.writeFileSync(path.join(DIST, 'index.html'), html);

/* ------------------------------------------------------------------ */
/*  4. Salin aset statis (public/* → dist/*)                           */
/* ------------------------------------------------------------------ */
for (const entry of fs.readdirSync(PUBLIC)) {
  fs.cpSync(path.join(PUBLIC, entry), path.join(DIST, entry), { recursive: true });
}

/* ------------------------------------------------------------------ */
/*  5. Dukung tautan "/api/portfolio" (chip di footer)                 */
/* ------------------------------------------------------------------ */
fs.mkdirSync(path.join(DIST, 'api'), { recursive: true });
fs.copyFileSync(
  path.join(ROOT, 'data', 'portfolio.json'),
  path.join(DIST, 'api', 'portfolio.json')
);
fs.writeFileSync(
  path.join(DIST, '_redirects'),
  '/api/portfolio  /api/portfolio.json  200\n'
);

console.log('✅ Build selesai!');
console.log('   📄 dist/index.html');
console.log('   🖼️  dist/css, dist/js, dist/images');
console.log('   🔗 dist/api/portfolio.json + dist/_redirects');
