import React, { useState } from 'react';
import { useGeofences } from '../../hooks/useGeofences';
import GeofenceFormModal from './components/GeofenceFormModal';
import { db } from '../../api/firebaseConfig';
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

// Import komponen MUI
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Alert,
  Box, // Impor Box untuk layouting
  CircularProgress // Impor CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

function GeofenceManagementPage() {
    const { geofences, loading, setGeofences } = useGeofences();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGeofence, setEditingGeofence] = useState(null);
    const [pageError, setPageError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false); // State untuk loading saat menyimpan

    const handleOpenAddModal = () => {
        setEditingGeofence(null);
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (geofence) => {
        setEditingGeofence(geofence);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingGeofence(null);
    };

    const handleSaveGeofence = async (geofenceData) => {
        const { id, ...data } = geofenceData;
        setPageError('');
        setSuccessMessage('');
        setIsSaving(true); // Mulai loading

        if (!id) {
            setPageError("ID Area tidak boleh kosong!");
            setIsSaving(false); // Hentikan loading jika ada error validasi
            return;
        }

        try {
            const geofenceRef = doc(db, "geofences", id);

            if (editingGeofence) {
                await updateDoc(geofenceRef, data);
                setGeofences(prev => prev.map(g => g.id === id ? { id, ...data } : g));
                setSuccessMessage(`Area kerja "${data.name}" berhasil diupdate.`);
            } else {
                const docSnap = await getDoc(geofenceRef);
                if (docSnap.exists()) {
                    setPageError(`Error: Area dengan ID "${id}" sudah ada!`);
                    setIsSaving(false); // Hentikan loading
                    return;
                }
                await setDoc(geofenceRef, data);
                setGeofences(prev => [...prev, { id, ...data }].sort((a,b) => a.name.localeCompare(b.name)));
                setSuccessMessage(`Area kerja baru "${data.name}" berhasil ditambahkan.`);
            }
            handleCloseModal();
        } catch (e) {
            console.error("Error saving geofence: ", e);
            setPageError("Gagal menyimpan area kerja! " + e.message);
        } finally {
            setIsSaving(false); // Selalu hentikan loading di akhir
        }
    };

    const handleDeleteGeofence = async (geofenceId) => {
        if (window.confirm(`Yakin ingin menghapus area kerja dengan ID: ${geofenceId}?`)) {
            setPageError('');
            setSuccessMessage('');
            try {
                await deleteDoc(doc(db, "geofences", geofenceId));
                setGeofences(prev => prev.filter(g => g.id !== geofenceId));
                setSuccessMessage(`Area kerja dengan ID "${geofenceId}" berhasil dihapus.`);
            } catch (e) {
                console.error("Error deleting geofence: ", e);
                setPageError("Gagal menghapus area kerja! " + e.message);
            }
        }
    };
    
    return (
        <div className="p-5 bg-gray-50 min-h-[calc(100vh-70px)]">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Manajemen Area Kerja (Geofence)
            </h1>
            <p className="mb-6 text-gray-600">
                Di halaman ini Anda bisa menambah, mengubah, dan menghapus data area kerja.
            </p>
            
            <div className="mb-5">
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddModal}
                    className="w-full sm:w-auto bg-green-700 hover:bg-green-800"
                    style={{ textTransform: 'none', padding: '8px 16px', borderRadius: '8px' }}
                >
                    Tambah Area Baru
                </Button>
            </div>

            {successMessage && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}
            {pageError && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setPageError('')}>{pageError}</Alert>}

            <GeofenceFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveGeofence}
                initialData={editingGeofence}
                isSaving={isSaving}
            />
            
            {/* --- [PERBAIKAN DI SINI] --- */}
            {loading ? (
                <Box className="flex justify-center items-center h-64">
                    <CircularProgress />
                    <Typography className="ml-4 text-gray-600">Memuat data area kerja...</Typography>
                </Box>
            ) : (
                <TableContainer component={Paper} elevation={4} className="rounded-xl">
                    <Table>
                        <TableHead className="bg-gray-50">  
                            <TableRow>
                                <TableCell className="font-bold text-gray-600">ID Area</TableCell>
                                <TableCell className="font-bold text-gray-600">Nama Area</TableCell>
                                <TableCell className="font-bold text-gray-600">Ditugaskan ke (ID)</TableCell>
                                <TableCell className="font-bold text-gray-600">Jumlah Titik</TableCell>
                                <TableCell className="font-bold text-gray-600 text-center">Aksi</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {geofences.map(geo => (
                                <TableRow key={geo.id} className="hover:bg-gray-50">
                                    <TableCell>{geo.id}</TableCell>
                                    <TableCell>{geo.name}</TableCell>
                                    <TableCell>{geo.assignedTo}</TableCell>
                                    <TableCell>{geo.coordinates ? geo.coordinates.length : 0} Titik</TableCell>
                                    <TableCell className="text-center">
                                        <IconButton size="small" onClick={() => handleOpenEditModal(geo)} sx={{ color: 'primary.main' }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDeleteGeofence(geo.id)} sx={{ color: 'error.main' }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </div>
    );
}

export default GeofenceManagementPage;