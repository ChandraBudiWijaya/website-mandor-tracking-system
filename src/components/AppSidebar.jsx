import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaHistory, FaBars, FaTimes, FaUsersCog, FaUser, FaGlobe } from 'react-icons/fa'; // Menambah ikon untuk sub-menu

const AppSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  // --- START: Updated Styles & Structure ---

  // Gaya untuk container utama sidebar agar menempel di kiri dan tinggi penuh
  const sidebarContainerStyle = {
    display: 'flex',
    height: '100vh', // Menggunakan 100vh agar sidebar mengambil tinggi viewport penuh
    position: 'sticky',
    top: 0,
    zIndex: 1100,
    // Kita tidak akan memberikan lebar spesifik di sini,
    // biarkan react-pro-sidebar mengelola lebar saat collapsed/expanded.
    boxShadow: '2px 0 5px rgba(0, 0, 0, 0.05)', // Sedikit bayangan di sisi kanan sidebar
  };

  const menuItemBaseStyle = {
    // Warna teks default untuk menu item
    color: '#E0E0E0', // Abu-abu terang untuk teks item menu
    fontSize: '0.95rem', // Ukuran font sedikit lebih kecil
    fontWeight: '500', // Sedikit lebih tebal
  };

  const menuItemHoverActiveStyle = {
    // Warna teks dan latar belakang saat hover/active
    color: '#FFD700', // Kuning keemasan untuk highlight
    backgroundColor: '#1E2D3B', // Background lebih gelap dari #0b1d30 saat aktif/hover
  };

  const subMenuLabelStyle = {
    color: '#E0E0E0',
    fontSize: '0.95rem',
    fontWeight: '500',
  };

  return (
    <div style={sidebarContainerStyle}>
      <Sidebar
        collapsed={isCollapsed}
        backgroundColor="#1A2A38" // Warna latar belakang yang lebih gelap dan solid
        breakPoint="md"
        rootStyles={{
          // Gaya tambahan yang diterapkan ke elemen root Sidebar (jika diperlukan)
          borderRight: 'none', // Menghapus border default jika ada
        }}
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              // Gaya dasar untuk semua level menu item
              let style = { ...menuItemBaseStyle };

              if (level === 0) { // Gaya untuk menu item level atas (parent)
                style = {
                  ...style,
                  // Terapkan gaya hover/active di sini untuk level 0
                  '&:hover': {
                    ...menuItemHoverActiveStyle,
                    backgroundColor: '#1E2D3B', // Konsisten dengan active
                  },
                  backgroundColor: active ? '#1E2D3B' : 'transparent', // Latar belakang saat aktif
                  color: active ? '#FFD700' : '#E0E0E0', // Warna teks saat aktif
                };
              } else if (level === 1) { // Gaya untuk sub-menu item (child)
                style = {
                  ...style,
                  paddingLeft: '35px', // Indentasi untuk sub-menu
                  '&:hover': {
                    ...menuItemHoverActiveStyle,
                    backgroundColor: '#172430', // Sedikit lebih gelap dari parent hover
                  },
                  backgroundColor: active ? '#172430' : 'transparent',
                  color: active ? '#FFD700' : '#C0C0C0', // Sedikit berbeda untuk anak
                };
              }

              return style;
            },
            // Gaya untuk SubMenu label (bagian yang bisa diklik untuk membuka sub-item)
            subMenuContent: ({ active }) => ({
              backgroundColor: '#1E2D3B', // Background untuk konten sub-menu saat terbuka
              // Ini akan menjadi latar belakang dari drop-down menu
            }),
            label: ({ active }) => ({
              ...subMenuLabelStyle,
              color: active ? '#FFD700' : '#E0E0E0',
            }),
          }}
        >
          {/* Header/Toggle Button */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <FaBars /> : <FaTimes />}
            style={{
              textAlign: 'center',
              margin: '15px 0 25px 0', // Sedikit lebih banyak margin bawah
              color: '#FFD700', // Warna kuning keemasan untuk ikon toggle
              fontSize: '1.2rem', // Ukuran ikon toggle
            }}
          >
            {!isCollapsed && (
              <h2
                style={{
                  margin: 0,
                  fontSize: '1.3rem', // Ukuran font judul MENU
                  color: '#FFD700',
                  letterSpacing: '1px', // Tambah letter spacing
                  fontWeight: 'bold', // Lebih tebal
                }}
              >
                MENU
              </h2>
            )}
          </MenuItem>

          {/* Menu Item: Dasbor Real-time */}
          <MenuItem
            active={location.pathname === '/'}
            component={<Link to="/" />}
            icon={<FaTachometerAlt />}
          >
            Dasbor Real-time
          </MenuItem>

          {/* Menu Item: Riwayat Perjalanan */}
          <MenuItem
            active={location.pathname === '/history'}
            component={<Link to="/history" />}
            icon={<FaHistory />}
          >
            Riwayat Perjalanan
          </MenuItem>

          {/* SubMenu: Manajemen */}
          <SubMenu label="Manajemen" icon={<FaUsersCog />}>
            <MenuItem
              active={location.pathname === '/management/employees'}
              component={<Link to="/management/employees" />}
              icon={<FaUser />} // Ikon untuk Karyawan
            >
              Karyawan
            </MenuItem>
            <MenuItem
              active={location.pathname === '/management/geofences'}
              component={<Link to="/management/geofences" />}
              icon={<FaGlobe />} // Ikon untuk Area Kerja
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