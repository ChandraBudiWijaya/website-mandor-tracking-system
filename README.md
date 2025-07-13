<div align="center">
<h1 align="center">📍 WEBSITE-MANDOR-TRACKING-SYSTEM 📍</h1>

<p align="center"><i>Transforming Operations with Real-Time Precision and Insight</i></p>

<p align="center">
  <img src="https://img.shields.io/badge/last%20commit-last%20friday-informational?style=flat-square" />
  <img src="https://img.shields.io/badge/javascript-96.8%25-yellow?style=flat-square" />
  <img src="https://img.shields.io/badge/languages-3-blue?style=flat-square" />
</p>

 ### Built with the tools and technologies:

![JSON](https://img.shields.io/badge/JSON-black?style=for-the-badge&logo=json)
![Markdown](https://img.shields.io/badge/Markdown-black?style=for-the-badge&logo=markdown)
![npm](https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Autoprefixer](https://img.shields.io/badge/Autoprefixer-DD3735?style=for-the-badge&logo=autoprefixer&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white)
![PostCSS](https://img.shields.io/badge/PostCSS-DD3A0A?style=for-the-badge&logo=postcss&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)
</div>

---

## 📘 Deskripsi

**Website-Mandor-Tracking-System** adalah dashboard berbasis web yang digunakan untuk **monitoring aktivitas tenaga kerja di area perkebunan secara real-time**. Sistem ini memanfaatkan **React**, **Firebase**, dan **Leaflet.js** untuk memberikan informasi yang akurat, visualisasi lokasi, serta pengelolaan data karyawan dan area kerja.

---

## 🚀 Fitur Utama

- 🔐 **Autentikasi Aman** — Login menggunakan Firebase Auth dengan timeout otomatis.
- 🗺️ **Live Dashboard** — Peta real-time dengan daftar karyawan aktif yang dapat diklik.
- 📍 **Riwayat Lokasi** — Playback pergerakan karyawan berdasarkan tanggal yang dipilih.
- 📊 **Ringkasan Harian** — Visualisasi waktu dalam/luar area kerja dalam bentuk donut chart.
- 👥 **Manajemen Karyawan** — CRUD karyawan dengan form interaktif.
- 🗂️ **Geofence Management** — Buat/edit area kerja dengan menggambar polygon.
- 🌙 **Modern UI** — Responsif, dark mode, dan tampilan frosted-glass login.

---

## 🛠️ Teknologi yang Digunakan

### Frontend:
- ⚛️ React.js
- 🧭 React Router
- 🎨 Material-UI v5 & Emotion
- 💨 Tailwind CSS
- 🌍 Leaflet & React-Leaflet
- ✏️ Leaflet-Draw
- 📈 Chart.js & React-Chartjs-2
- 📚 React Pro Sidebar

### Backend & Database:
- 🔥 Firebase (Auth, Firestore)

---

## 📁 Struktur Proyek

```
src/
├── api/              # Firebase config
├── assets/           # Gambar, SVG, dsb.
├── components/       # Komponen UI umum (Navbar, Sidebar)
├── context/          # Global state (Auth, Theme)
├── features/         # Modul fitur utama
│   ├── auth/         # Halaman login
│   ├── dashboard/    # Peta & daftar pekerja
│   ├── history/      # Riwayat lokasi & ringkasan
│   └── management/   # Manajemen karyawan & area kerja
├── hooks/            # Custom hooks (useEmployees, useGeofences)
└── theme/            # Konfigurasi dark/light theme
```

---

## 🧰 Instalasi dan Setup

### 1. Prasyarat
- Node.js v14+
- npm atau Yarn

### 2. Clone Repo
```bash
git clone https://github.com/chandrabudiwijaya/website-mandor-tracking-system.git
cd website-mandor-tracking-system
```

### 3. Install Dependency
```bash
npm install
# atau
yarn install
```

### 4. Konfigurasi Firebase
Buat file `.env` dan tambahkan konfigurasi berikut:
```
REACT_APP_API_KEY=your_api_key
REACT_APP_AUTH_DOMAIN=your_auth_domain
REACT_APP_PROJECT_ID=your_project_id
REACT_APP_STORAGE_BUCKET=your_storage_bucket
REACT_APP_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_APP_ID=your_app_id
```

### 5. Jalankan Aplikasi
```bash
npm start
```
Akses di `http://localhost:3000`

---

## 💻 Cara Penggunaan

### 🔐 Login
Gunakan akun yang sudah didaftarkan di Firebase Auth.

### 📊 Dasbor
- Menampilkan lokasi pekerja secara real-time.
- Klik nama karyawan untuk fokus ke lokasinya.

### 🧭 Riwayat Lokasi
- Pilih karyawan dan tanggal.
- Playback pergerakan + grafik ringkasan (inside vs outside geofence).

### 🛠️ Manajemen
- **Karyawan**: Tambah/edit/hapus pekerja.
- **Area Kerja**: Gambar area kerja di peta dan tetapkan ke karyawan.

---

## ✨ Kontribusi
Pull request sangat disambut! Untuk perubahan besar, harap buka issue terlebih dahulu.

---

## 📝 Lisensi
MIT License © 2025 Chandra Budi Wijaya

---

> Dokumentasi ini disusun untuk mempermudah deployment dan pengembangan lanjutan oleh tim backend, frontend, dan admin operasional.