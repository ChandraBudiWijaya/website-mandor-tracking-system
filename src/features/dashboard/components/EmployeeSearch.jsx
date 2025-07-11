// src/features/dashboard/components/EmployeeSearch.jsx

import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton, Chip, Menu, MenuItem } from '@mui/material';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';

const EmployeeSearch = ({ onSearchChange, onFilterChange, totalCount, filteredCount }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterAnchor, setFilterAnchor] = useState(null);
  const [activeFilters, setActiveFilters] = useState([]);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    onSearchChange(value);
  };

  const handleFilterClick = (event) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleFilterSelect = (filterType) => {
    let newFilters;
    if (activeFilters.includes(filterType)) {
      newFilters = activeFilters.filter(f => f !== filterType);
    } else {
      newFilters = [...activeFilters, filterType];
    }
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
    handleFilterClose();
  };

  const removeFilter = (filterToRemove) => {
    const newFilters = activeFilters.filter(f => f !== filterToRemove);
    setActiveFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearchChange('');
  };

  const filterOptions = [
    { key: 'online', label: 'Online', description: 'Update dalam 5 menit terakhir' },
    { key: 'offline', label: 'Offline', description: 'Tidak ada update > 5 menit' },
    { key: 'recent', label: 'Aktif Hari Ini', description: 'Update dalam 24 jam terakhir' }
  ];

  return (
    <div className="space-y-3 p-4 border-b border-gray-200 dark:border-gray-700">
      {/* Search Bar */}
      <div className="relative">
        <TextField
          fullWidth
          size="small"
          placeholder="Cari nama, posisi, atau ID karyawan..."
          value={searchTerm}
          onChange={handleSearchChange}
          variant="outlined"
          className="bg-white dark:bg-gray-700"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FaSearch className="text-gray-400 w-4 h-4" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={clearSearch}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-3 h-3" />
                </IconButton>
              </InputAdornment>
            ),
            className: "dark:text-gray-200"
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgb(209 213 219)', // gray-300
              },
              '&:hover fieldset': {
                borderColor: 'rgb(107 114 128)', // gray-500
              },
              '&.Mui-focused fieldset': {
                borderColor: 'rgb(59 130 246)', // blue-500
              },
            },
          }}
        />
      </div>

      {/* Filter Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <IconButton
            size="small"
            onClick={handleFilterClick}
            className={`${activeFilters.length > 0 
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' 
              : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
            } hover:bg-gray-200 dark:hover:bg-gray-600`}
          >
            <MdFilterList className="w-4 h-4" />
          </IconButton>
          
          {activeFilters.map((filter) => {
            const filterOption = filterOptions.find(opt => opt.key === filter);
            return (
              <Chip
                key={filter}
                label={filterOption?.label}
                size="small"
                onDelete={() => removeFilter(filter)}
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                deleteIcon={<FaTimes className="w-3 h-3" />}
              />
            );
          })}
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {searchTerm || activeFilters.length > 0 
            ? `${filteredCount} dari ${totalCount} karyawan`
            : `${totalCount} karyawan`
          }
        </div>
      </div>

      {/* Filter Menu */}
      <Menu
        anchorEl={filterAnchor}
        open={Boolean(filterAnchor)}
        onClose={handleFilterClose}
        PaperProps={{
          className: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg'
        }}
      >
        {filterOptions.map((option) => (
          <MenuItem
            key={option.key}
            onClick={() => handleFilterSelect(option.key)}
            className={`${activeFilters.includes(option.key) 
              ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' 
              : 'text-gray-700 dark:text-gray-300'
            } hover:bg-gray-100 dark:hover:bg-gray-700`}
          >
            <div>
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
            </div>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

export default EmployeeSearch;
