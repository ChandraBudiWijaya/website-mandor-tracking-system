import React, { useState } from 'react';
import { useGeofences } from '../../hooks/useGeofences';
import GeofenceFormModal from './components/GeofenceFormModal';
import { db } from '../../api/firebaseConfig';
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

function GeofenceManagementPage() {
    const { geofences, loading, setGeofences } = useGeofences();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingGeofence, setEditingGeofence] = useState(null);

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
        if (!id) return alert("ID Area tidak boleh kosong!");

        try {
            const geofenceRef = doc(db, "geofences", id);

            if (editingGeofence) {
                // LOGIKA UPDATE
                await updateDoc(geofenceRef, data);
                setGeofences(prev => prev.map(g => g.id === id ? { id, ...data } : g));
                alert("Area berhasil diupdate!");
            } else {
                // LOGIKA ADD
                const docSnap = await getDoc(geofenceRef);
                if (docSnap.exists()) {
                    alert(`Error: Area dengan ID "${id}" sudah ada!`);
                    return;
                }
                await setDoc(geofenceRef, data);
                setGeofences(prev => [...prev, { id, ...data }].sort((a,b) => a.name.localeCompare(b.name)));
                alert("Area baru berhasil ditambahkan!");
            }
            handleCloseModal();
        } catch (e) {
            console.error("Error saving geofence: ", e);
            alert("Gagal menyimpan area!");
        }
    };

    const handleDeleteGeofence = async (geofenceId) => {
        if (window.confirm(`Yakin ingin menghapus area ID: ${geofenceId}?`)) {
            try {
                await deleteDoc(doc(db, "geofences", geofenceId));
                setGeofences(prev => prev.filter(g => g.id !== geofenceId));
                alert("Area berhasil dihapus!");
            } catch (e) {
                console.error("Error deleting geofence: ", e);
                alert("Gagal menghapus area!");
            }
        }
    };
    
    // ... (style tabel tidak berubah)
    const tableHeaderStyle = { background: '#f2f2f2', padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };
    const tableCellStyle = { padding: '12px', borderBottom: '1px solid #ddd' };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Manajemen Area Kerja (Geofence)</h1>
            <p>Di halaman ini Anda bisa menambah, mengubah, dan menghapus data area kerja.</p>
            
            <div style={{ marginBottom: '20px' }}>
                <button onClick={handleOpenAddModal} style={{padding: '10px 15px', cursor: 'pointer'}}>+ Tambah Area Baru</button>
            </div>

            <GeofenceFormModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveGeofence}
                initialData={editingGeofence}
            />
            
            {!loading && (
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                    <thead>  
                        <tr>
                            <th style={tableHeaderStyle}>ID Area</th>
                            <th style={tableHeaderStyle}>Nama Area</th>
                            <th style={tableHeaderStyle}>Ditugaskan ke (ID)</th>
                            <th style={tableHeaderStyle}>Jumlah Titik</th>
                            <th style={tableHeaderStyle}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {geofences.map(geo => (
                            <tr key={geo.id}>
                                <td style={tableCellStyle}>{geo.id}</td>
                                <td style={tableCellStyle}>{geo.name}</td>
                                <td style={tableCellStyle}>{geo.assignedTo}</td>
                                <td style={tableCellStyle}>{geo.coordinates ? geo.coordinates.length : 0} Titik</td>
                                <td style={tableCellStyle}>
                                    <button onClick={() => handleOpenEditModal(geo)} style={{marginRight: '5px'}}>Edit Peta</button>
                                    <button onClick={() => handleDeleteGeofence(geo.id)}>Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default GeofenceManagementPage;