import { useState, useEffect } from 'react';
import { db } from '../../../api/firebaseConfig'; // Pastikan path ini benar
import { collection, query, orderBy, limit, onSnapshot, getDocs } from 'firebase/firestore';

/**
 * React Hook untuk mendapatkan lokasi real-time dari semua karyawan.
 * Disesuaikan untuk struktur data Firestore yang dioptimalkan.
 */
export const useRealtimeLocations = () => {
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState({});
  const [loading, setLoading] = useState(true);

  // Fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
  const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Efek pertama: Ambil daftar semua karyawan sekali saja
  useEffect(() => {
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
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Efek kedua: Buat listener real-time setelah daftar karyawan didapatkan
  useEffect(() => {
    if (employees.length === 0) {
        // Jika tidak ada karyawan, hentikan loading
        setLoading(false);
        return;
    }

    const today = getTodayDateString();
    const dailyLogCollectionName = `logs_${today}`;

    // Buat listener untuk setiap karyawan
    const unsubscribers = employees.map(employee => {
      // <<< PERUBAHAN UTAMA: Path query diubah ke sub-koleksi harian >>>
      const logCollectionPath = `employees/${employee.id}/${dailyLogCollectionName}`;
      
      const q = query(
        collection(db, logCollectionPath),
        // <<< PERUBAHAN: Urutkan berdasarkan 'device_timestamp' >>>
        orderBy('device_timestamp', 'desc'),
        limit(1)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const lastLog = snapshot.docs[0].data();
          
          // Update state lokasi untuk karyawan ini
          setLocations(prevLocations => ({
            ...prevLocations,
            [employee.id]: {
              ...employee, // Gabungkan data profil karyawan
              lat: lastLog.lat,
              lng: lastLog.lng,
              // <<< PERUBAHAN: Gunakan 'device_timestamp' untuk waktu update terakhir >>>
              lastUpdate: lastLog.device_timestamp, 
            }
          }));
        }
        // Jika snapshot kosong, berarti belum ada data hari ini.
        // Anda bisa menambahkan logika untuk menampilkan status "Tidak Aktif".
      }, (error) => {
        // Menangani error, misalnya jika sub-koleksi belum ada
        console.warn(`Could not fetch location for ${employee.id} on ${today}. Collection might not exist yet. Error:`, error.code);
      });

      return unsubscribe;
    });

    setLoading(false);

    // Cleanup: Hentikan semua listener saat komponen tidak lagi digunakan
    return () => unsubscribers.forEach(unsub => unsub());

  }, [employees]); // Jalankan efek ini ketika daftar karyawan sudah didapat

  return { locations, loading };
};
