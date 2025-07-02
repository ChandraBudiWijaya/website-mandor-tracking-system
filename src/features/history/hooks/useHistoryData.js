// src/features/history/hooks/useHistoryData.js

import { useState } from 'react';
import { db } from '../../../api/firebaseConfig';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

export const useHistoryData = () => {
  const [logs, setLogs] = useState([]); // Pastikan state awal adalah array kosong
  const [summary, setSummary] = useState(null);
  const [geofence, setGeofence] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (employeeId, date) => {
    setLoading(true);
    setError(null);
    setLogs([]);
    setSummary(null);
    setGeofence(null);

    try {
      // --- [PERUBAHAN UTAMA] Mengambil data dari sub-koleksi ---
      // employees/{employeeId}/logs_{date
      const logsCollectionPath = `employees/${employeeId}/logs_${date}`;
      const logsQuery = query(
        collection(db, logsCollectionPath),
        orderBy('device_timestamp', 'asc') // Sesuaikan nama field timestamp jika perlu
      );
      
      const logsSnapshot = await getDocs(logsQuery);
      const logsData = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(logsData);

      // --- Logika untuk summary dan geofence (mungkin juga perlu disesuaikan) ---
      const summaryDocId = `${employeeId}_${date}`;
      const summaryDocRef = doc(db, 'daily_summaries', summaryDocId);
      const summarySnapshot = await getDoc(summaryDocRef);
      if (summarySnapshot.exists()) {
        setSummary(summarySnapshot.data());
      }

      const geofencesQuery = query(
        collection(db, 'geofences'),
        where('assignedTo', '==', employeeId)
      );
      const geofenceSnapshot = await getDocs(geofencesQuery);
      if (!geofenceSnapshot.empty) {
        const geofenceData = geofenceSnapshot.docs[0].data();
        setGeofence(geofenceData);
      }

    } catch (err) {
      console.error("Error fetching history data:", err);
      // Jika terjadi error (misalnya koleksi tidak ditemukan), pastikan logs tetap array
      setLogs([]); 
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return { logs, summary, geofence, loading, error, fetchData };
};