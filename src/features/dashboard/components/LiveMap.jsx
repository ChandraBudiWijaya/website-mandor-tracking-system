import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const DefaultIcon = L.icon({
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapEffect({ locations, selectedEmployeeId, customHeight }) { // CustomHeight tidak dipakai langsung di sini, tapi bagus untuk tahu konteks
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    // --- PENTING: Invalidate size dengan delay yang lebih reliable ---
    // Ini adalah upaya terakhir untuk memastikan peta merender ulang ukurannya dengan benar
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
      console.log('Map invalidateSize called by ResizeObserver'); // Debugging
    });

    // Amati elemen kontainer peta Leaflet
    const mapElement = map.getContainer();
    if (mapElement) {
      resizeObserver.observe(mapElement);
    }

    // Cleanup observer saat komponen unmount
    return () => {
      if (mapElement) {
        resizeObserver.unobserve(mapElement);
      }
    };
    // Hapus setTimeout dan ganti dengan ResizeObserver untuk akurasi yang lebih tinggi
  }, [map]); // map sebagai dependency

  // Logika zoom/pan tetap sama
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

const LiveMap = ({ locations, selectedEmployeeId, customHeight }) => {
  const initialPosition = [-2.74833, 107.64306];
  const initialZoom = 13;

  return (
    <MapContainer
      center={initialPosition}
      zoom={initialZoom}
      style={{
        height: customHeight || '100%', // Gunakan tinggi yang dihitung, fallback ke 100%
        width: '100%',
        backgroundColor: '#f0f0f0',
        minHeight: '200px', // Tambahkan minimal tinggi untuk jaga-jaga
      }}
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
        <Marker key={loc.id} position={[loc.lat, loc.lng]}>
          <Popup>
            <b>{loc.name}</b><br />
            Posisi: {loc.position}<br />
            Update Terakhir: {loc.lastUpdate && loc.lastUpdate.toDate ? loc.lastUpdate.toDate().toLocaleString('id-ID') : 'N/A'}
          </Popup>
        </Marker>
      ))}

      <MapEffect locations={locations} selectedEmployeeId={selectedEmployeeId} customHeight={customHeight} />
    </MapContainer>
  );
};

export default LiveMap;