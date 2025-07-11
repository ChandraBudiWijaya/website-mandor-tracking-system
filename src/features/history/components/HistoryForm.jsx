// src/features/history/components/HistoryForm.jsx

import React from 'react';
import {
  Autocomplete,
  TextField,
  Button,
  CircularProgress,
  Alert
} from '@mui/material';

const HistoryForm = ({
  selectedEmployee,
  setSelectedEmployee,
  selectedDate,
  setSelectedDate,
  employees,
  loadingEmployees,
  loadingHistory,
  pageError,
  setPageError,
  onSubmit
}) => {
  
  const handleSubmit = (e) => {
    e.preventDefault();
    setPageError('');
    
    if (!selectedEmployee || !selectedDate) {
      setPageError('Silakan pilih karyawan dan tanggal terlebih dahulu.');
      return;
    }
    
    onSubmit(selectedEmployee, selectedDate);
  };

  const formatDateIndonesian = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="mb-6">
      {/* Alert Error */}
      {pageError && (
        <div className="mb-4">
          <Alert 
            severity="warning" 
            onClose={() => setPageError('')}
            className="shadow-sm"
          >
            {pageError}
          </Alert>
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">

        {/* Grid Layout untuk Form - 3 Kolom dengan proporsi yang seimbang */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          {/* Input Karyawan - 5 kolom */}
          <div className="md:col-span-5 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pilih Karyawan
            </label>
            <div className="h-14"> {/* Fixed height container */}
              <Autocomplete
                options={employees}
                getOptionLabel={(option) => option.name}
                value={employees.find(emp => emp.id === selectedEmployee) || null}
                onChange={(event, newValue) => {
                  setSelectedEmployee(newValue ? newValue.id : '');
                }}
                disabled={loadingEmployees}
                loading={loadingEmployees}
                size="medium"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Ketik nama karyawan..."
                    variant="outlined"
                    size="medium"
                    className="w-full h-full"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        height: '56px',
                        display: 'flex',
                        alignItems: 'center',
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '16.5px 14px',
                        height: 'auto',
                      }
                    }}
                    InputProps={{
                      ...params.InputProps,
                      className: "dark:text-gray-200",
                      endAdornment: (
                        <>
                          {loadingEmployees ? <CircularProgress color="inherit" size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
                renderOption={(props, option) => {
                  const { key, ...otherProps } = props;
                  return (
                    <li key={key} {...otherProps} className="flex items-center gap-3 p-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {option.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-grow">
                        <div className="font-medium text-gray-900 dark:text-gray-100">{option.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {option.position || 'Staff'} • ID: {option.id}
                        </div>
                      </div>
                    </li>
                  );
                }}
                noOptionsText={loadingEmployees ? "Memuat karyawan..." : "Tidak ada karyawan ditemukan"}
              />
            </div>
          </div>

          {/* Input Tanggal - 4 kolom */}
          <div className="md:col-span-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Pilih Tanggal
            </label>
            <div className="h-14"> {/* Fixed height container */}
              <TextField
                fullWidth
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                variant="outlined"
                size="medium"
                inputProps={{
                  max: new Date().toISOString().split('T')[0],
                  min: "2024-01-01"
                }}
                className="w-full h-full"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    height: '56px',
                    display: 'flex',
                    alignItems: 'center',
                  },
                  '& .MuiOutlinedInput-input': {
                    padding: '16.5px 14px',
                    height: 'auto',
                  }
                }}
                InputProps={{
                  className: "dark:text-gray-200"
                }}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {selectedDate ? formatDateIndonesian(selectedDate) : "Pilih tanggal untuk melihat riwayat"}
            </div>
          </div>

          {/* Tombol Submit - 3 kolom */}
          <div className="md:col-span-3 space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 opacity-0 mb-2">
              Action
            </label>
            <div className="h-14"> {/* Fixed height container */}
              <Button
                type="submit"
                variant="contained"
                disabled={loadingHistory || loadingEmployees || !selectedEmployee || !selectedDate}
                size="large"
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 dark:bg-green-700 dark:hover:bg-green-800 px-6 py-3 text-white font-medium rounded-lg shadow-md transition-all duration-200 w-full h-full"
                startIcon={loadingHistory ? <CircularProgress size={16} color="inherit" /> : null}
                sx={{
                  height: '56px',
                  minHeight: '56px',
                }}
              >
                {loadingHistory ? 'Mencari...' : 'Tampilkan Riwayat'}
              </Button>
            </div>
          </div>
        </div>

        {/* Status Info */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Total karyawan: {employees.length}</span>
            </div>
            {selectedEmployee && selectedDate && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Siap untuk menampilkan riwayat</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default HistoryForm;
