// src/features/dashboard/components/LiveMap.jsx

import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fungsi untuk menghasilkan warna unik (tidak berubah)
const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xFF;
    color += ('00' + value.toString(16)).substr(-2);
  }
  return color;
};

// Fungsi untuk membuat ikon kustom (tidak berubah)
const createCustomIcon = (employee) => {
  const markerHtml = `
    <div style="
      background-color: ${stringToColor(employee.id)};
      width: 30px;
      height: 30px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex;
      justify-content: center;
      align-items: center;
      border: 2px solid #FFFFFF;
      box-shadow: 0 0 5px rgba(0,0,0,0.5);
    ">
      <div style="
        transform: rotate(45deg);
        color: white;
        font-size: 14px;
        font-weight: bold;
        font-family: 'Poppins', sans-serif;
      ">
        ${employee.name.charAt(0)}
      </div>
    </div>
  `;

  return L.divIcon({
    html: markerHtml,
    className: 'custom-leaflet-icon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};


// Komponen efek peta yang sudah diperbaiki
function MapEffect({ locations, selectedEmployeeId }) {
  const map = useMap();
  // Ref untuk menandai apakah zoom awal sudah dilakukan
  const hasInitiallyZoomed = useRef(false);

  // Efek ini HANYA untuk merespons pemilihan karyawan
  useEffect(() => {
    // Jika ada karyawan yang dipilih, terbangkan peta ke sana
    if (selectedEmployeeId && locations[selectedEmployeeId]) {
      const { lat, lng } = locations[selectedEmployeeId];
      map.flyTo([lat, lng], 16, { animate: true, duration: 1.5 });
    }
    // Jika pilihan dibatalkan, zoom kembali ke semua marker
    else if (!selectedEmployeeId) {
        const locationValues = Object.values(locations);
        if(locationValues.length > 0) {
            const latLngs = locationValues.map(loc => [loc.lat, loc.lng]);
            map.fitBounds(latLngs, { padding: [50, 50], maxZoom: 15 });
        }
    }
  }, [selectedEmployeeId, map]); // <-- Hapus `locations` dari dependensi ini

  // Efek ini HANYA untuk mengatur tampilan awal peta
  useEffect(() => {
    // Jalankan hanya jika belum pernah zoom dan sudah ada data lokasi
    if (!hasInitiallyZoomed.current && Object.keys(locations).length > 0) {
      const locationValues = Object.values(locations);
      const latLngs = locationValues.map(loc => [loc.lat, loc.lng]);
      map.fitBounds(latLngs, { padding: [50, 50], maxZoom: 15 });
      hasInitiallyZoomed.current = true; // Tandai bahwa zoom awal sudah selesai
    }
  }, [locations, map]); // <-- Efek ini tetap bergantung pada `locations` untuk mendapatkan data awal

  return null;
}

const LiveMap = ({ locations, selectedEmployeeId }) => {
  const initialPosition = [-2.74833, 107.64306];
  const initialZoom = 13;

  return (
    <MapContainer
      center={initialPosition}
      zoom={initialZoom}
      className="h-full w-full bg-gray-200"
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Street Map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Citra Satelit">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='&copy; Esri'
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {Object.values(locations).map(loc => (
        <Marker 
          key={loc.id} 
          position={[loc.lat, loc.lng]} 
          icon={createCustomIcon(loc)}
        >
          <Popup>
            <b>{loc.name}</b><br />
            Posisi: {loc.position}<br />
            Update Terakhir: {loc.lastUpdate?.toDate ? loc.lastUpdate.toDate().toLocaleString('id-ID') : 'N/A'}
          </Popup>
        </Marker>
      ))}

      <MapEffect locations={locations} selectedEmployeeId={selectedEmployeeId} />
    </MapContainer>
  );
};

export default LiveMap;