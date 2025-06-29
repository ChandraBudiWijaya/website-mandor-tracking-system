// src/features/auth/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Button,
  TextField,
  Container,
  Paper,
  Typography,
  Box,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';
import logo from '../../assets/images/wijaya.png';
import loginBackground from '../../assets/images/banana2.jpg'; // Import background image

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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
    <Box
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-fixed p-4 sm:p-6 md:p-8"
      style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${loginBackground})` }}
    >
      <Container
        maxWidth="lg"
        className="flex flex-col md:flex-row items-center justify-between w-full py-8 md:py-0"
      >
        {/* Kolom Kiri: Teks Selamat Datang */}
        <Box
          className="flex-1 flex flex-col justify-center text-white p-6 md:p-8 rounded-2xl shadow-lg max-w-full md:max-w-xl mb-8 md:mb-0 md:mr-6 text-center md:text-left"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(2px)', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
         <h1 className="font-bold text-4xl mb-2 leading-tight">
            Selamat datang di Dashboard Mandor Banana Tracking
          </h1>
          <p className="font-light text-xl">
            Kelola dan pantau seluruh operasional perkebunan pisang Anda dengan lebih efisien dan akurat.
            Dapatkan informasi real-time dan tingkatkan produktivitas tim Anda.
          </p>
        </Box>

        {/* Kolom Kanan: Card Login */}
        <Paper
          elevation={12}
          className="p-6 sm:p-8 md:p-10 flex flex-col items-center rounded-xl gap-4 w-full sm:w-4/5 md:w-auto md:max-w-sm"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
        >
          <Box
            component="img"
            src={logo}
            alt="Wijaya Logo"
            className="w-20 sm:w-24 md:w-32 h-auto mb-3"
          />

          <Typography
            component="h2"
            variant="h5"
            className="mb-4 font-bold text-center leading-snug text-gray-800 text-2xl"
          >
            Login ke Akun Anda
          </Typography>

          {error && (
            <Alert severity="error" className="mb-3 w-full rounded-lg">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className="mt-1 w-full">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Alamat Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
              
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Kata Sandi"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
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
              className="mt-6 mb-2 py-4 text-xl rounded-lg shadow-lg hover:-translate-y-0.5"
              style={{ 
                backgroundColor: '#008641', 
                transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out' 
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            <Box className="w-full text-center mt-2">
              <Typography variant="body2" className="text-gray-600 font-medium">
                Lupa password?{' '}
                <a
                  href="mailto:chandrabw.cjcc@gmail.com"
                  className="text-green-700 font-bold cursor-pointer hover:underline"
                >
                  Hubungi Admin IT
                </a>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      
      {/* Watermark */}
      <Typography
        variant="caption"
        className="absolute bottom-4 right-4 text-white opacity-90 font-medium"
        style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}
      >
        by Chandra Budi Wijaya - 122140093
      </Typography>
    </Box>
  );
}

export default LoginPage;