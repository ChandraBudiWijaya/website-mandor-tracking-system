// src/features/history/hooks/useHistoryData.js

import { useState } from 'react';
import { db } from '../../../api/firebaseConfig';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';

// Helper function untuk menghitung summary yang lebih lengkap
const calculateEnhancedSummary = (existingSummary, logsData) => {
  // Tambahkan perhitungan berdasarkan logs jika diperlukan
  const enhanced = { ...existingSummary };
  
  if (!enhanced.totalDataPoints) {
    enhanced.totalDataPoints = logsData.length;
  }
  
  if (!enhanced.firstUpdate && logsData.length > 0) {
    enhanced.firstUpdate = logsData[0].device_timestamp;
  }
  
  if (!enhanced.lastUpdate && logsData.length > 0) {
    enhanced.lastUpdate = logsData[logsData.length - 1].device_timestamp;
  }
  
  // Tambahkan analisis pola aktivitas
  if (logsData.length > 0) {
    enhanced.activityPattern = analyzeActivityPattern(logsData);
  }
  
  return enhanced;
};

// Helper function untuk menghitung summary dari logs
const calculateSummaryFromLogs = (logsData, employeeId, date) => {
  if (logsData.length === 0) {
    return {
      employeeId,
      date,
      totalWorkMinutes: 0,
      totalOutsideAreaMinutes: 0,
      expectedWorkHours: 8,
      totalDataPoints: 0,
      lastUpdate: new Date()
    };
  }
  
  // Implementasi dasar perhitungan dari logs
  let totalWorkMinutes = 0;
  let totalOutsideAreaMinutes = 0;
  
  // Asumsi sederhana: hitung berdasarkan status in_geofence
  logsData.forEach((log, index) => {
    if (index > 0) {
      const prevLog = logsData[index - 1];
      const timeDiff = new Date(log.device_timestamp?.toDate?.() || log.device_timestamp) - 
                      new Date(prevLog.device_timestamp?.toDate?.() || prevLog.device_timestamp);
      const minutes = timeDiff / (1000 * 60); // Convert to minutes
      
      if (log.in_geofence) {
        totalWorkMinutes += minutes;
      } else {
        totalOutsideAreaMinutes += minutes;
      }
    }
  });
  
  return {
    employeeId,
    date,
    totalWorkMinutes: Math.max(0, totalWorkMinutes),
    totalOutsideAreaMinutes: Math.max(0, totalOutsideAreaMinutes),
    expectedWorkHours: 8,
    totalDataPoints: logsData.length,
    firstUpdate: logsData[0].device_timestamp,
    lastUpdate: logsData[logsData.length - 1].device_timestamp,
    activityPattern: analyzeActivityPattern(logsData)
  };
};

// Helper function untuk menganalisis pola aktivitas
const analyzeActivityPattern = (logsData) => {
  if (logsData.length === 0) return null;
  
  const pattern = {
    peakActivityHour: null,
    lowActivityHour: null,
    totalSwitches: 0,
    averageStayDuration: 0
  };
  
  // Analisis jam puncak aktivitas
  const hourlyActivity = {};
  let switches = 0;
  let prevStatus = null;
  
  logsData.forEach((log) => {
    const timestamp = log.device_timestamp?.toDate?.() || new Date(log.device_timestamp);
    const hour = timestamp.getHours();
    
    hourlyActivity[hour] = (hourlyActivity[hour] || 0) + 1;
    
    // Hitung perpindahan status
    if (prevStatus !== null && prevStatus !== log.in_geofence) {
      switches++;
    }
    prevStatus = log.in_geofence;
  });
  
  // Cari jam dengan aktivitas tertinggi
  let maxActivity = 0;
  for (const [hour, count] of Object.entries(hourlyActivity)) {
    if (count > maxActivity) {
      maxActivity = count;
      pattern.peakActivityHour = parseInt(hour);
    }
  }
  
  pattern.totalSwitches = switches;
  
  return pattern;
};

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

      // --- Logika untuk summary dan geofence ---
      const summaryDocId = `${employeeId}_${date}`;
      const summaryDocRef = doc(db, 'daily_summaries', summaryDocId);
      const summarySnapshot = await getDoc(summaryDocRef);
      
      if (summarySnapshot.exists()) {
        let summaryData = summarySnapshot.data();
        
        // Tambahkan perhitungan data tambahan jika belum ada
        if (!summaryData.expectedWorkHours) {
          summaryData.expectedWorkHours = 8; // Default 8 jam kerja
        }
        
        // Hitung data berdasarkan logs jika summary tidak lengkap
        if (logsData.length > 0) {
          summaryData = calculateEnhancedSummary(summaryData, logsData);
        }
        
        setSummary(summaryData);
      } else {
        // Jika tidak ada summary, hitung dari logs
        if (logsData.length > 0) {
          const calculatedSummary = calculateSummaryFromLogs(logsData, employeeId, date);
          setSummary(calculatedSummary);
        }
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