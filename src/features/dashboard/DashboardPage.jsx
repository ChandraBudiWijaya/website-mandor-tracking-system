import React, { useState } from 'react';
import LiveMap from './components/LiveMap';
import EmployeeList from './components/EmployeeList';
import { useRealtimeLocations } from './hooks/useRealtimeLocations';
import { Box, Typography, CircularProgress, IconButton } from '@mui/material';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function DashboardPage() {
  const { locations, loading } = useRealtimeLocations();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isEmployeeListCollapsed, setIsEmployeeListCollapsed] = useState(false);

  const handleEmployeeSelect = (employeeId) => {
    setSelectedEmployeeId(prevId => prevId === employeeId ? null : employeeId);
  };

  const toggleEmployeeListCollapse = () => {
    setIsEmployeeListCollapsed(prevState => !prevState);
  };

  const dashboardPageContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    height: 'calc(100vh - 70px)', // Tetap ini, tapi perlu hati-hati
    width: '100%',
    overflow: 'hidden',
    backgroundColor: '#F8F9FA',
    padding: '20px',
    gap: '20px',
    boxSizing: 'border-box',
    transition: 'gap 0.2s ease',
  };

  const employeeListSectionStyle = {
    flexShrink: 0,
    width: isEmployeeListCollapsed ? '60px' : '320px',
    minWidth: isEmployeeListCollapsed ? '60px' : '280px',
    maxWidth: isEmployeeListCollapsed ? '60px' : '350px',
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    overflowY: isEmployeeListCollapsed ? 'hidden' : 'auto',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'width 0.3s ease, min-width 0.3s ease, max-width 0.3s ease, padding 0.3s ease',
  };

  const mapSectionStyle = {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden', // Pertahankan ini jika Anda memerlukannya
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // --- START: Tambahan Padding Internal untuk Peta ---
    padding: '5px', // Tambahkan padding internal sedikit, misal 5px
    // Ini akan memberi ruang ekstra di dalam 'card' peta untuk tombol kontrol
    // --- END: Tambahan Padding Internal untuk Peta ---
  };

  const loadingOverlayStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    zIndex: 5,
    position: 'absolute',
    top: 0,
    left: 0,
  };

  // --- START: Updated Toggle Button Styles and Placement ---

  // Gaya untuk container header di dalam EmployeeList
  const employeeListHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between', // Untuk menempatkan judul dan tombol di ujung
    alignItems: 'center',
    marginBottom: '15px', // Jarak antara header dan daftar karyawan
    paddingBottom: '10px', // Padding bawah untuk border
    borderBottom: '1px solid #eee', // Garis pemisah
    position: 'sticky', // Untuk membuat header tetap di atas saat scroll (jika EmployeeList sangat panjang)
    top: 0,
    backgroundColor: '#FFFFFF', // Pastikan background sama dengan card
    zIndex: 1, // Agar di atas konten saat scroll
  };

  const toggleButtonStyle = {
    // Tombol tidak lagi absolute di sini, jadi gaya posisi dihilangkan
    backgroundColor: '#2b8c3d',
    color: 'white',
    borderRadius: '50%',
    padding: '5px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    zIndex: 10,
    border: 'none', // Tidak perlu border jika di dalam header
  };

  // --- END: Updated Toggle Button Styles and Placement ---

  return (
    <div style={dashboardPageContainerStyle}>
      <div style={employeeListSectionStyle}>
        {/* Header untuk Daftar Karyawan dengan Tombol Toggle */}
        <div style={employeeListHeaderStyle}>
          {!isEmployeeListCollapsed && ( // Judul hanya tampil saat tidak collapsed
            <Typography variant="h6" sx={{ color: '#333', fontWeight: 600, margin: 0 }}>
              Daftar Karyawan
            </Typography>
          )}
          <IconButton
            onClick={toggleEmployeeListCollapse}
            sx={toggleButtonStyle}
            size="small"
            // Tambahkan margin kiri jika teks tidak tampil untuk membuat jarak dari kiri saat collapsed
            style={isEmployeeListCollapsed ? { marginLeft: 'auto' } : {}} // Posisikan ke kanan saat collapsed
          >
            {isEmployeeListCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </IconButton>
        </div>

        {/* Konten Daftar Karyawan */}
        {!isEmployeeListCollapsed && ( // Konten hanya tampil saat tidak collapsed
          loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1 }}>
              <CircularProgress size={30} sx={{ color: 'primary.main' }} /> {/* Gunakan primary.main */}
              <Typography variant="body2" sx={{ ml: 2, color: '#555' }}>
                Memuat data karyawan...
              </Typography>
            </Box>
          ) : (
            <EmployeeList
              locations={locations}
              onEmployeeSelect={handleEmployeeSelect}
              selectedEmployeeId={selectedEmployeeId}
            />
          )
        )}
      </div>

      <div style={mapSectionStyle}>
        {loading && (
          <div style={loadingOverlayStyle}>
            <CircularProgress size={50} sx={{ color: 'primary.main' }} /> {/* Gunakan primary.main */}
            <Typography variant="h6" sx={{ mt: 2, color: '#333' }}>
              Memuat Peta...
            </Typography>
          </div>
        )}
        <LiveMap
          locations={locations}
          selectedEmployeeId={selectedEmployeeId}
        />
      </div>
    </div>
  );
}

export default DashboardPage;