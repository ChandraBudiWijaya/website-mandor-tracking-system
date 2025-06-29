// src/features/management/components/EmployeeFormModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  TextField,
  Button,
} from '@mui/material';

const EmployeeFormModal = ({ isOpen, onClose, onSave, initialData }) => {
  const isEditMode = Boolean(initialData);

  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setId(initialData.id || '');
        setName(initialData.name || '');
        setPosition(initialData.position || '');
        setPhone(initialData.phone || '');
      } else {
        setId('');
        setName('');
        setPosition('');
        setPhone('');
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!id || !name || !position || !phone) {
      alert("Semua field wajib diisi!");
      return;
    }
    const employeeId = isEditMode ? initialData.id : id;
    const employeeData = { name, position, phone };
    onSave(employeeId, employeeData);
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        // Menggunakan className untuk styling utama modal
        className: "rounded-xl shadow-xl w-full max-w-md m-4"
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Header Modal */}
        <div className="text-center p-5 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEditMode ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
          </h2>
        </div>

        {/* Konten Form */}
        <div className="p-6 space-y-4">
          <TextField
            label="ID Karyawan"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={isEditMode}
            required
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Posisi / Jabatan"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            fullWidth
            variant="outlined"
            size="small"
          />
          <TextField
            label="Nomor Telepon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            fullWidth
            variant="outlined"
            size="small"
            type="tel"
          />
        </div>

        {/* Footer dengan Tombol Aksi */}
        <div className="flex justify-end items-center gap-2 p-4 bg-gray-50 border-t border-gray-200">
          <Button
            onClick={onClose}
            variant="text"
            className="text-gray-600 hover:bg-gray-200"
            style={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="bg-blue-600 hover:bg-blue-700 shadow-sm"
            style={{ textTransform: 'none', borderRadius: '8px' }}
          >
            Simpan
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default EmployeeFormModal;