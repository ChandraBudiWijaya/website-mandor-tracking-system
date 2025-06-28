import React, { useState, useMemo } from 'react'; // Impor useMemo untuk optimasi
import { useGeofences } from '../../hooks/useGeofences';
import GeofenceDetailModal from './components/GeofenceDetailModal';
import { db } from '../../api/firebaseConfig';
import { doc, setDoc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore';

function GeofenceManagementPage() {
    const { geofences, loading, setGeofences } = useGeofences();
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [modalMode, setModalMode] = useState(null); 
    const [selectedGeofence, setSelectedGeofence] = useState(null);

    // --- 1. TAMBAHKAN STATE UNTUK SEARCH BAR ---
    const [searchQuery, setSearchQuery] = useState('');

    const handleOpenModal = (mode, geofence = null) => {
        setModalMode(mode);
        setSelectedGeofence(geofence);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalMode(null);
        setSelectedGeofence(null);
    };

    const handleSaveGeofence = async (geofenceData) => {
        const { id, ...data } = geofenceData;
        if (!id) return alert("ID Area tidak boleh kosong!");

        try {
            const geofenceRef = doc(db, "geofences", id);

            if (modalMode === 'edit') {
                await updateDoc(geofenceRef, data);
                setGeofences(prev => prev.map(g => g.id === id ? { id, ...data } : g));
                alert("Area berhasil diupdate!");
            } else if (modalMode === 'add') {
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
    
    // --- 3. BUAT LOGIKA FILTER ---
    // Gunakan useMemo agar filter tidak berjalan di setiap render, hanya saat geofences atau searchQuery berubah.
    const filteredGeofences = useMemo(() => {
        if (!searchQuery) {
            return geofences; // Jika search bar kosong, kembalikan semua data
        }
        return geofences.filter(geo => 
            geo.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            geo.id.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [geofences, searchQuery]);


    // Styles
    const tableHeaderStyle = { background: '#f2f2f2', padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' };
    const tableCellStyle = { padding: '12px', borderBottom: '1px solid #ddd', verticalAlign: 'middle' };
    const buttonStyle = { marginRight: '5px', padding: '5px 10px', cursor: 'pointer', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' };
    const viewButtonStyle = { ...buttonStyle, background: '#e0e0e0'};
    const editButtonStyle = { ...buttonStyle, background: '#d4edda'};
    const deleteButtonStyle = { ...buttonStyle, background: '#f8d7da', color: '#721c24'};
    const searchInputStyle = { padding: '10px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '4px', width: '300px' };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Manajemen Area Kerja (Geofence)</h1>
            <p>Di halaman ini Anda bisa menambah, melihat, mengubah, dan menghapus data area kerja.</p>
            
            {/* --- 2. TAMBAHKAN UI UNTUK KONTROL ATAS TABEL --- */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama atau ID..."
                    style={searchInputStyle}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button onClick={() => handleOpenModal('add')} style={{padding: '10px 15px', cursor: 'pointer', fontSize: '16px'}}>+ Tambah Area Baru</button>
            </div>

            <GeofenceDetailModal 
                isOpen={isModalOpen}
                mode={modalMode}
                onClose={handleCloseModal}
                onSave={handleSaveGeofence}
                initialData={selectedGeofence}
            />
            
            {loading ? <p>Memuat data area...</p> : (
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
                        {/* --- 4. RENDER HASIL FILTER --- */}
                        {filteredGeofences.length > 0 ? (
                            filteredGeofences.map(geo => (
                                <tr key={geo.id}>
                                    <td style={tableCellStyle}>{geo.id}</td>
                                    <td style={tableCellStyle}>{geo.name}</td>
                                    <td style={tableCellStyle}>{geo.assignedTo}</td>
                                    <td style={tableCellStyle}>{geo.coordinates ? geo.coordinates.length : 0} Titik</td>
                                    <td style={tableCellStyle}>
                                        <button onClick={() => handleOpenModal('view', geo)} style={viewButtonStyle}>Lihat</button>
                                        <button onClick={() => handleOpenModal('edit', geo)} style={editButtonStyle}>Edit</button>
                                        <button onClick={() => handleDeleteGeofence(geo.id)} style={deleteButtonStyle}>Hapus</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{...tableCellStyle, textAlign: 'center', fontStyle: 'italic', color: '#777'}}>
                                    Tidak ada data yang cocok dengan pencarian Anda.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default GeofenceManagementPage;