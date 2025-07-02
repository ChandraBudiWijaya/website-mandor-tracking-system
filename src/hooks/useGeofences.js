import { useState, useEffect } from 'react';
import { db } from '../api/firebaseConfig'; // Pastikan path ini benar
import { collection, getDocs, query } from 'firebase/firestore';

/**
 * React Hook untuk mengambil daftar semua geofence dari Firestore.
 */
export const useGeofences = () => {
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        // <<< PERUBAHAN: Menghapus orderBy('name') untuk mencegah error >>>
        // Query ini sekarang hanya akan mengambil semua dokumen dari koleksi.
        // Anda bisa menambahkan kembali orderBy jika Anda menambahkan field 'name'
        // di setiap dokumen geofence Anda di Firestore.
        const q = query(collection(db, 'geofences'));
        
        const querySnapshot = await getDocs(q);
        const geofenceList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setGeofences(geofenceList);
      } catch (error) {
        console.error("Error fetching geofences: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeofences();
  }, []); // Array dependensi kosong agar hanya berjalan sekali

  return { geofences, loading, setGeofences };
};
