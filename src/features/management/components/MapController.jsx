// src/features/management/components/MapController.jsx

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

// 1. TERIMA PROP BARU onMapReady
function MapController({ featureGroupRef, mode, initialData, onMapReady }) {
  const map = useMap();

  useEffect(() => {
    if (!featureGroupRef.current) return;

    const fg = featureGroupRef.current;
    fg.clearLayers();

    if ((mode === 'view' || mode === 'edit') && initialData?.coordinates?.length > 0) {
      try {
        let layer;
        const path = initialData.coordinates.map(c => [c.lat, c.lng]);
        const color = mode === 'view' ? 'blue' : 'green';

        if (initialData.type === 'polygon') {
          layer = L.polygon(path, { color });
        } else if (initialData.type === 'polyline') {
          layer = L.polyline(path, { color });
        }

        if (layer) {
          fg.addLayer(layer);
          map.fitBounds(layer.getBounds(), { padding: [50, 50] });
        }
      } catch (error) {
        console.error("MAP CONTROLLER: Error drawing shape:", error);
      }
    }
    
    // 2. PANGGIL onMapReady SETELAH SEMUA SELESAI
    // Kita gunakan setTimeout kecil untuk memastikan transisi zoom selesai
    const timer = setTimeout(() => {
      if(onMapReady) onMapReady();
    }, 500); // 0.5 detik, cukup untuk animasi zoom

    return () => clearTimeout(timer);

  }, [map, featureGroupRef, mode, initialData, onMapReady]);

  return null;
}

export default MapController;