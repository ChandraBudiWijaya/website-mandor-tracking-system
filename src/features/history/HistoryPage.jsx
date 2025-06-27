import React, { useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { useHistoryData } from './hooks/useHistoryData';
import HistoryMap from './components/HistoryMap';
import SummaryPanel from './components/SummaryPanel';

import {
  Box,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
  CircularProgress,
} from '@mui/material';

function HistoryPage() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const { employees, loading: loadingEmployees } = useEmployees();

  const { logs, summary, geofence, loading: loadingHistory, error, fetchData } = useHistoryData();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedEmployee || !selectedDate) {
      alert('Silakan pilih karyawan dan tanggal terlebih dahulu.');
      return;
    }
    fetchData(selectedEmployee, selectedDate);
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#F8F9FA', minHeight: 'calc(100vh - 70px)' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
        Riwayat Perjalanan
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: { xs: 2, sm: 2 },
          alignItems: { xs: 'stretch', sm: 'flex-end' },
          justifyContent: 'flex-start',
          flexWrap: 'wrap',
        }}
      >
        <Box sx={{
            width: { xs: '100%', sm: '180px', md: '200px' },
            flexShrink: 0,
        }}>
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel id="employee-select-label">Pilih Karyawan</InputLabel>
            <Select
              labelId="employee-select-label"
              id="employee-select"
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              label="Pilih Karyawan"
              disabled={loadingEmployees}
            >
              <MenuItem value="">
                {loadingEmployees ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
                {loadingEmployees ? 'Memuat Karyawan...' : '-- Pilih Mandor --'}
              </MenuItem>
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box sx={{
            width: { xs: '100%', sm: '150px', md: '160px' },
            flexShrink: 0,
        }}>
          <TextField
            fullWidth
            id="date-picker"
            label="Pilih Tanggal"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            variant="outlined"
            size="small"
          />
        </Box>

        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={loadingHistory || loadingEmployees}
          sx={{
            width: { xs: '100%', sm: 'auto' },
            minWidth: { sm: '120px' },
            py: 0.8,
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            alignSelf: 'flex-end',
          }}
        >
          {loadingHistory ? 'Mencari...' : 'Tampilkan Riwayat'}
        </Button>
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* Bagian Hasil Riwayat (Peta dan Ringkasan) - Maps Dinaikkan */}
      {/* Kita akan tetap menggunakan struktur yang sama karena terbukti menampilkan peta */}
      <Box id="history-results" sx={{ marginTop: '20px' }}>
        {/* Div untuk HistoryMap - Ketinggian disesuaikan */}
        <Box sx={{
            marginBottom: '20px',
            // --- START: KETINGGIAN MAP DIKEMBALIKAN KE NILAI YANG LEBIH WAJAR ---
            height: { xs: '400px', sm: '500px', md: '550px', lg: '500px' }, // Dikurangi 50-100px dari sebelumnya
            // --- END: KETINGGIAN MAP DIKEMBALIKAN KE NILAI YANG LEBIH WAJAR ---
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden',
        }}>
          <HistoryMap logs={logs} geofence={geofence} />
        </Box>
        {/* Div untuk SummaryPanel - Ketinggian disesuaikan agar konsisten */}
        <Box>
          <SummaryPanel summary={summary} loading={loadingHistory} error={error} />
        </Box>
      </Box>
    </Box>
  );
}

export default HistoryPage;