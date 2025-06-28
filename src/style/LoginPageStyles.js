// src/style/LoginPageStyles.js

import loginBackground from '../assets/images/banana2.jpg';

export const loginPageStyles = {
  // --- BOX UTAMA (SEKARANG BERTINDAK SEBAGAI BINGKAI/FRAME) ---
  mainBox: {
    // KOMENTAR: Kita gunakan height, bukan minHeight, untuk ukuran yang pasti.
    height: '100vh',
    display: 'flex',
    // KOMENTAR: overflow: hidden adalah kunci. Ini mencegah bingkai luar ini untuk scroll.
    overflow: 'hidden',
    background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${loginBackground})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed', // Ini penting untuk efek parallax background
  },
  // --- CONTAINER PEMBUNGKUS KONTEN (SEKARANG MENJADI AREA SCROLL) ---
  commonContainer: {
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center', // Diubah menjadi center untuk semua layar
    justifyContent: 'center',
    gap: { xs: 4, md: 5, lg: 6 },
    width: '100%',
    maxWidth: '1200px',
    margin: 'auto',
    // KOMENTAR: Ini adalah bagian terpenting untuk scrolling di mobile.
    height: '100%', // Ambil tinggi penuh dari parent (mainBox)
    overflowY: 'auto', // Izinkan container ini untuk scroll jika kontennya meluber.
    padding: { xs: '32px 16px', sm: '48px 24px' }, // Padding atas-bawah dan kiri-kanan
    // Menambahkan styling untuk scrollbar (opsional tapi bagus)
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(255, 255, 255, 0.3)',
      borderRadius: '10px',
    },
  },
  // --- KOTAK KIRI (WELCOME TEXT) ---
  leftBox: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: { xs: 'center', md: 'flex-start' },
    textAlign: { xs: 'center', md: 'left' },
    color: 'white',
    textShadow: '2px 2px 4px rgba(0,0,0,0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(4px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '20px',
    padding: { xs: 3, sm: 4, lg: 5 },
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease-in-out',
    // KOMENTAR: Pastikan item ini tidak menyusut
    flexShrink: 0,
  },
  // --- KOTAK KANAN (FORM LOGIN) ---
  rightPaper: {
    padding: { xs: 3, sm: 4, md: 5 },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '20px',
    width: '100%',
    maxWidth: '400px',
    flexShrink: 0, // Mencegah form tergencet
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.4)',
    transition: 'all 0.3s ease-in-out',
  },
  // --- Sisa style (font, link, watermark) tidak perlu diubah ---
  rightPaperTitle: {
    mb: 4,
    fontWeight: 700,
    color: 'text.primary',
    textAlign: 'center',
    lineHeight: 1.3,
    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem', lg: '2.1rem' },
  },
  linkTextSecondary: {
    color: 'text.secondary',
    fontWeight: 500,
    fontSize: { xs: '0.875rem', md: '0.9rem' },
  },
  linkPrimary: {
    color: 'primary.main',
    fontWeight: 700,
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' },
    fontSize: { xs: '0.875rem', md: '0.9rem' },
    transition: 'color 0.2s',
  },
  // Watermark tidak perlu dipindahkan karena `mainBox` masih position: relative (default)
  watermark: {
    position: 'absolute',
    bottom: { xs: 12, sm: 16 },
    left: { xs: 12, sm: 16 },
    textAlign: 'left',
    opacity: 0.9,
    textShadow: '1px 1px 2px rgba(0,0,0,0.8)',
    zIndex: 10,
    fontWeight: 500,
    color: 'white',
    fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
  },
};