import React, { useState, useEffect } from 'react'; // Tambahkan useEffect
// 1. Impor komponen Material-UI yang dibutuhkan
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Divider
} from '@mui/material';

const EmployeeFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const isEditMode = Boolean(initialData);

  // State lokal untuk form input
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');

  // 2. Gunakan useEffect untuk mengisi form saat modal dibuka dalam mode edit
  useEffect(() => {
    if (isOpen && initialData) {
      setId(initialData.id || '');
      setName(initialData.name || '');
      setPosition(initialData.position || '');
      setPhone(initialData.phone || '');
    } else if (isOpen && !initialData) {
      // Reset form saat modal dibuka dalam mode tambah
      setId('');
      setName('');
      setPosition('');
      setPhone('');
    }
  }, [isOpen, initialData]);


  const handleSubmit = (e) => {
    e.preventDefault();
    // Gunakan state lokal daripada FormData
    const employeeData = { name, position, phone };
    const employeeId = isEditMode ? initialData.id : id; // ID dari state lokal jika mode tambah

    // Validasi dasar
    if (!employeeId || !name || !position || !phone) {
        alert("Semua field wajib diisi!");
        return;
    }

    onSave(employeeId, employeeData);
  };

  return (
    // Mengganti div overlay dan modal content dengan Dialog MUI
    <Dialog
      open={isOpen}
      onClose={onClose} // Menutup modal saat klik di luar
      maxWidth="sm" // Lebar modal medium
      fullWidth // Mengambil lebar penuh maxWidth
      PaperProps={{ // Properti untuk komponen Paper di dalam Dialog
        sx: {
          borderRadius: '12px', // Sudut membulat
          boxShadow: '0 8px 25px rgba(0,0,0,0.2)', // Bayangan lebih menonjol
        }
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1, color: 'primary.main', fontWeight: 600 }}>
        {isEditMode ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
      </DialogTitle>
      <Divider sx={{ mb: 2 }} /> {/* Garis pemisah di bawah judul */}

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}> {/* mt untuk margin top */}
          <TextField
            margin="normal"
            fullWidth
            label="ID Karyawan"
            name="id"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={isEditMode} // Disable saat mode edit
            required
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Nama Lengkap"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Posisi / Jabatan"
            name="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Nomor Telepon"
            name="phone"
            type="tel" // Menggunakan type="tel" untuk nomor telepon
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            variant="outlined"
            size="small"
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}> {/* Padding untuk actions, pt:0 agar tidak ada padding atas */}
        <Button onClick={onClose} variant="outlined"  sx={{ borderRadius: '8px' }}>
          Batal
        </Button>
        <Button type="submit" onClick={handleSubmit} variant="contained" sx={{ backgroundColor: 'primary.main', borderRadius: '8px' }}>
          Simpan
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EmployeeFormModal;