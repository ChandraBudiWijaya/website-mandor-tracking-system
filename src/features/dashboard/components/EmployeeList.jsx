import React, { useState, useMemo } from 'react';
import { List, ListItem, ListItemButton, ListItemText, Typography, Box, TextField } from '@mui/material';

const EmployeeList = ({ locations, onEmployeeSelect, selectedEmployeeId }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return Object.values(locations);
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return Object.values(locations).filter(loc =>
      loc.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      loc.position.toLowerCase().includes(lowerCaseSearchTerm) ||
      loc.id.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [locations, searchTerm]);

  return (
    <Box>
      <TextField
        fullWidth
        label="Cari Karyawan..."
        variant="outlined"
        size="small"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2 }}
      />

      <List disablePadding>
        {filteredEmployees.length > 0 ? (
          filteredEmployees.map(loc => {
            const isSelected = loc.id === selectedEmployeeId;

            // Memastikan loc.lastUpdate ada dan memiliki method toDate()
            const lastUpdateDateTime = loc.lastUpdate && loc.lastUpdate.toDate ? loc.lastUpdate.toDate() : null;

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
                        Update: {lastUpdateDateTime ? lastUpdateDateTime.toLocaleDateString('id-ID', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric',
                                }) + ' ' + lastUpdateDateTime.toLocaleTimeString('id-ID') : 'N/A'}
                      </Typography>
                    }
                    sx={{ color: isSelected ? 'white' : 'inherit' }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })
        ) : (
          <Typography variant="body2" sx={{ textAlign: 'center', color: '#777', mt: 2 }}>
            {searchTerm ? "Tidak ada karyawan ditemukan." : "Tidak ada data karyawan yang tersedia."}
          </Typography>
        )}
      </List>
    </Box>
  );
};

export default EmployeeList;