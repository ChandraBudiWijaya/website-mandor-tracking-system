// src/features/management/components/EmployeeFormModal.jsx

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  CircularProgress
} from '@mui/material';

const EmployeeFormModal = ({ isOpen, onClose, onSave, initialData, isSaving }) => {
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
        // Paper akan otomatis di-styling oleh tema MUI
        className: "w-full max-w-md m-4"
      }}
    >
      <form onSubmit={handleSubmit}>
        {/* Header Modal */}
        <div className="text-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEditMode ? 'Edit Data Karyawan' : 'Tambah Karyawan Baru'}
          </h2>
        </div>

        {/* Konten Form */}
        <DialogContent className="p-6 space-y-4">
          <TextField
            label="ID Karyawan"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={isEditMode}
            required
            fullWidth
          />
          <TextField
            label="Nama Lengkap"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Posisi / Jabatan"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Nomor Telepon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            fullWidth
            type="tel"
          />
        </DialogContent>

        {/* Footer dengan Tombol Aksi */}
        <div className="flex justify-end items-center gap-2 p-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <Button onClick={onClose} variant="outlined" disabled={isSaving}>
            Batal
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSaving}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Simpan'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};

export default EmployeeFormModal;