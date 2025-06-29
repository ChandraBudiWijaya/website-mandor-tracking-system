// src/components/Navbar.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import appLogo from '../assets/images/wijaya.png';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Gagal untuk logout', error);
      alert('Terjadi kesalahan saat logout. Silakan coba lagi.');
    }
  };

  return (
    <header className="flex items-center justify-between px-6 h-[64px] bg-white shadow-md sticky top-0 z-50">
      {/* Bagian Kiri: Logo dan Judul */}
      <div className="flex items-center gap-2.5">
        <img src={appLogo} alt="Mandor Tracking Logo" className="h-[55px] w-auto" />
        <h1 className="text-2xl font-semibold text-gray-800 -tracking-wide">
          Mandor Banana Tracking
        </h1>
      </div>

      {/* Bagian Kanan: Info User dan Tombol Logout */}
      {currentUser && (
        <div className="flex items-center gap-5">
          <span className="text-base font-medium text-gray-700">
            Halo, {currentUser.email}
          </span>
          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-[#E74C3C] text-white rounded-md text-base font-semibold transition-colors duration-300 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;