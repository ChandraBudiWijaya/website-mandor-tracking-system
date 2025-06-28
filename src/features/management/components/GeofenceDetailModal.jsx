import React, { useState, useEffect, useRef } from 'react'; // Impor kembali useRef
import { MapContainer, TileLayer, FeatureGroup, LayersControl } from 'react-leaflet'; // Hapus Polygon, Polyline dari sini
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useEmployees } from '../../../hooks/useEmployees';
import L from 'leaflet';

// Setup ikon default Leaflet
let DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const GeofenceDetailModal = ({ isOpen, mode, onClose, onSave, initialData }) => {
    const [editedCoordinates, setEditedCoordinates] = useState(null);
    const { employees, loading: loadingEmployees } = useEmployees();
    const featureGroupRef = useRef(); // Tambahkan ref untuk FeatureGroup

    useEffect(() => {
        if (isOpen) {
            setEditedCoordinates(null);
        }
    }, [isOpen, initialData]);

    // --- LOGIKA BARU: Efek untuk menambahkan shape awal ke peta ---
    useEffect(() => {
        // Jangan lakukan apa-apa jika modal tidak terbuka atau ref belum siap
        if (!isOpen || !featureGroupRef.current) return;

        const fg = featureGroupRef.current;
        // Selalu bersihkan layer sebelumnya saat modal dibuka/data berubah
        fg.clearLayers();

        // Jika mode lihat atau edit dan ada data, gambar shape-nya
        if ((mode === 'view' || mode === 'edit') && initialData?.coordinates?.length > 0) {
            let layer;
            const path = initialData.coordinates.map(c => [c.lat, c.lng]);
            const color = mode === 'view' ? 'blue' : 'green'; // Biru untuk lihat, Hijau untuk edit

            if (initialData.type === 'polygon') {
                layer = L.polygon(path, { color });
            } else if (initialData.type === 'polyline') {
                layer = L.polyline(path, { color });
            }

            if (layer) {
                fg.addLayer(layer);
            }
        }
    }, [isOpen, mode, initialData]);


    if (!isOpen) return null;

    const isViewMode = mode === 'view';
    const isEditMode = mode === 'edit';
    const isAddMode = mode === 'add';

    let mapProps = {};
    const initialCoords = initialData?.coordinates;
    if ((isEditMode || isViewMode) && initialCoords && initialCoords.length > 0) {
        const bounds = initialCoords.map(c => [c.lat, c.lng]);
        mapProps = { bounds, boundsOptions: { padding: [50, 50] } };
    } else {
        mapProps = { center: [-4.5586, 105.4068], zoom: 9 };
    }

    const processLayer = (layer) => {
        if (!layer) return;
        const latlngs = layer.getLatLngs();
        const layerType = layer instanceof L.Polygon ? 'polygon' : 'polyline';
        const coords = layerType === 'polygon'
            ? latlngs[0].map(latlng => ({ lat: latlng.lat, lng: latlng.lng }))
            : latlngs.map(latlng => ({ lat: latlng.lat, lng: latlng.lng }));
        setEditedCoordinates({ type: layerType, coordinates: coords });
    };

    const handleCreate = (e) => processLayer(e.layer);
    const handleEdit = (e) => processLayer(e.layers.getLayers()[0]);
    const handleDelete = () => setEditedCoordinates(null);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (isViewMode) return;
        const finalCoordinates = editedCoordinates ? editedCoordinates.coordinates : initialData?.coordinates;
        const finalType = editedCoordinates ? editedCoordinates.type : initialData?.type;

        if (!finalCoordinates || finalCoordinates.length < 2) {
            alert("Harap gambar sebuah area di peta.");
            return;
        }
        
        const formData = new FormData(e.target);
        const geofenceData = {
          id: isAddMode ? formData.get('id') : initialData.id,
          name: formData.get('name'),
          assignedTo: formData.get('assignedTo'),
          type: finalType,
          coordinates: finalCoordinates,
        };
        onSave(geofenceData);
    };
    
    const getModalTitle = () => {
        if (isViewMode) return 'Lihat Detail Area Kerja';
        if (isEditMode) return 'Edit Area Kerja';
        return 'Tambah Area Kerja Baru';
    };

    const inputStyle = { width: '95%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' };
    const selectStyle = { width: '100%', padding: '8px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' };
    const disabledInputStyle = { ...inputStyle, background: '#f0f0f0', cursor: 'not-allowed', color: '#777' };
    const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1050 };
    const modalContentStyle = { background: 'white', padding: '25px', borderRadius: '8px', boxShadow: '0 5px 15px rgba(0,0,0,0.3)' };

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={{...modalContentStyle, width: '900px', maxWidth: '90vw'}} onClick={(e) => e.stopPropagation()}>
                <h2>{getModalTitle()}</h2>
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
                                    {!isViewMode && (
                                        <EditControl
                                            position="topright"
                                            onCreated={handleCreate}
                                            onEdited={handleEdit}
                                            onDeleted={handleDelete}
                                            draw={{ polygon: true, polyline: true, rectangle: false, circle: false, circlemarker: false, marker: false }}
                                        />
                                    )}
                                    {/* KITA TIDAK MERENDER SHAPE SECARA DEKLARATIF LAGI, useEffect akan menanganinya */}
                                </FeatureGroup>
                            </MapContainer>
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                           <p>{isViewMode ? 'Detail area kerja yang tersimpan.' : 'Gambar atau edit area di peta, lalu isi detail di bawah ini.'}</p>
                           <div>
                                <label>ID Area</label>
                                <input name="id" type="text" style={isAddMode ? inputStyle : disabledInputStyle} required readOnly={!isAddMode} defaultValue={initialData?.id || ''} />
                            </div>
                            <div>
                                <label>Nama Area</label>
                                <input name="name" type="text" style={isViewMode ? disabledInputStyle : inputStyle} required disabled={isViewMode} defaultValue={initialData?.name || ''}/>
                            </div>
                            <div>
                                <label>Tugaskan ke Karyawan</label>
                                <select name="assignedTo" style={isViewMode ? disabledInputStyle : selectStyle} required disabled={isViewMode} defaultValue={initialData?.assignedTo || ''}>
                                    <option value="">{loadingEmployees ? 'Memuat...' : '-- Pilih Mandor --'}</option>
                                    {employees.map(emp => (<option key={emp.id} value={emp.id}>{emp.name}</option>))}
                                </select>
                            </div>
                            <div style={{marginTop: 'auto', textAlign:'right'}}>
                                {isViewMode ? ( <button type="button" onClick={onClose}>Tutup</button> ) : (
                                    <>
                                        <button type="button" onClick={onClose}>Batal</button>
                                        <button type="submit" style={{marginLeft: '10px'}}>Simpan</button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default GeofenceDetailModal;