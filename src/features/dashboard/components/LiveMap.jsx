// src/features/dashboard/components/LiveMap.jsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- [PERUBAHAN UTAMA DI SINI] ---

// Fungsi untuk menghasilkan warna unik berdasarkan string (misalnya, ID karyawan)
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

// Fungsi untuk membuat ikon marker kustom
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
    className: 'custom-leaflet-icon', // class ini tidak perlu style, hanya untuk identifikasi
    iconSize: [30, 30],
    iconAnchor: [15, 30], // Titik bawah dari marker
    popupAnchor: [0, -30] // Popup muncul di atas marker
  });
};

// --- AKHIR PERUBAHAN ---


// Komponen untuk mengatur efek peta (zoom, pan, dll.)
function MapEffect({ locations, selectedEmployeeId }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });

    const mapElement = map.getContainer();
    if (mapElement) {
      resizeObserver.observe(mapElement);
    }

    return () => {
      if (mapElement) {
        resizeObserver.unobserve(mapElement);
      }
    };
  }, [map]);

  useEffect(() => {
    if (!map) return;

    if (selectedEmployeeId && locations[selectedEmployeeId]) {
      const { lat, lng } = locations[selectedEmployeeId];
      map.flyTo([lat, lng], 16, {
        animate: true,
        duration: 1.5
      });
    } else {
      const locationValues = Object.values(locations);
      if (locationValues.length === 0) return;

      const latLngs = locationValues.map(loc => [loc.lat, loc.lng]);
      if (latLngs.length > 0) {
        map.fitBounds(latLngs, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [locations, selectedEmployeeId, map]);

  return null;
}

const LiveMap = ({ locations, selectedEmployeeId }) => {
  const initialPosition = [-2.74833, 107.64306];
  const initialZoom = 13;

  return (
    <MapContainer
      center={initialPosition}
      zoom={initialZoom}
      className="h-full w-full bg-gray-200 min-h-[200px]"
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
            attribution='&copy; Esri &mdash; Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {Object.values(locations).map(loc => (
        // [PERUBAHAN] Menggunakan ikon kustom
        <Marker 
          key={loc.id} 
          position={[loc.lat, loc.lng]} 
          icon={createCustomIcon(loc)} // Terapkan ikon kustom di sini
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