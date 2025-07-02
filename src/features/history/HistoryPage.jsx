// src/features/history/HistoryPage.jsx

import React, { useState } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import { useHistoryData } from './hooks/useHistoryData';
import HistoryMap from './components/HistoryMap';
import SummaryPanel from './components/SummaryPanel';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  CircularProgress,
  Button,
  Box,
  Typography,
  Alert,
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
    <div className="p-5 bg-gray-50 min-h-[calc(100vh-70px)]">
      <Typography variant="h4" className="text-3xl font-bold text-gray-800 mb-4">
        Riwayat Perjalanan
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        className="mb-5 p-5 bg-white rounded-xl shadow-md flex flex-col sm:flex-row flex-wrap items-end gap-4"
      >
        <div className="w-full sm:w-auto sm:min-w-[200px]">
          <FormControl fullWidth variant="outlined" size="small">
            <InputLabel>Pilih Karyawan</InputLabel>
            <Select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
              label="Pilih Karyawan"
              disabled={loadingEmployees}
            >
              <MenuItem value="">
                {loadingEmployees && <CircularProgress size={20} className="mr-2" />}
                {loadingEmployees ? 'Memuat...' : '-- Pilih Mandor --'}
              </MenuItem>
              {employees.map(emp => (
                <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="w-full sm:w-auto sm:min-w-[160px]">
          <TextField
            fullWidth
            label="Pilih Tanggal"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            size="small"
          />
        </div>
        <Button
          type="submit"
          variant="contained"
          disabled={loadingHistory || loadingEmployees}
          className="w-full sm:w-auto bg-green-700 hover:bg-green-800"
          style={{ textTransform: 'none', padding: '8px 16px' }}
        >
          {loadingHistory ? 'Mencari...' : 'Tampilkan Riwayat'}
        </Button>
      </Box>
      
      <hr className="my-8 border-gray-200" />

      {/* --- [PERBAIKAN DI SINI] --- */}
      {/* Logika render diubah agar lebih sederhana dan andal */}
      <div id="history-results" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[500px] bg-white rounded-xl shadow-lg overflow-hidden flex items-center justify-center">
          {loadingHistory ? (
            <CircularProgress />
          ) : (
            <HistoryMap logs={logs} geofence={geofence} />
          )}
        </div>
        <div className="lg:col-span-1">
          <SummaryPanel summary={summary} loading={loadingHistory} error={error} />
        </div>
      </div>
      
      {error && (
        <div className="p-5 mt-4">
           <Alert severity="error">Gagal memuat data. Silakan coba lagi.</Alert>
        </div>
      )}
    </div>
  );
}

export default HistoryPage;