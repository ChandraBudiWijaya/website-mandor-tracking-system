// src/features/management/GeofenceManagementPage.jsx

import React, { useState, useMemo } from 'react';
import { useGeofences } from '../../hooks/useGeofences';
import GeofenceFormModal from './components/GeofenceFormModal';
import { db } from '../../api/firebaseConfig';
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

// Import komponen MUI
import {
  Button,
  IconButton,
  Alert,
  Box,
  CircularProgress,
  TextField,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

function GeofenceManagementPage() {
    const { geofences, loading, setGeofences } = useGeofences();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGeofence, setEditingGeofence] = useState(null);
    const [pageError, setPageError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGeofences = useMemo(() => {
        if (!searchTerm) {
            return geofences;
        }
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        return geofences.filter(geo =>
            geo.id.toLowerCase().includes(lowerCaseSearchTerm) ||
            geo.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            (geo.assignedTo && geo.assignedTo.toLowerCase().includes(lowerCaseSearchTerm))
        );
    }, [geofences, searchTerm]);

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
        setIsSaving(true);

        if (!id) {
            setPageError("ID Area tidak boleh kosong!");
            setIsSaving(false);
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
                    setIsSaving(false);
                    return;
                }
                await setDoc(geofenceRef, data);
                setGeofences(prev => [...prev, { id, ...data }].sort((a,b) => a.name.localeCompare(b.name)));
                setSuccessMessage(`Area kerja baru "${data.name}" berhasil ditambahkan.`);
            }
            handleCloseModal();
        } catch (e) {
            setPageError("Gagal menyimpan area kerja! " + e.message);
        } finally {
            setIsSaving(false);
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
                setPageError("Gagal menghapus area kerja! " + e.message);
            }
        }
    };
    
    return (
        <div className="p-5 bg-gray-100 dark:bg-gray-900 min-h-[calc(100vh-70px)] transition-colors duration-300">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                Manajemen Area Kerja (Geofence)
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
                Di halaman ini Anda bisa menambah, mengubah, dan menghapus data area kerja.
            </p>
            
            <div className="mb-5 flex flex-col sm:flex-row justify-between items-center gap-4">
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenAddModal}
                    className="w-full sm:w-auto bg-green-700 hover:bg-green-800"
                >
                    Tambah Area Baru
                </Button>
                <div className="w-full sm:w-auto">
                  <TextField
                    placeholder="Cari area kerja..."
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

            {successMessage && <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert>}
            {pageError && <Alert severity="error" sx={{ mb: 3 }} onClose={() => setPageError('')}>{pageError}</Alert>}

            <GeofenceFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveGeofence}
                initialData={editingGeofence}
                isSaving={isSaving}
            />
            
            {loading ? (
                <Box className="flex justify-center items-center h-64">
                    <CircularProgress />
                    <p className="ml-4 text-gray-600 dark:text-gray-400">Memuat data area kerja...</p>
                </Box>
            ) : (
                <div className="shadow-lg rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">  
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID Area</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Nama Area</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ditugaskan ke (ID)</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Jumlah Titik</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredGeofences.map(geo => (
                                <tr key={geo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">{geo.id}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{geo.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{geo.assignedTo}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{geo.coordinates ? geo.coordinates.length : 0} Titik</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                        <IconButton size="small" onClick={() => handleOpenEditModal(geo)} sx={{ color: 'primary.main', mr: 1 }}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={() => handleDeleteGeofence(geo.id)} sx={{ color: 'error.main' }}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default GeofenceManagementPage;