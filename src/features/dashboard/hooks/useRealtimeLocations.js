import { useState, useEffect } from 'react';
import { db } from '../../../api/firebaseConfig';
import { collection, query, where, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';

export const useRealtimeLocations = () => {
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Ambil daftar semua karyawan sekali saja saat komponen dimuat
    const fetchEmployees = async () => {
      try {
        const employeesCollection = collection(db, 'employees');
        const employeeSnapshot = await getDocs(employeesCollection);
        const employeeList = employeeSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setEmployees(employeeList);
      } catch (error) {
        console.error("Error fetching employees: ", error);
      }
    };

    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length === 0) return;

    // 2. Untuk setiap karyawan, buat listener real-time untuk posisi terakhir mereka
    const unsubscribers = employees.map(employee => {
      const q = query(
        collection(db, 'tracking_logs'),
        where('index_karyawan', '==', employee.id),
        orderBy('timestamp', 'desc'),
        limit(1)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const lastLog = snapshot.docs[0].data();
          setLocations(prevLocations => ({
            ...prevLocations,
            [employee.id]: {
              ...employee, // Gabungkan data karyawan
              lat: lastLog.lat,
              lng: lastLog.lng,
              lastUpdate: lastLog.timestamp,
            }
          }));
        }
      });
      return unsubscribe;
    });

    setLoading(false);

    // 3. Cleanup: Hentikan semua listener saat komponen tidak lagi digunakan
    return () => unsubscribers.forEach(unsub => unsub());

  }, [employees]); // Jalankan efek ini ketika daftar karyawan sudah didapat

  return { locations, loading };
};