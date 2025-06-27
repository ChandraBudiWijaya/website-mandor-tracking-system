import React from 'react';
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';

// Impor Komponen Halaman
import DashboardPage from './features/dashboard/DashboardPage';
import HistoryPage from './features/history/HistoryPage';
import LoginPage from './features/auth/LoginPage';
import EmployeeManagementPage from './features/management/EmployeeManagementPage';
import GeofenceManagementPage from './features/management/GeofenceManagementPage';

// Impor Komponen Layout & Utilitas
import AppSidebar from './components/AppSidebar';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // <-- Impor penjaga rute

function App() {
  const location = useLocation();

  // Tentukan apakah sidebar dan navbar harus ditampilkan
  // Kita tidak ingin menampilkannya di halaman login
  const showLayout = location.pathname !== '/login';

  return (
    <>
      {/* Jika bukan halaman login, tampilkan layout utama */}
      {showLayout ? (
        <div className="app-wrapper">
          <Navbar />
          <div className="main-layout">
            <AppSidebar />
            <main className="main-content">
              <Routes>
                {/* Rute-rute ini sekarang dilindungi oleh ProtectedRoute */}
                <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                <Route path="/management/employees" element={<ProtectedRoute><EmployeeManagementPage /></ProtectedRoute>} />
                <Route path="/management/geofences" element={<ProtectedRoute><GeofenceManagementPage /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </div>
      ) : (
        // Jika ini halaman login, tampilkan hanya komponen LoginPage
        <Routes>
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;