import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  // Alt menü sekmelerimiz
  const navItems = [
    { path: '/matches', icon: '🔍', label: 'Keşif' },
    { path: '/chats', icon: '💬', label: 'Mesajlar' },
    { path: '/profile', icon: '👤', label: 'Profil' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: '#0f172a' }}>
      
      {/* ÜST KISIM: Hangi sayfadaysak o sayfanın içeriği buraya gelecek (Outlet) */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '70px' }}>
        <Outlet />
      </div>

      {/* ALT MENÜ (Bottom Navigation) */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '500px',
        backgroundColor: '#1e293b',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px 0',
        borderTop: '1px solid #334155',
        boxShadow: '0 -4px 10px rgba(0,0,0,0.3)',
        zIndex: 1000
      }}>
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: isActive ? '#7c3aed' : '#94a3b8',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                flex: 1
              }}
            >
              <span style={{ fontSize: '22px', filter: isActive ? 'none' : 'grayscale(100%)' }}>{item.icon}</span>
              <span style={{ fontSize: '12px', fontWeight: isActive ? 'bold' : 'normal' }}>{item.label}</span>
            </button>
          );
        })}
      </div>

    </div>
  );
}