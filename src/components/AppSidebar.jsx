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

  // --- PALET WARNA BERDASARKAN SCREENSHOT ---
  const colors = {
    primary: '#1e8e3e',      // Warna hijau utama
    text: '#FFFFFF',          // Warna teks default (putih)
    textSecondary: '#E0E0E0', // Teks sedikit redup
    activeBg: '#FFFFFF',      // Latar belakang item aktif (putih)
    activeText: '#333333',    // Warna teks item aktif (gelap)
    hoverBg: '#1a7d37',       // Latar belakang saat hover (hijau lebih gelap)
  };

  const sidebarContainerStyle = {
    display: 'flex',
    height: '100dvh',
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.1)',
  };

  return (
    <div style={sidebarContainerStyle}>
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor={colors.primary}
        rootStyles={{
          color: colors.textSecondary,
          borderRight: 'none',
          transition: 'width 0.3s ease-in-out',
        }}
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => ({
              color: active ? colors.activeText : colors.text,
              justifyContent: 'center',
              backgroundColor: active ? colors.activeBg : 'transparent',
              padding: '12px 20px',
              margin: isCollapsed ? '5px 10px' : '5px 15px',
              borderRadius: '8px',
              fontWeight: active ? '600' : '500',
              transition: 'all 0.2s ease',
              '&:hover': {
                backgroundColor: active ? '#f2f2f2' : colors.hoverBg,
                color: active ? colors.activeText : colors.text,
              },
              // Gaya spesifik untuk sub-menu (level 1)
              ...(level === 1 && {
                // Gaya dasar untuk sub-menu item
                backgroundColor: active ? 'rgba(255, 255, 255, 0.9)' : 'transparent',
                color: active ? colors.activeText : colors.textSecondary,
                padding: '10px 20px 10px 30px',
                margin: '2px 15px',
                // Gaya HOVER yang disempurnakan
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)', // Latar belakang selalu hampir putih
                  color: colors.activeText,                   // Teks selalu menjadi gelap
                }
              }),
            }),
            icon: {
              fontSize: '1.2rem',
            },
            SubMenu: {
              // Styling untuk tombol induk SubMenu (cth: "Manajemen")
              '.ps-menu-button': {
                transition: 'background-color 0.2s ease',
                '&:hover': {
                  backgroundColor: colors.hoverBg,
                }
              },
              // Ini mencegah highlight pada tombol induk saat hover di atas anak-anaknya.
              // Logika ini lebih baik daripada solusi sebelumnya.
              '&.ps-open > .ps-menu-button': {
                backgroundColor: 'transparent !important',
                
              }
            },
          }}
        >
          {/* --- HEADER --- */}
          <div style={{
            padding: isCollapsed ? '20px 0' : '20px 25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '20px',
          }}>
            {!isCollapsed && (
              <span
                style={{
                  fontSize: '1.4rem',
                  fontWeight: 'bold',
                  color: colors.text,
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}
              >
                MandorApp
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: colors.textSecondary,
                fontSize: '1.3rem',
                margin: isCollapsed ? 'auto' : '0',
                padding: '5px'
              }}
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