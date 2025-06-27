import React, { useEffect } from 'react';
// 1. Impor Polygon
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// ... (kode ikon dan MapEffect tidak berubah)
let DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
function HistoryMapEffect({ path, geofencePath }) {
    const map = useMap();
    useEffect(() => {
        if (path && path.length > 0) {
          map.fitBounds(path, { padding: [50, 50] });
        } else if (geofencePath && geofencePath.length > 0) {
          // Jika tidak ada jejak, zoom ke geofence saja
          map.fitBounds(geofencePath, { padding: [50, 50] });
        } else {
          map.setView([-4.5586, 105.4068], 9);
        }
    }, [path, geofencePath, map]);
    return null;
}


// 2. Terima prop 'geofence'
const HistoryMap = ({ logs, geofence }) => {
  const pathCoordinates = logs ? logs.map(log => [log.lat, log.lng]) : [];
  const hasData = logs && logs.length > 0;
  const startPoint = hasData ? logs[0] : null;
  const endPoint = hasData ? logs[logs.length - 1] : null;

  // 3. Siapkan koordinat untuk poligon geofence
  const geofencePath = geofence ? geofence.coordinates.map(coord => [coord.lat, coord.lng]) : null;

  // Opsi style untuk poligon geofence
  const geofenceOptions = { color: 'green', fillColor: 'lightgreen', fillOpacity: 0.4 };

  return (
      <div style={{ height: '500px', width: '100%' }}>
          <MapContainer center={[-4.5586, 105.4068]} zoom={9} style={{ height: '100%', width: '100%', borderRadius: '8px' }}>
              {/* ... (kode LayersControl tidak berubah) ... */}
              <LayersControl position="topright">
               <LayersControl.BaseLayer checked name="Street Map">
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
               </LayersControl.BaseLayer>
               <LayersControl.BaseLayer name="Citra Satelit">
                  <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri' />
               </LayersControl.BaseLayer>
            </LayersControl>

              {/* 4. Tampilkan poligon JIKA geofence ada */}
              {geofencePath && <Polygon pathOptions={geofenceOptions} positions={geofencePath} />}

              {hasData && (
                  <>
                      <Polyline pathOptions={{ color: 'blue' }} positions={pathCoordinates} />
                      <Marker position={[startPoint.lat, startPoint.lng]}>
                          <Popup>Titik Awal<br/>{startPoint.timestamp.toDate().toLocaleTimeString('id-ID')}</Popup>
                      </Marker>
                      <Marker position={[endPoint.lat, endPoint.lng]}>
                          <Popup>Titik Akhir<br/>{endPoint.timestamp.toDate().toLocaleTimeString('id-ID')}</Popup>
                      </Marker>
                  </>
              )}

              <HistoryMapEffect path={pathCoordinates} geofencePath={geofencePath} />
          </MapContainer>
      </div>
  );
};

export default HistoryMap;