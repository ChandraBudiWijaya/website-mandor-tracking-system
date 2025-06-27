import { useState } from 'react';
import { db } from '../../../api/firebaseConfig';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

export const useHistoryData = () => {
  const [logs, setLogs] = useState([]);
  const [summary, setSummary] = useState(null);
  const [geofence, setGeofence] = useState(null); // <-- 1. Tambah state baru untuk geofence
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (employeeId, date) => {
    setLoading(true);
    setError(null);
    setLogs([]);
    setSummary(null);
    setGeofence(null); // <-- Reset geofence saat pencarian baru

    try {
      // --- Ambil Tracking Logs (Tidak berubah) ---
      const startOfDay = new Date(`${date}T00:00:00`);
      const endOfDay = new Date(`${date}T23:59:59`);
      const logsQuery = query(
        collection(db, 'tracking_logs'),
        where('index_karyawan', '==', employeeId),
        where('timestamp', '>=', startOfDay),
        where('timestamp', '<=', endOfDay),
        orderBy('timestamp', 'asc')
      );
      const logsSnapshot = await getDocs(logsQuery);
      const logsData = logsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setLogs(logsData);

      // --- Ambil Daily Summary (Tidak berubah) ---
      const summaryDocId = `${employeeId}_${date}`;
      const summaryDocRef = doc(db, 'daily_summaries', summaryDocId);
      const summarySnapshot = await getDoc(summaryDocRef);
      if (summarySnapshot.exists()) {
        setSummary(summarySnapshot.data());
      }

      // --- 2. LOGIKA BARU: Ambil Geofence ---
      const geofencesQuery = query(
        collection(db, 'geofences'),
        where('assignedTo', '==', employeeId)
      );
      const geofenceSnapshot = await getDocs(geofencesQuery);
      if (!geofenceSnapshot.empty) {
        // Kita asumsikan satu karyawan hanya punya satu geofence utama
        // Jika bisa punya banyak, logikanya perlu disesuaikan
        const geofenceData = geofenceSnapshot.docs[0].data();
        setGeofence(geofenceData);
      }

    } catch (err) {
      console.error("Error fetching history data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // 3. Kembalikan geofence dari hook
  return { logs, summary, geofence, loading, error, fetchData };
};