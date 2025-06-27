// src/features/auth/components/LoginPage.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Pastikan path ini benar
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
  useTheme // Import useTheme untuk mengakses palet warna di JSX
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CircularProgress from '@mui/material/CircularProgress';

// --- Impor style dari file terpisah ---
// PATH PENTING: Sesuaikan path ini agar benar relatif terhadap file LoginPage.jsx
import { loginPageStyles } from '../../style/LoginPageStyles'; 

// --- (PENTING) Impor logo di sini ---
// PATH PENTING: Sesuaikan path ini agar benar relatif terhadap file LoginPage.jsx
import logo from '../../assets/images/wijaya_logo.png'; 


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth(); // Pastikan AuthContext berfungsi dengan baik
  const navigate = useNavigate();
  const theme = useTheme(); // Gunakan useTheme hook untuk mengakses palet warna

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
    // ThemeProvider diasumsikan sudah ada di level App.js atau index.js
    <Box sx={loginPageStyles.mainBox}>
      <Container
        maxWidth="lg"
        sx={loginPageStyles.commonContainer}
      >
        {/* Kolom Kiri: Teks Selamat Datang / Penjelasan dengan Frosted Glass */}
        <Box sx={loginPageStyles.leftBox}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 'inherit', // Akan mengambil fontWeight dari typography.h3 di tema
              mb: 2,
              lineHeight: 1.2,
              color: 'inherit', // Akan mengambil color dari Box kiri (putih)
            }}
          >
            Selamat datang di Dashboard Mandor Banana Tracking
          </Typography>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'inherit', // Akan mengambil fontWeight dari typography.h6 di tema
              color: 'inherit', // Akan mengambil color dari Box kiri (putih)
            }}
          >
            Kelola dan pantau seluruh operasional perkebunan pisang Anda dengan lebih efisien dan akurat.
            Dapatkan informasi real-time dan tingkatkan produktivitas tim Anda.
          </Typography>
        </Box>

        {/* Kolom Kanan: Card Login */}
        <Paper elevation={12} sx={loginPageStyles.rightPaper}>
          {/* Logo di sini */}
          <Box
            component="img"
            src={logo}
            alt="Wijaya Logo"
            sx={{
              width: { xs: '80px', sm: '100px', md: '120px' },
              height: 'auto',
              mb: 3,
            }}
          />

          <Typography
            component="h2"
            variant="h5"
            sx={loginPageStyles.rightPaperTitle} // Style judul diambil dari objek terpisah
          >
            Login ke Akun Anda
          </Typography>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3, width: '100%', borderRadius: '8px' }}
            >
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
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
              // Style TextField sudah diatur di tema global (MuiTextField)
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
              // Style TextField sudah diatur di tema global
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {/* Warna icon sekarang diambil dari theme.palette.text.secondary */}
                      {showPassword ? <VisibilityOff sx={{ color: theme.palette.text.secondary }} /> : <Visibility sx={{ color: theme.palette.text.secondary }} />}
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
              sx={{
                mt: 4,
                mb: 2,
                py: 1.8,
                fontSize: '1.3rem',
                borderRadius: '8px',
                // Style Button sudah diatur di tema global (MuiButton)
                boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.4)',
                backgroundColor: '#008641',
                transition: 'background-color 0.3s ease-in-out, transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor: '#006f35', // Warna saat hover
                },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
            </Button>

            <Box sx={{ width: '100%', textAlign: 'center', mt: 2 }}>
              <Typography
                variant="body2"
                sx={loginPageStyles.linkTextSecondary} // Style dari objek terpisah
              >
                Belum punya akun?{' '}
                <Typography
                  component="span"
                  variant="body2"
                  sx={loginPageStyles.linkPrimary} // Style dari objek terpisah
                  onClick={() => navigate('/signup')}
                >
                  Daftar di sini
                </Typography>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      {/* Watermark */}
      <Typography
        variant="caption"
        sx={loginPageStyles.watermark} // Style dari objek terpisah
      >
        by Chandra Budi Wijaya - 122140093
      </Typography>
    </Box>
  );
}

export default LoginPage;