// src/theme/theme.js

// Fungsi ini akan membuat tema berdasarkan mode yang diberikan ('light' atau 'dark')
export const getDesignTokens = (mode) => ({
  palette: {
    mode, // Ini akan secara otomatis mengatur banyak warna dasar oleh MUI
    ...(mode === 'light'
      ? {
          // Nilai untuk mode terang
          primary: { main: '#1e8e3e' }, // Warna hijau
          background: {
            default: '#F8F9FA', // Latar belakang abu-abu sangat muda
            paper: '#FFFFFF',
          },
        }
      : {
          // Nilai untuk mode gelap
          primary: { main: '#66bb6a' }, // Hijau yang lebih cerah
          background: {
            default: '#121212', // Latar belakang gelap
            paper: '#1e1e1e',   // Latar belakang "kertas" yang sedikit lebih terang
          },
        }),
  },
  typography: {
    fontFamily: ['Poppins', 'sans-serif'].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', borderRadius: '8px' },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-input': { fontFamily: 'Poppins, sans-serif' },
        },
      },
    },
  },
});