import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react'; // <-- Tambahkan useCallback
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  setPersistence,
  browserSessionPersistence,
} from 'firebase/auth';

import { app } from '../api/firebaseConfig';

const auth = getAuth(app);
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 menit untuk inaktivitas

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const activityTimerRef = useRef(null);

  // --- Menggunakan useCallback untuk fungsi logout agar stabil ---
  const logout = useCallback(() => {
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
      activityTimerRef.current = null;
      console.log("Activity timer cleared on manual logout.");
    }
    return signOut(auth);
  }, []); // Dependency array kosong karena auth dan signOut adalah referensi yang stabil (dari luar komponen)

  // --- Menggunakan useCallback untuk fungsi resetActivityTimer agar stabil ---
  const resetActivityTimer = useCallback(() => {
    // Hapus timer yang ada
    if (activityTimerRef.current) {
      clearTimeout(activityTimerRef.current);
    }
    // Set timer baru hanya jika ada pengguna yang login
    if (currentUser) { // Fungsi ini tergantung pada currentUser
      activityTimerRef.current = setTimeout(() => {
        console.log("User logged out due to inactivity.");
        logout(); // Fungsi ini tergantung pada logout
      }, SESSION_TIMEOUT_MS);
    }
  }, [currentUser, logout]); // <-- Dependency array untuk resetActivityTimer: currentUser dan logout

  // Fungsi login (tetap seperti yang Anda miliki)
  async function login(email, password) {
    try {
      await setPersistence(auth, browserSessionPersistence);
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user);
      setLoading(false);

      if (user) {
        // Panggil resetActivityTimer yang sudah distabilkan
        resetActivityTimer();
      } else {
        if (activityTimerRef.current) {
          clearTimeout(activityTimerRef.current);
          activityTimerRef.current = null;
          console.log("Activity timer cleared on auth state change (user logged out).");
        }
      }
    });

    const activityEvents = ['mousemove', 'keydown', 'click', 'scroll'];
    activityEvents.forEach(event => {
      // Tambahkan event listener menggunakan resetActivityTimer yang stabil
      window.addEventListener(event, resetActivityTimer);
    });

    return () => {
      unsubscribe();
      if (activityTimerRef.current) {
        clearTimeout(activityTimerRef.current);
      }
      activityEvents.forEach(event => {
        // Hapus event listener menggunakan resetActivityTimer yang stabil
        window.removeEventListener(event, resetActivityTimer);
      });
      console.log("AuthContext cleanup complete.");
    };
  }, [resetActivityTimer]); // <-- Tambahkan resetActivityTimer sebagai dependency

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}