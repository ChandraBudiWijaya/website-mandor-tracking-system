import React, { useState, useMemo } from 'react'; // <-- Tambahkan useMemo
import { useEmployees } from '../../hooks/useEmployees';
import EmployeeFormModal from './components/EmployeeFormModal';
import { db } from '../../api/firebaseConfig';
import { doc, deleteDoc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

// Import komponen Material-UI yang dibutuhkan
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  IconButton,
  TextField, // <-- Tambahkan TextField untuk search bar
} from '@mui/material';

// Import ikon Material-UI untuk aksi
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search'; // <-- Tambahkan ikon Search

function EmployeeManagementPage() {
  const { employees, loading, setEmployees } = useEmployees();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [pageError, setPageError] = useState('');

  const [searchTerm, setSearchTerm] = useState(''); // <-- State baru untuk search term

  // --- Filter Karyawan berdasarkan Search Term ---
  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return employees; // Jika search bar kosong, tampilkan semua karyawan
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return employees.filter(emp =>
      emp.id.toLowerCase().includes(lowerCaseSearchTerm) ||
      emp.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      emp.position.toLowerCase().includes(lowerCaseSearchTerm) ||
      emp.phone.toLowerCase().includes(lowerCaseSearchTerm) // Opsional: mencari di kolom telepon juga
    );
  }, [employees, searchTerm]); // <-- Dependencies useMemo

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
    setPageError('');
  };

  const handleSaveEmployee = async (employeeId, employeeData) => {
    setPageError('');
    if (editingEmployee) {
      try {
        const employeeRef = doc(db, "employees", editingEmployee.id);
        await updateDoc(employeeRef, employeeData);

        setEmployees(prev => prev.map(emp => emp.id === editingEmployee.id ? { id: editingEmployee.id, ...employeeData } : emp));
        console.log("Karyawan berhasil diupdate");
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
        console.log("Karyawan baru berhasil ditambahkan");
      } catch (e) {
        console.error("Error adding document: ", e);
        setPageError("Gagal menambahkan karyawan! " + e.message);
      }
    }
    handleCloseModal();
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus karyawan dengan ID: ${employeeId}?`)) {
      setPageError('');
      try {
        await deleteDoc(doc(db, "employees", employeeId));
        setEmployees(prev => prev.filter(emp => emp.id !== employeeId));
        console.log("Karyawan berhasil dihapus!");
      } catch (e) {
        console.error("Error deleting document: ", e);
        setPageError("Gagal menghapus karyawan! " + e.message);
      }
    }
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#F8F9FA', minHeight: 'calc(100vh - 70px)' }}>
      <Typography variant="h4" sx={{ mb: 3, color: '#333', fontWeight: 600 }}>
        Manajemen Karyawan
      </Typography>
      <Typography variant="body1" sx={{ mb: 4, color: '#555' }}>
        Di halaman ini Anda bisa menambah, mengubah, dan menghapus data karyawan.
      </Typography>

      {/* Kontrol di atas tabel (Tombol Tambah & Search Bar) */}
      <Box sx={{
        marginBottom: '20px',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' }, // Stack vertikal di mobile, horizontal di desktop
        justifyContent: 'space-between', // Pisahkan tombol dan search bar
        alignItems: 'center', // Rata tengah secara vertikal
        gap: { xs: 2, sm: 3 }, // Jarak antar elemen
      }}>
        {/* Tombol Tambah Karyawan Baru */}
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenAddModal}
          sx={{
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
            py: 1,
            px: 2,
            borderRadius: '8px',
            width: { xs: '100%', sm: 'auto' }, // Fullwidth di mobile
          }}
        >
          Tambah Karyawan Baru
        </Button>

        {/* Search Bar */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Cari karyawan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{ // Tambahkan ikon search di sini
            startAdornment: (
              <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
            ),
          }}
          sx={{
            width: { xs: '100%', sm: '250px', md: '300px' }, // Lebar responsif untuk search bar
          }}
        />
      </Box>

      {/* Menampilkan error jika ada */}
      {pageError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {pageError}
        </Alert>
      )}

      {/* Loading Indicator */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <CircularProgress sx={{ color: 'primary.main' }} size={40} />
          <Typography variant="h6" sx={{ ml: 2, color: '#555' }}>Memuat data karyawan...</Typography>
        </Box>
      )}

      {/* Tabel Karyawan */}
      {!loading && (
        <TableContainer component={Paper} elevation={4} sx={{ borderRadius: '12px', overflow: 'hidden' }}>
          <Table sx={{ minWidth: 650 }} aria-label="employee table">
            <TableHead sx={{ backgroundColor: '#F0F2F5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', py: 1.5 }}>ID Karyawan</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', py: 1.5 }}>Nama</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', py: 1.5 }}>Posisi</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', py: 1.5 }}>Telepon</TableCell>
                <TableCell sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', py: 1.5, width: '150px', textAlign: 'center' }}>Aksi</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEmployees.length > 0 ? ( // <-- Gunakan filteredEmployees di sini
                filteredEmployees.map(emp => (
                  <TableRow
                    key={emp.id}
                    sx={{
                      '&:nth-of-type(odd)': { backgroundColor: '#F9F9F9' },
                      '&:hover': { backgroundColor: '#EFEFEF', cursor: 'pointer' },
                      '&:last-child td, &:last-child th': { border: 0 },
                    }}
                  >
                    <TableCell>{emp.id}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.position}</TableCell>
                    <TableCell>{emp.phone}</TableCell>
                    <TableCell sx={{ textAlign: 'center' }}>
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 3, color: '#777' }}>
                    {loading ? 'Memuat data karyawan...' : (searchTerm ? 'Tidak ada karyawan ditemukan.' : 'Tidak ada data karyawan.')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Modal Form */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
      />
    </Box>
  );
}

export default EmployeeManagementPage;