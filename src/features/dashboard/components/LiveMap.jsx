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

// Fungsi untuk membuat ikon kustom yang lebih baik
const createCustomIcon = (employee) => {
  const backgroundColor = stringToColor(employee.id);
  const markerHtml = `
    <div style="position: relative; width: 40px; height: 40px;">
      <!-- Pin utama -->
      <div style="
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, ${backgroundColor}, ${backgroundColor}dd);
        border-radius: 50% 50% 50% 0;
        transform: translateX(-50%) rotate(-45deg);
        border: 3px solid #FFFFFF;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.1);
        display: flex;
        justify-content: center;
        align-items: center;
      ">
        <!-- Initial huruf -->
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          font-weight: bold;
          font-family: 'Poppins', sans-serif;
          text-shadow: 0 1px 2px rgba(0,0,0,0.5);
          line-height: 1;
        ">
          ${employee.name.charAt(0)}
        </div>
      </div>
      
      <!-- Pulse effect untuk online status -->
      <div style="
        position: absolute;
        top: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 32px;
        height: 32px;
        background: ${backgroundColor}40;
        border-radius: 50% 50% 50% 0;
        transform: translateX(-50%) rotate(-45deg);
        animation: pulse-pin 2s infinite;
      "></div>
    </div>
    
    <style>
      @keyframes pulse-pin {
        0% {
          transform: translateX(-50%) rotate(-45deg) scale(1);
          opacity: 1;
        }
        70% {
          transform: translateX(-50%) rotate(-45deg) scale(1.4);
          opacity: 0;
        }
        100% {
          transform: translateX(-50%) rotate(-45deg) scale(1.4);
          opacity: 0;
        }
      }
    </style>
  `;

  return L.divIcon({
    html: markerHtml,
    className: 'custom-leaflet-icon',
    iconSize: [40, 40],
    iconAnchor: [20, 32],
    popupAnchor: [0, -32]
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
  }, [selectedEmployeeId, map, locations]); // <-- Hapus `locations` dari dependensi ini

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