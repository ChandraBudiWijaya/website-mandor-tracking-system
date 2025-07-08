// src/features/dashboard/hooks/useRealtimeLocations.js

import { useState, useEffect } from 'react';
import { db } from '../../../api/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

export const useRealtimeLocations = () => {
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Membuat query untuk mendengarkan perubahan pada koleksi 'employees'
    const q = collection(db, 'employees');

    // onSnapshot akan berjalan setiap kali ada perubahan data di koleksi 'employees',
    // termasuk saat pertama kali dimuat.
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const updatedLocations = {};
      querySnapshot.forEach((doc) => {
        const employeeData = doc.data();
        
        // Cek apakah karyawan memiliki data 'last_location'
        if (employeeData.last_location) {
          updatedLocations[doc.id] = {
            id: doc.id,
            name: employeeData.name,
            position: employeeData.position,
            // Ambil data lat, lng, dan timestamp dari field 'last_location'
            lat: employeeData.last_location.lat,
            lng: employeeData.last_location.lng,
            lastUpdate: employeeData.last_location.device_timestamp, // Gunakan device_timestamp
          };
        }
      });
      
      setLocations(updatedLocations);
      if (loading) {
        setLoading(false);
      }
    }, (error) => {
      console.error("Error fetching real-time locations: ", error);
      setLoading(false);
    });

    // Cleanup: Hentikan listener saat komponen tidak lagi digunakan
    return () => unsubscribe();

  }, [loading]); // <-- Dependensi diubah ke [loading]

  return { locations, loading };
};