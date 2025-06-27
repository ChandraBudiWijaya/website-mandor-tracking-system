import React, { useState, useMemo } from 'react'; // Tambahkan useState dan useMemo
import { List, ListItem, ListItemButton, ListItemText, Typography, Box, TextField } from '@mui/material'; // Tambahkan TextField

const EmployeeList = ({ locations, onEmployeeSelect, selectedEmployeeId }) => {
  const [searchTerm, setSearchTerm] = useState(''); // State baru untuk menyimpan query pencarian

  // Gunakan useMemo untuk memfilter daftar karyawan
  // Ini akan mencegah proses filtering berjalan di setiap render
  // hanya akan berjalan ketika 'locations' atau 'searchTerm' berubah
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return Object.values(locations); // Jika search bar kosong, tampilkan semua karyawan
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return Object.values(locations).filter(loc =>
      loc.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      loc.position.toLowerCase().includes(lowerCaseSearchTerm) ||
      loc.id.toLowerCase().includes(lowerCaseSearchTerm) // Opsional: cari berdasarkan ID juga
    );
  }, [locations, searchTerm]);

  return (
    <Box>
      {/* Search Bar */}
      <TextField
        fullWidth
        label="Cari Karyawan..."
        variant="outlined"
        size="small" // Ukuran kecil agar tidak terlalu besar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }} // Margin bawah untuk memisahkan dari daftar
      />

      <List disablePadding>
        {filteredEmployees.length > 0 ? ( // Gunakan filteredEmployees di sini
          filteredEmployees.map(loc => {
            const isSelected = loc.id === selectedEmployeeId;

            return (
              <ListItem
                key={loc.id}
                disablePadding
                sx={{
                  backgroundColor: isSelected ? 'primary.light' : '#FFFFFF',
                  color: isSelected ? 'primary.contrastText' : 'inherit',
                  borderRadius: '6px',
                  mb: 1,
                  boxShadow: isSelected ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                  transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border 0.3s ease',
                  border: isSelected ? '1px solid' : '1px solid #E0E0E0',
                  borderColor: isSelected ? 'primary.main' : '#E0E0E0',
                }}
              >
                <ListItemButton
                  onClick={() => onEmployeeSelect(loc.id)}
                  sx={{
                    py: 1.5,
                    px: 2,
                    borderRadius: '6px',
                    '&:hover': {
                      backgroundColor: isSelected ? 'primary.main' : '#F5F5F5',
                      color: isSelected ? 'white' : '#333',
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {loc.name} <Typography component="span" variant="body2" sx={{ color: isSelected ? 'white' : '#777' }}>({loc.position})</Typography>
                      </Typography>
                    }
                    secondary={
                      <Typography variant="caption" sx={{ color: isSelected ? 'white' : '#999' }}>
                        Update: {loc.lastUpdate && loc.lastUpdate.toDate ? loc.lastUpdate.toDate().toLocaleTimeString('id-ID') : 'N/A'}
                      </Typography>
                    }
                    sx={{ color: isSelected ? 'white' : 'inherit' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          // Pesan jika tidak ada karyawan yang ditemukan setelah filter
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#777', mt: 2 }}>
            {searchTerm ? "Tidak ada karyawan ditemukan." : "Tidak ada data karyawan yang tersedia."}
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default EmployeeList;