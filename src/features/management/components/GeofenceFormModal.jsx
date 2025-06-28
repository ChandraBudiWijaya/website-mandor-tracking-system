import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, LayersControl, Polygon, Polyline } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useEmployees } from '../../../hooks/useEmployees';
import L from 'leaflet';

// Setup ikon default Leaflet (tidak berubah)
let DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


const GeofenceFormModal = ({ isOpen, onClose, onSave, initialData }) => {
    const featureGroupRef = useRef();
    const isEditMode = Boolean(initialData);
    const [editedCoordinates, setEditedCoordinates] = useState(null);
    const { employees, loading: loadingEmployees } = useEmployees();

    if (!isOpen) return null;

    // --- LOGIKA BARU: Siapkan batas peta SEBELUM render (tidak berubah) ---
    let mapProps = {};
    const initialCoords = initialData?.coordinates;

    if (isEditMode && initialCoords && initialCoords.length > 0) {
        const bounds = initialCoords.map(c => [c.lat, c.lng]);
        mapProps = {
            bounds: bounds,
            boundsOptions: { padding: [50, 50] }
        };
    } else {
        mapProps = {
            center: [-4.5586, 105.4068],
            zoom: 9
        };
    }

    // --- FUNGSI BARU: Untuk memproses satu layer ---
    const processLayer = (layer) => {
        if (!layer) {
            setEditedCoordinates(null);
            return;
        }
        const latlngs = layer.getLatLngs();
        const layerType = layer instanceof L.Polygon ? 'polygon' : 'polyline';
        
        // Poligon memiliki array latlngs bersarang [[]], sedangkan polyline tidak
        const coords = layerType === 'polygon' 
            ? latlngs[0].map(latlng => ({ lat: latlng.lat, lng: latlng.lng }))
            : latlngs.map(latlng => ({ lat: latlng.lat, lng: latlng.lng }));
            
        setEditedCoordinates({ type: layerType, coordinates: coords });
    };

    // --- HANDLER BARU: Untuk event onCreated ---
    const handleCreate = (e) => {
        // e.layer adalah layer yang baru dibuat
        const layer = e.layer;
        processLayer(layer);
    };

    // --- HANDLER BARU: Untuk event onEdited ---
    const handleEdit = (e) => {
        // e.layers berisi semua layer yang diubah
        const layers = e.layers.getLayers();
        if (layers.length > 0) {
            // Ambil layer pertama yang diubah (biasanya hanya satu dalam kasus ini)
            processLayer(layers[0]);
        }
    };
    
    // --- HANDLER BARU: Untuk event onDeleted ---
    const handleDelete = () => {
        setEditedCoordinates(null);
        // Jika dalam mode edit, ini berarti kita ingin menghapus shape yang sudah ada
        if(isEditMode) {
             // Anda bisa set state untuk menandakan shape akan dihapus saat save
             // atau langsung biarkan user menggambar yang baru
             console.log("Shape yang ada dihapus dari peta.");
        }
    };

    // --- Fungsi handleSubmit (tidak berubah) ---
    const handleSubmit = (e) => {
        e.preventDefault();
        const finalCoordinates = editedCoordinates ? editedCoordinates.coordinates : initialData?.coordinates;
        const finalType = editedCoordinates ? editedCoordinates.type : initialData?.type;

        if (!finalCoordinates || finalCoordinates.length < 2) {
            alert("Harap gambar sebuah area di peta.");
            return;
        }
        
        const formData = new FormData(e.target);
        const geofenceData = {
          id: isEditMode ? initialData.id : formData.get('id'),
          name: formData.get('name'),
          assignedTo: formData.get('assignedTo'),
          type: finalType,
          coordinates: finalCoordinates,
        };
        onSave(geofenceData);
    };

    const initialShapePath = isEditMode && initialData?.coordinates 
        ? initialData.coordinates.map(c => [c.lat, c.lng]) : null;

    // Style (tidak berubah)
    const inputStyle = { width: '95%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' };
    const selectStyle = { width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' };
    const disabledInputStyle = { ...inputStyle, background: '#f0f0f0', cursor: 'not-allowed', color: '#777' };
    const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 };
    const modalContentStyle = { background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={{...modalContentStyle, width: '900px', maxWidth: '90vw'}} onClick={(e) => e.stopPropagation()}>
                <h2>{isEditMode ? 'Edit Area Kerja' : 'Tambah Area Kerja Baru'}</h2>
                <hr />
                <form onSubmit={handleSubmit}>
                    <div style={{display: 'flex', gap: '20px'}}>
                        <div style={{ flex: 2, height: '400px', border: '1px solid #ccc' }}>
                            <MapContainer key={initialData?.id || 'new'} {...mapProps} style={{ height: '100%', width: '100%' }}>
                                <LayersControl position="topright">
                                    <LayersControl.BaseLayer checked name="Citra Satelit">
                                        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='© Esri'/>
                                    </LayersControl.BaseLayer>
                                    <LayersControl.BaseLayer name="Street Map">
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='© OpenStreetMap'/>
                                    </LayersControl.BaseLayer>
                                </LayersControl>
                                <FeatureGroup ref={featureGroupRef}>
                                    <EditControl
                                        position="topright"
                                        // Gunakan handler yang sudah dipisah
                                        onCreated={handleCreate}
                                        onEdited={handleEdit}
                                        onDeleted={handleDelete}
                                        draw={{ 
                                            polygon: true, 
                                            polyline: true, 
                                            rectangle: false, 
                                            circle: false, 
                                            circlemarker: false, 
                                            marker: false 
                                        }}
                                        edit={{
                                            // Penting: beritahu leaflet-draw featureGroup mana yang harus diedit
                                            featureGroup: featureGroupRef.current,
                                        }}
                                    />
                                    {/* Menampilkan shape yang sudah ada sebagai referensi */}
                                    {initialData?.type === 'polygon' && initialShapePath && <Polygon positions={initialShapePath} pathOptions={{ color: 'gray', dashArray: '5, 5' }} />}
                                    {initialData?.type === 'polyline' && initialShapePath && <Polyline positions={initialShapePath} pathOptions={{ color: 'gray', dashArray: '5, 5' }} />}
                                </FeatureGroup>
                            </MapContainer>
                        </div>
                        {/* Kolom Form */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                           <p>Gambar atau edit area di peta, lalu isi detail di bawah ini.</p>
                           <div>
                                <label>ID Area</label>
                                <input name="id" type="text" style={isEditMode ? disabledInputStyle : inputStyle} required readOnly={isEditMode} defaultValue={initialData?.id || ''} />
                            </div>
                            <div>
                                <label>Nama Area</label>
                                <input name="name" type="text" style={inputStyle} required defaultValue={initialData?.name || ''}/>
                            </div>
                            <div>
                                <label>Tugaskan ke Karyawan</label>
                                <select name="assignedTo" style={selectStyle} required defaultValue={initialData?.assignedTo || ''}>
                                    <option value="">{loadingEmployees ? 'Memuat...' : '-- Pilih Mandor --'}</option>
                                    {employees.map(emp => (
                                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div style={{marginTop: 'auto', textAlign:'right'}}>
                                <button type="button" onClick={onClose}>Batal</button>
                                <button type="submit" style={{marginLeft: '10px'}}>Simpan Perubahan</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GeofenceFormModal;