// src/features/dashboard/DashboardPage.jsx

import React, { useState } from 'react';
import LiveMap from './components/LiveMap';
import EmployeeList from './components/EmployeeList';
import { useRealtimeLocations } from './hooks/useRealtimeLocations';
import { IconButton } from '@mui/material';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import CircularProgress from '@mui/material/CircularProgress';

function DashboardPage() {
  const { locations, loading } = useRealtimeLocations();
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [isEmployeeListCollapsed, setIsEmployeeListCollapsed] = useState(false);

  const handleEmployeeSelect = (employeeId) => {
    // [PERUBAHAN] Logika untuk membuka sidebar dihapus.
    // Sekarang hanya fokus untuk memilih karyawan.
    setSelectedEmployeeId(prevId => prevId === employeeId ? null : employeeId);
  };

  const toggleEmployeeListCollapse = () => {
    setIsEmployeeListCollapsed(prevState => !prevState);
  };

  return (
    <div className="flex flex-row h-[calc(100vh-70px)] w-full bg-gray-100">

      {/* Kolom Sidebar Karyawan */}
      <div
        className={`flex flex-col bg-white shadow-lg transition-all duration-300 ease-in-out ${isEmployeeListCollapsed ? 'w-24' : 'w-80'}`}
      >
        <div className="flex items-center p-4 border-b border-gray-200">
          {!isEmployeeListCollapsed && (
            <h2 className="text-lg font-semibold text-gray-800 m-0 flex-grow">
              Daftar Karyawan
            </h2>
          )}
          <IconButton
            onClick={toggleEmployeeListCollapse}
            size="small"
            className="bg-gray-200 hover:bg-gray-300"
          >
            {isEmployeeListCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
          </IconButton>
        </div>
        <div className="overflow-y-auto flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          ) : (
            <EmployeeList
              locations={locations}
              onEmployeeSelect={handleEmployeeSelect}
              selectedEmployeeId={selectedEmployeeId}
              isCollapsed={isEmployeeListCollapsed}
            />
          )}
        </div>
      </div>

      {/* Kolom Peta */}
      <div className="flex-grow">
        <LiveMap
          locations={locations}
          selectedEmployeeId={selectedEmployeeId}
        />
      </div>
    </div>
  );
}

export default DashboardPage;