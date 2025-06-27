import { useState, useEffect } from 'react';
import { db } from '../api/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export const useGeofences = () => {
  const [geofences, setGeofences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGeofences = async () => {
      try {
        // Urutkan berdasarkan nama agar tampilannya konsisten
        const q = query(collection(db, 'geofences'), orderBy('name'));
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
  }, []);

  return { geofences, loading, setGeofences };
};