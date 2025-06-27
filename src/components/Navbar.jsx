import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import appLogo from '../assets/images/wijaya_logo.png';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  // --- START: Updated Styles ---

  const navbarContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 25px', // Tambah padding samping sedikit
    height: '70px', // Sedikit lebih tinggi
    backgroundColor: '#FFFFFF', // Putih bersih
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)', // Tambah shadow untuk efek melayang
    position: 'sticky', // Buat sticky agar selalu di atas saat scroll
    top: 0,
    zIndex: 1000, // Pastikan di atas elemen lain
  };

  const brandSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px', // Kurangi sedikit gap
  };

  const logoImageStyle = {
    height: '55px', // Sesuaikan tinggi logo
    width: 'auto',
    // Tidak perlu marginRight karena sudah ada gap di brandSectionStyle
  };

  const brandTitleStyle = {
    fontSize: '1.6rem', // Sedikit lebih besar
    fontWeight: '600', // Lebih tebal
    color: '#0B1D30', // Tetap hitam gelap
    margin: 0,
    letterSpacing: '-0.5px', // Sedikit kerapatan huruf
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '20px', // Jarak antar elemen user
  };

  const userEmailStyle = {
    fontSize: '1rem',
    color: '#333333', // Warna teks email
    fontWeight: '500', // Sedikit tebal
  };

  const logoutButtonStyle = {
    padding: '10px 20px', // Padding lebih besar
    backgroundColor: '#E74C3C', // Warna merah yang lebih kalem (darker red)
    color: 'white',
    border: 'none',
    borderRadius: '6px', // Sudut lebih membulat
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    transition: 'background-color 0.3s ease', // Efek transisi saat hover

    // Pseudo-class for hover (simulated using JavaScript logic or a wrapper for actual CSS)
    // For inline styles, hover cannot be directly applied.
    // If you need hover effects, consider CSS Modules or Styled Components.
    // As a workaround for inline, you'd typically handle this with state,
    // but that adds complexity and is outside the "no functionality change" scope.
    // For now, let's keep it simple.
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Gagal untuk logout', error);
      // Anda bisa menambahkan alert atau notifikasi di sini
      alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
    }
  };

  // --- END: Updated Styles ---

  return (
    <header style={navbarContainerStyle}>
      <div style={brandSectionStyle}>
        <img src={appLogo} alt="Mandor Tracking Logo" style={logoImageStyle} />
        <h1 style={brandTitleStyle}>Mandor Banana Tracking</h1>
      </div>

      {currentUser && (
        <div style={userSectionStyle}>
          <span style={userEmailStyle}>Halo, {currentUser.email}</span>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;