// src/features/dashboard/components/EmployeeList.jsx

import React, { useState, useMemo } from 'react';

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
    <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
      {employee.name.charAt(0).toUpperCase()}
    </div>
  );
};


const EmployeeList = ({ locations, onEmployeeSelect, selectedEmployeeId, isCollapsed }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    if (!searchTerm) {
      return Object.values(locations);
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return Object.values(locations).filter(loc =>
      loc.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      loc.position.toLowerCase().includes(lowerCaseSearchTerm) ||
      loc.id.toLowerCase().includes(lowerCaseSearchTerm)
    );
  }, [locations, searchTerm]);

  // Tampilan saat sidebar tertutup (collapsed)
  if (isCollapsed) {
    return (
      <ul className="list-none p-2 m-0">
        {filteredEmployees.map(loc => {
          const isSelected = loc.id === selectedEmployeeId;
          return (
            <li key={loc.id} title={loc.name}>
              <button
                onClick={() => onEmployeeSelect(loc.id)}
                className={`w-full flex justify-center items-center p-2 my-1 rounded-lg transition-all duration-200 ${isSelected ? 'bg-green-700' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                <ProfileAvatar employee={loc} />
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  // Tampilan normal saat sidebar terbuka
  return (
    <div className="flex flex-col h-full px-4 pt-2 pb-4">
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="Cari Karyawan..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-lg text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <ul className="list-none p-0 m-0 flex-grow overflow-y-auto">
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
                  mb-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center p-3 gap-3
                  ${isSelected 
                    ? 'bg-green-700 text-white shadow-md' 
                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                  }
                `}
              >
                <ProfileAvatar employee={loc} />
                <div className="flex-grow">
                  <p className={`font-semibold text-base ${isSelected ? 'text-white' : 'text-gray-900 dark:text-gray-100'}`}>
                    {loc.name}
                  </p>
                  <p className={`text-sm ${isSelected ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
                    {loc.position}
                  </p>
                  <p className={`text-xs mt-1 ${isSelected ? 'text-gray-300' : 'text-gray-500 dark:text-gray-400'}`}>
                    Update: {lastUpdateTime}
                  </p>
                </div>
              </li>
            );
          })
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-4">
            <p>{searchTerm ? "Tidak ada karyawan ditemukan." : "Tidak ada data karyawan."}</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default EmployeeList;