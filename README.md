# Mandor Tracking System Dashboard


Aplikasi web dashboard untuk Mandor Tracking, dibangun dengan React, Material-UI, dan Firebase. Dashboard ini bertujuan untuk membantu mandor mengelola dan memantau operasional perkebunan secara lebih efisien, termasuk pelacakan mandor, ringkasan harian, dan fitur geofence.

## Daftar Isi

- [Mandor Tracking System Dashboard](#mandor-tracking-system-dashboard)
  - [Daftar Isi](#daftar-isi)
  - [Fitur Utama](#fitur-utama)
  - [Teknologi yang Digunakan](#teknologi-yang-digunakan)
    - [Frontend:](#frontend)
    - [Backend / Database:](#backend--database)
  - [Persyaratan Sistem](#persyaratan-sistem)

## Fitur Utama

-   **Autentikasi Pengguna**: Sistem login yang aman dengan Firebase Authentication (Email/Password).
-   **Manajemen Karyawan**: Fitur CRUD (Create, Read, Update, Delete) untuk data karyawan.
-   **Pelacakan Sejarah**: Melihat riwayat lokasi dan aktivitas karyawan pada tanggal tertentu.
-   **Ringkasan Harian**: Melihat ringkasan data operasional harian.
-   **Geofencing**: Memantau pergerakan karyawan dalam area kerja yang telah ditentukan.
-   **UI Modern**: Antarmuka pengguna yang responsif dan menarik dengan Material-UI dan desain _frosted glass_.

## Teknologi yang Digunakan

### Frontend:
-   **React.js**
-   **Material-UI v5** (untuk komponen UI dan styling)
-   **Emotion** (sebagai engine styling CSS-in-JS untuk Material-UI)
-   **React Router DOM** (untuk navigasi antar halaman)
-   **Google Fonts** (Poppins)

### Backend / Database:
-   **Firebase** (Authentication untuk login, Firestore Database untuk penyimpanan data).

## Persyaratan Sistem

Sebelum Anda dapat menginstal dan menjalankan proyek ini, pastikan Anda memiliki perangkat lunak berikut terinstal di sistem Anda:

-   **Node.js**: Versi 14.x atau lebih tinggi.
    -   _Saran: Gunakan [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager) untuk mengelola versi Node.js Anda dengan mudah._
-   **npm (Node Package Manager)** atau **Yarn**:
    -   **npm**: Versi 8.x atau lebih tinggi (biasanya sudah terinstal bersama Node.js).
    -   **Yarn**: Versi 1.x atau lebih tinggi (jika Anda memilih menggunakan Yarn).

Anda dapat memeriksa versi Node.js dan npm/Yarn Anda dengan menjalankan perintah berikut di terminal:
```bash
node -v
npm -v
yarn -v # Jika menggunakan Yarn
