// src/features/management/components/GeofenceFormModal.jsx

import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, LayersControl, Polygon, Polyline } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw.css';
import { useEmployees } from '../../../hooks/useEmployees';
import L from 'leaflet';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';

let DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const GeofenceFormModal = ({ isOpen, onClose, onSave, initialData, isSaving }) => {
    const featureGroupRef = useRef();
    const isEditMode = Boolean(initialData);
    const { employees, loading: loadingEmployees } = useEmployees();

    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [assignedTo, setAssignedTo] = useState('');
    const [editedShape, setEditedShape] = useState(null);

    useEffect(() => {
        if (isOpen && initialData) {
            setId(initialData.id || '');
            setName(initialData.name || '');
            setAssignedTo(initialData.assignedTo || '');
            setEditedShape(null);
        } else if (isOpen && !initialData) {
            setId('');
            setName('');
            setAssignedTo('');
            setEditedShape(null);
        }
    }, [isOpen, initialData]);

    let mapProps = {};
    const initialCoords = initialData?.coordinates;
    if (isEditMode && initialCoords && initialCoords.length > 0) {
        const bounds = initialCoords.map(c => [c.lat, c.lng]);
        mapProps = { bounds, boundsOptions: { padding: [50, 50] } };
    } else {
        mapProps = { center: [-4.818, 105.187], zoom: 13 };
    }

    const handleShapeEdited = (e) => {
        e.layers.eachLayer(layer => {
             if (layer) {
                const latlngs = layer.getLatLngs();
                const layerType = layer instanceof L.Polygon ? 'polygon' : 'polyline';
                const coords = layerType === 'polygon' 
                    ? latlngs[0].map(latlng => ({ lat: latlng.lat, lng: latlng.lng }))
                    : latlngs.map(latlng => ({ lat: latlng.lat, lng: latlng.lng }));
                setEditedShape({ type: layerType, coordinates: coords });
             }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const finalShape = editedShape || (initialData ? { type: initialData.type, coordinates: initialData.coordinates } : null);
        if (!finalShape || !finalShape.coordinates || finalShape.coordinates.length < 2) {
            alert("Harap gambar atau edit sebuah area di peta terlebih dahulu.");
            return;
        }
        const geofenceData = {
          id: isEditMode ? initialData.id : id,
          name: name,
          assignedTo: assignedTo,
          type: finalShape.type,
          coordinates: finalShape.coordinates,
        };
        onSave(geofenceData);
    };

    const initialShapePath = isEditMode && initialData?.coordinates 
        ? initialData.coordinates.map(c => [c.lat, c.lng]) : null;

    return (
        <Dialog open={isOpen} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle className="text-center font-bold">
                {isEditMode ? 'Edit Area Kerja' : 'Tambah Area Kerja Baru'}
            </DialogTitle>
            <DialogContent>
                <form id="geofence-form" onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 mt-4">
                    <div className="lg:w-2/3 h-[400px] lg:h-[500px] border dark:border-gray-600 rounded-lg overflow-hidden">
                        <MapContainer key={initialData?.id || 'new'} {...mapProps} style={{ height: '100%', width: '100%' }}>
                            <LayersControl position="topright">
                                <LayersControl.BaseLayer checked name="Street Map">
                                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap'/>
                                </LayersControl.BaseLayer>
                                <LayersControl.BaseLayer name="Citra Satelit">
                                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri'/>
                                </LayersControl.BaseLayer>
                            </LayersControl>
                            <FeatureGroup ref={featureGroupRef}>
                                <EditControl
                                    position="topright"
                                    onCreated={handleShapeEdited}
                                    onEdited={handleShapeEdited}
                                    onDeleted={() => setEditedShape(null)}
                                    draw={{ polygon: true, polyline: true, rectangle: false, circle: false, circlemarker: false, marker: false }}
                                />
                                {initialData?.type === 'polygon' && initialShapePath && <Polygon positions={initialShapePath} pathOptions={{ color: 'gray', dashArray: '5, 5' }} />}
                                {initialData?.type === 'polyline' && initialShapePath && <Polyline positions={initialShapePath} pathOptions={{ color: 'gray', dashArray: '5, 5' }} />}
                            </FeatureGroup>
                        </MapContainer>
                    </div>
                    <div className="lg:w-1/3 flex flex-col gap-4">
                       <p className="text-sm text-gray-600 dark:text-gray-400">Gambar atau edit area di peta, lalu isi detail di bawah ini.</p>
                       <TextField label="ID Area" value={id} onChange={(e) => setId(e.target.value)} disabled={isEditMode} required fullWidth />
                        <TextField label="Nama Area" value={name} onChange={(e) => setName(e.target.value)} required fullWidth />
                        <FormControl fullWidth>
                            <InputLabel>Tugaskan ke Karyawan</InputLabel>
                            <Select
                                value={assignedTo}
                                label="Tugaskan ke Karyawan"
                                onChange={(e) => setAssignedTo(e.target.value)}
                                required
                            >
                                <MenuItem value="" disabled={loadingEmployees}>
                                    {loadingEmployees ? <CircularProgress size={20} sx={{ marginRight: 1 }} /> : null}
                                    {loadingEmployees ? 'Memuat Karyawan...' : '-- Pilih Mandor --'}
                                </MenuItem>
                                {!loadingEmployees && employees.map(emp => (
                                    <MenuItem key={emp.id} value={emp.id}>{emp.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                </form>
            </DialogContent>
            <DialogActions className="p-4 bg-gray-50 dark:bg-gray-800">
                <Button onClick={onClose} variant="outlined" disabled={isSaving}>Batal</Button>
                <Button 
                    type="submit" 
                    form="geofence-form" 
                    variant="contained" 
                    className="bg-green-700 hover:bg-green-800"
                    disabled={isSaving}
                >
                    {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Simpan'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default GeofenceFormModal;