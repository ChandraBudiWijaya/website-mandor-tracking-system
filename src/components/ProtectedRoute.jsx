import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

// Komponen ini menerima 'children', yaitu komponen halaman yang ingin dilindungi
const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    // Jika tidak ada pengguna yang login, redirect ke halaman /login
    return <Navigate to="/login" />;
  }

  // Jika sudah login, tampilkan halaman yang diminta
  return children;
};

export default ProtectedRoute;