# 🧊 Portfolio // Emir Yafi

Full-stack portfolio website dengan desain **iOS Glassmorphism (Dark Mode)** — dibangun dari nol pakai **Node.js + Express + EJS**.

Layout terinspirasi dari struktur grid portfolio modern (Hero, Work Experience Timeline, Tech Stack Chips, Featured Projects, Contact) dengan visual kaca ala iOS 26 di atas latar belakang chrome/metallic yang berpendar.

## ✨ Fitur

- 🪟 TopBar ala macOS — 3 tombol indikator (merah, kuning, hijau) + mockup URL bar + ikon aksi (Chat, Socials, GitHub)
- 📐 **Widget Landscape** — semua widget full-width; isinya mengalir menyamping: hero split (identitas kiri / info kanan), timeline horizontal, proyek 2 kolom, contact split (form kiri / pills kanan)
- 👤 Hero Widget — status badge "Available for opportunities", avatar, nama, bio, stats
- 🧪 Tech Stack Widget — chips interaktif dengan tooltip level kepercayaan
- 💼 Experience Widget — timeline riwayat kerja dengan garis pendar & kartu kaca
- 🚀 Featured Projects Widget — grid kartu proyek dengan thumbnail, fitur, tag, link live/code
- 💬 Contact Widget — form pesan + pill button iOS (WhatsApp, Email, LinkedIn, GitHub)
- 🎛️ Semua konten dari **satu file JSON** (`data/portfolio.json`) — edit tanpa sentuh kode
- 📨 Form pesan tersimpan otomatis ke `data/messages.json`

## 📁 Struktur Folder

```
portfolio-app
├── /data
│   ├── portfolio.json      # Semua konten (edit di sini!)
│   └── messages.json       # Pesan masuk dari form (otomatis dibuat)
├── /public
│   ├── /css/style.css      # Custom Glassmorphism CSS & animasi
│   ├── /js/main.js         # Interaksi frontend
│   └── /images             # Avatar & thumbnail proyek
├── /views
│   ├── index.ejs           # Halaman utama + grid widget
│   └── /partials           # Widget terpisah (hero, projects, dll)
├── .env                    # Konfigurasi (PORT, domain)
├── package.json
├── server.js               # Server utama Express
└── README.md
```

## 🚀 Cara Install & Menjalankan

> Butuh **Node.js 18+**. Cek dengan `node -v`.

```bash
# 1. Install dependencies
npm install

# 2. Jalankan server
npm start
# atau mode development (auto-restart saat ada perubahan)
npm run dev

# 3. Buka browser
# http://localhost:3000
```

## 🔌 API Endpoints

| Method | Endpoint          | Fungsi                                        |
| ------ | ----------------- | --------------------------------------------- |
| GET    | `/`               | Render halaman utama portfolio                |
| GET    | `/api/portfolio`  | Data portfolio dalam bentuk JSON              |
| POST   | `/api/contact`    | Terima pesan form → simpan ke `messages.json` |

Contoh tes POST:

```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Budi","email":"budi@mail.com","message":"Halo, saya tertarik kerja sama!"}'
```

## ✏️ Cara Mengedit Konten

Buka **`data/portfolio.json`** — semua teks & link diambil dari sana:

| Mau ubah apa                     | Cari di JSON                            |
| -------------------------------- | --------------------------------------- |
| Nama, role, bio                  | `profile`                               |
| **Nomor WhatsApp**               | `profile.phone` + `socials` (WhatsApp)  |
| Email                            | `profile.email` + `socials` (Email)     |
| Domain di URL bar                | `site.domain` (atau `.env`)             |
| Tech stack & level               | `techStack`                             |
| Pengalaman kerja                 | `experience`                            |
| Proyek & link live/code          | `projects`                              |

### Ganti Foto

1. Ganti file `public/images/avatar.svg` dengan foto kamu (misal `avatar.jpg`)
2. Update `profile.avatar` di JSON menjadi `"/images/avatar.jpg"`
3. Thumbnail proyek ada di `public/images/projects/` — ganti `p1.svg`–`p4.svg` atau arahkan JSON ke file baru

## 🎨 Customisasi Tampilan

- Warna aksen, radius, blur glass → variabel di paling atas `public/css/style.css` (`:root`)
- Efek glass widget → class `.glass` (backdrop-blur 20px, saturate 180%, border, shadow)
- Layout grid → bagian `.widget-grid` di CSS

## 📦 Tech Stack

Node.js · Express · EJS · Tailwind CSS (CDN) · Custom CSS · dotenv · cors · body-parser
