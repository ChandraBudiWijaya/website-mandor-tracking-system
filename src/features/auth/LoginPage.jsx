// src/features/auth/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Button,
  TextField,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import logo from '../../assets/images/GGF.svg';
import loginBackground from '../../assets/images/banana2.jpg';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (e) => e.preventDefault();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError('Login gagal. Periksa kembali email dan kata sandi Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 h-screen overflow-hidden">
      
      {/* Kolom Kiri (3/4) - Latar Belakang dan Teks */}
      <div 
        className="hidden lg:flex lg:col-span-3 flex-col justify-center items-start p-12 text-white bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url(${loginBackground})`,
          backdropFilter: 'blur(1px)', // Efek frosted glass, sesuaikan nilai blur jika perlu
          WebkitBackdropFilter: 'blur(2px)' // Untuk kompatibilitas browser
        }}
      >
        <h1 className="text-5xl font-bold leading-tight mb-4" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
          Mandor Banana Tracking
        </h1>
        <p className="text-xl font-light max-w-2xl opacity-90" style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.7)' }}>
          Kelola dan pantau seluruh operasional perkebunan pisang Anda dengan lebih efisien dan akurat. Dapatkan informasi real-time dan tingkatkan produktivitas tim Anda.
        </p>
      </div>

      {/* Kolom Kanan (1/4) - Form Login */}
      <div className="col-span-1 flex flex-col justify-center items-center bg-gray-50 p-8 relative overflow-y-auto">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <img
              src={logo}
              alt="Wijaya Logo"
              className="w-28 h-auto mx-auto mb-4"
            />
            <h2 className="text-2xl font-bold text-gray-900">
              Selamat Datang!
            </h2>
            <p className="text-gray-600">Login ke akun Anda</p>
          </div>

          {error && (
            <Alert severity="error" className="w-full mb-4 rounded-lg">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <TextField
              label="Alamat Email"
              type="email"
              required
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    fontFamily: 'Poppins, sans-serif',
                  },
                },
              }}
            />
            <TextField
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              required
              fullWidth
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& input': {
                    fontFamily: 'Poppins, sans-serif',
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleClickShowPassword} onMouseDown={handleMouseDownPassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="py-3 text-base font-semibold rounded-lg shadow-md hover:shadow-lg transition-all"
              style={{ backgroundColor: '#1e8e3e', textTransform: 'none' }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>
            <div className="text-center text-sm">
              <p className="text-gray-600">
                Lupa password?{' '}
                <a href="mailto:chandrabw.cjcc@gmail.com" className="font-semibold text-green-700 hover:underline">
                  Hubungi Admin IT
                </a>
              </p>
            </div>
          </form>
        </div>
        <p className="absolute bottom-5 text-xs text-gray-400">
          by Chandra Budi Wijaya - 122140093
        </p>
      </div>
    </div>
  );
}

export default LoginPage;