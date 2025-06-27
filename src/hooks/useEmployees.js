import { useState, useEffect } from 'react';
import { db } from '../api/firebaseConfig'; // <-- Path relatif dari hooks ke api
import { collection, getDocs } from 'firebase/firestore';

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []); // <-- Array dependensi kosong agar hanya berjalan sekali

    return { employees, loading, setEmployees };
};