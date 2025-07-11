// src/features/history/components/HistoryMap.jsx

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Polygon, Marker, Popup, useMap, LayersControl } from 'react-leaflet';
import L from 'leaflet';
import FloatingPlaybackControls from './FloatingPlaybackControls';

let DefaultIcon = L.icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const createMovingIcon = () => {
  return L.divIcon({
    html: `<div style="background-color: #1e8e3e; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 5px rgba(0,0,0,0.7);"></div>`,
    className: '',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

function HistoryMapEffect({ path, geofencePath, currentMarker }) {
    const map = useMap();

    useEffect(() => {
        if (path && path.length > 1) {
            map.fitBounds(path, { padding: [50, 50], maxZoom: 17 });
        } 
        else if (geofencePath && geofencePath.length > 0) {
            map.fitBounds(geofencePath, { padding: [50, 50], maxZoom: 17 });
        }
    }, [path, geofencePath, map]);

    useEffect(() => {
        if (currentMarker) {
            map.panTo([currentMarker.lat, currentMarker.lng]);
        }
    }, [currentMarker, map]);

    return null;
}

const HistoryMap = ({ 
  logs, 
  allLogs, // Logs asli untuk FloatingPlaybackControls
  geofence, 
  currentMarker, 
  // Playback controls props
  isPlaying,
  playbackIndex,
  playbackSpeed,
  isPlaybackActive,
  onPlayPause,
  onSliderChange,
  onSpeedChange,
  onStop,
  onNext,
  onPrevious,
  showPlaybackControls = true,
  // Info untuk fullscreen
  employeeName,
  selectedDate
}) => {
  const safeLogs = Array.isArray(logs) ? logs : [];
  const pathCoordinates = safeLogs.map(log => [log.lat, log.lng]);
  const hasData = safeLogs.length > 0;
  
  const startPoint = hasData ? safeLogs[0] : null;
  const endPoint = hasData ? safeLogs[safeLogs.length - 1] : null;

  const geofencePath = geofence ? geofence.coordinates.map(coord => [coord.lat, coord.lng]) : null;
  const geofenceOptions = { color: 'green', fillColor: 'lightgreen', fillOpacity: 0.4 };

  const formatTimestamp = (timestamp) => {
    if (!timestamp || !timestamp.toDate) return 'N/A';
    return timestamp.toDate().toLocaleString('id-ID', {
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
  };

  return (
    <div className="history-map-container h-full w-full">
      <MapContainer 
        key={geofencePath ? geofencePath.toString() : pathCoordinates.toString()} // Reset peta saat data utama berubah
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

        {!hasData ? (
          <div className="flex items-center justify-center h-full w-full">
            <p className="text-gray-500 bg-white p-4 rounded-lg shadow-md z-[1000] relative">
              Data perjalanan akan muncul di sini.
            </p>
          </div>
        ) : (
          <>
            <Polyline pathOptions={{ color: 'blue', weight: 5, opacity: 0.7 }} positions={pathCoordinates} />
            
            {startPoint && (
              <Marker position={[startPoint.lat, startPoint.lng]} icon={DefaultIcon}>
                <Popup><b>Titik Awal</b><br/>Waktu: {formatTimestamp(startPoint.device_timestamp)}</Popup>
              </Marker>
            )}

            {!currentMarker && endPoint && (
               <Marker position={[endPoint.lat, endPoint.lng]} icon={DefaultIcon}>
                <Popup><b>Titik Akhir</b><br/>Waktu: {formatTimestamp(endPoint.device_timestamp)}</Popup>
              </Marker>
            )}

            {currentMarker && (
              <Marker 
                position={[currentMarker.lat, currentMarker.lng]}
                icon={createMovingIcon()}
                zIndexOffset={1000}
              >
                <Popup>
                  <b>Posisi Saat Ini</b><br/>
                  Waktu: {formatTimestamp(currentMarker.device_timestamp)}
                </Popup>
              </Marker>
            )}
          </>
        )}

        <HistoryMapEffect path={pathCoordinates} geofencePath={geofencePath} currentMarker={currentMarker} />
        
        {/* Floating Playback Controls */}
        {showPlaybackControls && hasData && (
          <FloatingPlaybackControls
            logs={allLogs || safeLogs}  // Gunakan allLogs jika tersedia, fallback ke safeLogs
            isPlaying={isPlaying}
            playbackIndex={playbackIndex}
            playbackSpeed={playbackSpeed}
            isPlaybackActive={isPlaybackActive}
            onPlayPause={onPlayPause}
            onSliderChange={onSliderChange}
            onSpeedChange={onSpeedChange}
            onStop={onStop}
            onNext={onNext}
            onPrevious={onPrevious}
            employeeName={employeeName}
            selectedDate={selectedDate}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default HistoryMap;