import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// --- Ikon Default (Tidak Berubah) ---
const DefaultIcon = L.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;


// --- KOMPONEN KONTROLER PETA (LOGIKA UTAMA DIPINDAH KE SINI) ---
function MapEffect({ locations, selectedEmployeeId }) {
  const map = useMap();
  // Gunakan ref untuk menandai apakah tampilan awal sudah diatur
  const initialBoundsSet = useRef(false);

  // --- EFEK 1: HANYA UNTUK TAMPILAN AWAL ---
  useEffect(() => {
    // Jangan lakukan apa-apa jika:
    // - Peta belum siap
    // - Tampilan awal sudah pernah diatur
    // - Belum ada data lokasi
    if (!map || initialBoundsSet.current || Object.values(locations).length === 0) {
      return;
    }

    const locationValues = Object.values(locations);
    const latLngs = locationValues.map(loc => [loc.lat, loc.lng]);

    if (latLngs.length > 0) {
      console.log('Setting initial map bounds...');
      map.fitBounds(latLngs, { padding: [50, 50], maxZoom: 15 });
      // Tandai bahwa tampilan awal sudah selesai
      initialBoundsSet.current = true;
    }
    // Dependency array ini memastikan efek berjalan saat peta & lokasi pertama kali tersedia,
    // tapi 'if' di atas mencegahnya berjalan lagi.
  }, [map, locations]);


  // --- EFEK 2: HANYA UNTUK AKSI PEMILIHAN KARYAWAN OLEH PENGGUNA ---
  useEffect(() => {
    // Jangan lakukan apa-apa jika peta belum siap
    if (!map) return;

    // Jika ada karyawan yang DIPILIH, terbang ke lokasinya
    if (selectedEmployeeId && locations[selectedEmployeeId]) {
      const { lat, lng } = locations[selectedEmployeeId];
      console.log(`Flying to selected employee: ${selectedEmployeeId}`);
      map.flyTo([lat, lng], 16, {
        animate: true,
        duration: 1.5
      });
    }
    // TIDAK ADA 'else' DI SINI. Jika tidak ada yang dipilih, kita tidak melakukan apa-apa.
    // Peta akan tetap pada posisi terakhirnya.
  }, [map, selectedEmployeeId, locations]); // 'locations' dibutuhkan untuk mendapatkan koordinat terbaru dari karyawan yang dipilih

  return null;
}


// --- KOMPONEN UTAMA (Tampilan Peta) ---
const LiveMap = ({ locations, selectedEmployeeId, customHeight }) => {
  const initialPosition = [-2.74833, 107.64306];
  const initialZoom = 13;

  return (
    <MapContainer
      center={initialPosition}
      zoom={initialZoom}
      style={{
        height: customHeight || '100%',
        width: '100%',
        backgroundColor: '#f0f0f0',
        minHeight: '200px',
      }}
    >
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Street Map">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Citra Satelit">
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution='© Esri — Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      {/* React akan secara efisien me-render ulang marker yang posisinya berubah */}
      {Object.values(locations).map(loc => (
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>
            <b>{loc.name}</b><br />
            Posisi: {loc.position}<br />
            Update Terakhir: {loc.lastUpdate?.toDate ? loc.lastUpdate.toDate().toLocaleString('id-ID') : 'N/A'}
          </Popup>
        </Marker>
      ))}

      {/* Komponen controller yang berisi semua logika efek peta */}
      <MapEffect locations={locations} selectedEmployeeId={selectedEmployeeId} />
    </MapContainer>
  );
};

export default LiveMap;