// src/components/AppSidebar.jsx

import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaHistory,
  FaBars,
  FaUsersCog,
  FaUser,
  FaGlobe
} from 'react-icons/fa';

const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const colors = {
    primary: '#1e8e3e',
    activeBg: '#FFFFFF',
    activeText: '#333333',
    hoverBg: '#1a7d37',
  };

  return (
    <div className="flex h-dvh sticky top-0 z-[1100] shadow-[2px_0px_10px_rgba(0,0,0,0.1)]">
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor={colors.primary}
        rootStyles={{
          color: '#E0E0E0',
          borderRight: 'none',
          transition: 'all 0.3s ease-in-out',
        }}
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => ({
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',

              color: active ? colors.activeText : '#FFFFFF',
              backgroundColor: active ? colors.activeBg : 'transparent',
              margin: isCollapsed ? '5px 10px' : '5px 15px',
              borderRadius: '8px',
              fontWeight: active ? '600' : '500',
              padding: level === 1 ? '10px 20px 10px 30px' : '12px 20px',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: active ? '#f2f2f2' : colors.hoverBg,
                color: active ? colors.activeText : '#fffff9',
              },
              ...(level === 1 && active && {
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: colors.activeText,
              }),
              ...(level === 1 && {
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  color: colors.activeText,
                }
              })
            }),
            icon: {
              fontSize: '1.2rem',
              // Menjaga agar warna ikon tetap saat item aktif
              color: 'inherit',
            },
            SubMenu: {
              '.ps-menu-button': {
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: colors.hoverBg,
                }
              },
              
              '&.ps-open > .ps-menu-button': {
                backgroundColor: 'transparent !important',
              }
            },
            subMenuContent: {
              backgroundColor: colors.primary,
            }
          }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between mb-5 ${isCollapsed ? 'p-5 py-5' : 'px-6 py-5'}`}>
            {!isCollapsed && (
              <span className="text-xl font-bold text-white uppercase tracking-wider">
                MandorApp
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={`bg-none border-none cursor-pointer text-gray-300 text-xl p-1.5 ${isCollapsed ? 'mx-auto' : ''}`}
            >
              <FaBars />
            </button>
          </div>

          <MenuItem
            active={location.pathname === '/'}
            component={<Link to="/" />}
            icon={<FaTachometerAlt />}
          >
            Dasbor
          </MenuItem>

          <MenuItem
            active={location.pathname === '/history'}
            component={<Link to="/history" />}
            icon={<FaHistory />}
          >
            Riwayat
          </MenuItem>

          <SubMenu
            label="Manajemen"
            icon={<FaUsersCog />}
            defaultOpen={location.pathname.startsWith('/management')}
          >
            <MenuItem
              active={location.pathname === '/management/employees'}
              component={<Link to="/management/employees" />}
              icon={<FaUser />}
            >
              Karyawan
            </MenuItem>
            <MenuItem
              active={location.pathname === '/management/geofences'}
              component={<Link to="/management/geofences" />}
              icon={<FaGlobe />}
            >
              Area Kerja
            </MenuItem>
          </SubMenu>
        </Menu>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;