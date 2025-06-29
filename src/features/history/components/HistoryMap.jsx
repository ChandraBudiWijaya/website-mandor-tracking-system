// src/features/history/components/HistoryMap.jsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';

let DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

function HistoryMapEffect({ path, geofencePath }) {
    const map = useMap();
    useEffect(() => {
        if (path && path.length > 1) {
            map.fitBounds(path, { padding: [50, 50], maxZoom: 17 });
        } 
        else if (geofencePath && geofencePath.length > 0) {
            map.fitBounds(geofencePath, { padding: [50, 50], maxZoom: 17 });
        }
    }, [path, geofencePath, map]);

    return null;
}

const HistoryMap = ({ logs, geofence }) => {
  const pathCoordinates = logs ? logs.map(log => [log.lat, log.lng]) : [];
  const hasData = logs && logs.length > 0;
  
  const startPoint = hasData ? logs[0] : null;
  const endPoint = hasData ? logs[logs.length - 1] : null;

  const geofencePath = geofence ? geofence.coordinates.map(coord => [coord.lat, coord.lng]) : null;
  const geofenceOptions = { color: 'green', fillColor: 'lightgreen', fillOpacity: 0.4 };

  // Jika tidak ada data, tampilkan pesan di dalam container peta
  if (!hasData) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Tidak ada data perjalanan untuk ditampilkan.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <MapContainer 
        key={pathCoordinates.length} // Key untuk me-reset peta saat data baru dimuat
        center={[-4.5586, 105.4068]} 
        zoom={9} 
        className="h-full w-full"
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Street Map">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Citra Satelit">
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" attribution='&copy; Esri' />
          </LayersControl.BaseLayer>
        </LayersControl>

        {geofencePath && <Polygon pathOptions={geofenceOptions} positions={geofencePath} />}

        <Polyline pathOptions={{ color: 'blue', weight: 5, opacity: 0.7 }} positions={pathCoordinates} />
        
        {startPoint && (
          <Marker position={[startPoint.lat, startPoint.lng]} icon={DefaultIcon}>
            <Popup>Titik Awal<br/>{startPoint.timestamp.toDate().toLocaleTimeString('id-ID')}</Popup>
          </Marker>
        )}

        {endPoint && (
            <Marker position={[endPoint.lat, endPoint.lng]} icon={DefaultIcon}>
            <Popup>Titik Akhir<br/>{endPoint.timestamp.toDate().toLocaleTimeString('id-ID')}</Popup>
          </Marker>
        )}

        <HistoryMapEffect path={pathCoordinates} geofencePath={geofencePath} />
      </MapContainer>
    </div>
  );
};

export default HistoryMap;