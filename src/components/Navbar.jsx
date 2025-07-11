// src/components/Navbar.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useThemeMode } from '../context/ThemeContext';
import { useTheme } from '@mui/material/styles';
import { FaSun, FaMoon } from 'react-icons/fa';
import appLogo from '../assets/images/GGF.svg';

const DarkModeSlider = () => {
  const theme = useTheme();
  const { toggleColorMode } = useThemeMode();

  const isDarkMode = theme.palette.mode === 'dark';

  return (
    <button
      onClick={toggleColorMode}
      className="relative w-16 h-8 flex items-center bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none shadow-inner"
      title="Toggle Dark/Light Mode"
    >
      <div className="absolute left-1.5">
        <FaSun className="text-yellow-500" />
      </div>
      <div className="absolute right-1.5">
        <FaMoon className="text-gray-400" />
      </div>
      <div
        className={`
          absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${isDarkMode ? 'translate-x-8' : 'translate-x-0'}
        `}
      ></div>
    </button>
  );
};

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
    <header className="flex items-center justify-between px-6 h-[64px] bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
      
      {/* Bagian Kiri: Logo dan Judul */}
      <div className="flex items-center gap-2.5">
        <img src={appLogo} alt="GGF Logo" className="h-[88px] w-auto" />
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 -tracking-wide">
          Mandor Tracking System
        </h1>
      </div>

      {/* Bagian Kanan: Info User dan Tombol */}
      {currentUser && (
        <div className="flex items-center gap-4">
          <span className="text-base font-medium text-gray-700 dark:text-gray-300">
            Halo, {currentUser.email}
          </span>

          {/* --- [PERBAIKAN] Menggunakan komponen slider kustom --- */}
          <DarkModeSlider />

          <button
            onClick={handleLogout}
            className="px-5 py-2.5 bg-red-500 text-white rounded-md text-base font-semibold transition-colors duration-300 hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;