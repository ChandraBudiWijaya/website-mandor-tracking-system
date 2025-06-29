// src/features/management/EmployeeManagementPage.jsx

import React, { useState, useMemo } from 'react';
import { useEmployees } from '../../hooks/useEmployees';
import EmployeeFormModal from './components/EmployeeFormModal';
import { db } from '../../api/firebaseConfig';
import { doc, deleteDoc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Komponen MUI yang masih kita gunakan untuk fungsionalitas
import {
  Button,
  CircularProgress,
  Alert,
  IconButton,
  TextField,
} from '@mui/material';

// Ikon
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

function EmployeeManagementPage() {
  const { employees, loading, setEmployees } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [pageError, setPageError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return employees;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return employees.filter(emp =>
      emp.id.toLowerCase().includes(lowerCaseSearchTerm) ||
      emp.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      emp.position.toLowerCase().includes(lowerCaseSearchTerm) ||
      emp.phone.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [employees, searchTerm]);

  const handleOpenAddModal = () => {
    setEditingEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (employee) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleSaveEmployee = async (employeeId, employeeData) => {
    setPageError('');
    setSuccessMessage('');
    const now = new Date();
    const timestamp = now.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });

    if (editingEmployee) {
      try {
        const employeeRef = doc(db, "employees", editingEmployee.id);
        await updateDoc(employeeRef, employeeData);
        setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? { id: editingEmployee.id, ...employeeData } : emp));
        setSuccessMessage(`Data karyawan "${employeeData.name}" berhasil diupdate pada ${timestamp}`);
        handleCloseModal();
      } catch (e) {
        console.error("Error updating document: ", e);
        setPageError("Gagal mengupdate karyawan! " + e.message);
      }
    } else {
      try {
        const employeeRef = doc(db, "employees", employeeId);
        const docSnap = await getDoc(employeeRef);
        if (docSnap.exists()) {
          setPageError(`Error: Karyawan dengan ID "${employeeId}" sudah ada!`);
          return;
        }
        await setDoc(employeeRef, employeeData);
        setEmployees(prev => [...prev, { id: employeeId, ...employeeData }].sort((a,b) => a.id.localeCompare(b.id)));
        setSuccessMessage(`Karyawan baru "${employeeData.name}" berhasil ditambahkan pada ${timestamp}`);
        handleCloseModal();
      } catch (e) {
        console.error("Error adding document: ", e);
        setPageError("Gagal menambahkan karyawan! " + e.message);
      }
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus karyawan dengan ID: ${employeeId}?`)) {
      setPageError('');
      setSuccessMessage('');
      try {
        await deleteDoc(doc(db, "employees", employeeId));
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        const timestamp = new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
        setSuccessMessage(`Karyawan dengan ID "${employeeId}" berhasil dihapus pada ${timestamp}`);
      } catch (e) {
        console.error("Error deleting document: ", e);
        setPageError("Gagal menghapus karyawan! " + e.message);
      }
    }
  };

  return (
    <div className="p-5 bg-gray-50 min-h-[calc(100vh-70px)]">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        Manajemen Karyawan
      </h1>
      <p className="mb-6 text-gray-600">
        Di halaman ini Anda bisa menambah, mengubah, dan menghapus data karyawan.
      </p>

      {/* Kontrol di atas tabel */}
      <div className="mb-5 flex flex-col sm:flex-row justify-between items-center gap-4">
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          className="w-full sm:w-auto bg-green-700 hover:bg-green-800"
          style={{ textTransform: 'none', padding: '8px 16px', borderRadius: '8px' }}
        >
          Tambah Karyawan Baru
        </Button>
        <div className="w-full sm:w-auto">
          <TextField
            variant="outlined"
            size="small"
            placeholder="Cari karyawan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              ),
            }}
            className="w-full sm:w-64 md:w-72"
          />
        </div>
      </div>

      {successMessage && (
        <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>
          {successMessage}
        </Alert>
      )}
      {pageError && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setPageError('')}>
          {pageError}
        </Alert>
      )}

      {loading && (
        <div className="flex justify-center items-center h-48">
          <CircularProgress />
          <p className="ml-3 text-lg text-gray-600">Memuat data karyawan...</p>
        </div>
      )}

      {/* Tabel Karyawan dengan Tailwind */}
      {!loading && (
        <div className="shadow-lg rounded-xl overflow-hidden bg-white">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Karyawan</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posisi</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telepon</th>
                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map(emp => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{emp.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <IconButton
                        aria-label="edit"
                        size="small"
                        onClick={() => handleOpenEditModal(emp)}
                        sx={{ color: 'primary.main', mr: 1 }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        size="small"
                        onClick={() => handleDeleteEmployee(emp.id)}
                        sx={{ color: 'error.main' }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                    {searchTerm ? 'Tidak ada karyawan ditemukan.' : 'Tidak ada data karyawan.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />
    </div>
  );
}

export default EmployeeManagementPage;