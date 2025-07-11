// src/features/dashboard/components/EmployeeList.jsx

import React, { useState, useMemo } from 'react';
import { FaUsers } from 'react-icons/fa';
import EmployeeSearch from './EmployeeSearch';

// Komponen Placeholder/Avatar
const ProfileAvatar = ({ employee }) => {
  if (employee.photoURL) {
    return (
      <img
        src={employee.photoURL}
        alt={employee.name}
        className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2 border-white shadow-sm"
      />
    );
  }
  // [DARK MODE] Beri warna latar yang berbeda saat gelap
  return (
    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 dark:from-gray-600 dark:to-gray-700 flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm">
      {employee.name.charAt(0).toUpperCase()}
    </div>
  );
};

// Status indicator component
const StatusIndicator = ({ employee }) => {
  if (!employee.lastUpdate?.toDate) {
    return (
      <div className="w-4 h-4 rounded-full bg-gray-400 border-2 border-white shadow-sm flex items-center justify-center" title="Tidak ada data">
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>
    );
  }
  
  const now = new Date();
  const lastUpdate = employee.lastUpdate.toDate();
  const diffMinutes = (now - lastUpdate) / (1000 * 60);
  
  if (diffMinutes <= 5) {
    return (
      <div className="w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm animate-pulse flex items-center justify-center" title="Online">
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>
    );
  } else if (diffMinutes <= 60) {
    return (
      <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow-sm flex items-center justify-center" title="Baru saja aktif">
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>
    );
  } else {
    return (
      <div className="w-4 h-4 rounded-full bg-red-500 border-2 border-white shadow-sm flex items-center justify-center" title="Offline">
        <div className="w-2 h-2 rounded-full bg-white"></div>
      </div>
    );
  }
};


const EmployeeList = ({ locations, onEmployeeSelect, selectedEmployeeId, isCollapsed }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);

  const filteredEmployees = useMemo(() => {
    let employees = Object.values(locations);
    
    // Apply search filter
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      employees = employees.filter(loc =>
        loc.name.toLowerCase().includes(lowerCaseSearchTerm) ||
        loc.position.toLowerCase().includes(lowerCaseSearchTerm) ||
        loc.id.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    
    // Apply status filters
    if (activeFilters.length > 0) {
      employees = employees.filter(employee => {
        const now = new Date();
        const lastUpdate = employee.lastUpdate?.toDate?.();
        
        if (!lastUpdate) {
          return activeFilters.includes('offline');
        }
        
        const diffMinutes = (now - lastUpdate) / (1000 * 60);
        const diffHours = diffMinutes / 60;
        
        return activeFilters.some(filter => {
          switch (filter) {
            case 'online':
              return diffMinutes <= 5;
            case 'offline':
              return diffMinutes > 5;
            case 'recent':
              return diffHours <= 24;
            default:
              return true;
          }
        });
      });
    }
    
    return employees;
  }, [locations, searchTerm, activeFilters]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  // Tampilan saat sidebar tertutup (collapsed)
  if (isCollapsed) {
    return (
      <div className="h-full overflow-y-auto">
        <div className="p-2">
          <ul className="list-none p-0 m-0 space-y-2">
            {filteredEmployees.map(loc => {
              const isSelected = loc.id === selectedEmployeeId;
              return (
                <li key={loc.id}>
                  <button
                    onClick={() => onEmployeeSelect(loc.id)}
                    title={`${loc.name} - ${loc.position}`}
                    className={`
                      w-full flex justify-center items-center p-3 rounded-lg transition-all duration-200 
                      ${isSelected 
                        ? 'bg-green-600 shadow-lg scale-105' 
                        : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:scale-105 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="relative flex items-center justify-center">
                      <ProfileAvatar employee={loc} />
                      <div className="absolute -top-0.5 -right-0.5">
                        <StatusIndicator employee={loc} />
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          {filteredEmployees.length === 0 && (
            <div className="text-center text-gray-400 mt-8 p-2">
              <FaUsers className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
              <p className="text-xs">Tidak ada data</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Tampilan normal saat sidebar terbuka
  return (
    <div className="flex flex-col h-full">
      {/* Search and Filter Component */}
      <EmployeeSearch
        onSearchChange={handleSearchChange}
        onFilterChange={handleFilterChange}
        totalCount={Object.values(locations).length}
        filteredCount={filteredEmployees.length}
      />

      {/* Employee List */}
      <div className="flex-grow overflow-y-auto">
        <div className="px-4 pb-4">
          <ul className="list-none p-0 m-0 space-y-3">
            {filteredEmployees.length > 0 ? (
              filteredEmployees.map(loc => {
                const isSelected = loc.id === selectedEmployeeId;
                const lastUpdateTime = loc.lastUpdate?.toDate
                  ? loc.lastUpdate.toDate().toLocaleString('id-ID', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                  })
                  : 'N/A';

                return (
                  <li
                    key={loc.id}
                    onClick={() => onEmployeeSelect(loc.id)}
                    className={`
                      rounded-xl cursor-pointer transition-all duration-300 flex items-center p-4 gap-3 transform hover:scale-[1.02]
                      ${isSelected 
                        ? 'bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-500/25' 
                        : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md'
                      }
                    `}
                  >
                    <div className="relative flex items-center justify-center">
                      <ProfileAvatar employee={loc} />
                      <div className="absolute -top-0.5 -right-0.5">
                        <StatusIndicator employee={loc} />
                      </div>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className={`font-semibold text-base truncate ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                        {loc.name}
                      </p>
                      <p className={`text-sm truncate ${isSelected ? 'text-green-100' : 'text-gray-600 dark:text-gray-400'}`}>
                        {loc.position}
                      </p>
                      <p className={`text-xs mt-1 ${isSelected ? 'text-green-200' : 'text-gray-500 dark:text-gray-400'}`}>
                        Update: {lastUpdateTime}
                      </p>
                    </div>
                  </li>
                );
              })
            ) : (
              <div className="text-center text-gray-500 dark:text-gray-400 mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="mb-3">
                  <FaUsers className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600" />
                </div>
                <p className="font-medium text-lg mb-2">
                  {searchTerm || activeFilters.length > 0 
                    ? "Tidak ada karyawan yang sesuai filter" 
                    : "Tidak ada data karyawan"
                  }
                </p>
                {(searchTerm || activeFilters.length > 0) && (
                  <p className="text-sm">Coba ubah kata kunci pencarian atau filter</p>
                )}
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeList;