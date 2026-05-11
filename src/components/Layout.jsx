import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider'; 

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme(); // Tema bilgisini alıyoruz

  // Alt menü sekmelerimiz
  const navItems = [
    { path: '/matches', icon: '✨', label: 'Keşif' },
    { path: '/chats', icon: '💬', label: 'Mesajlar' },
    { path: '/profile', icon: '👤', label: 'Profil' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      
      {/* ÜST KISIM: Hangi sayfadaysak o sayfanın içeriği buraya gelecek */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px', position: 'relative' }}>
        <Outlet />
        
        {/* TEMA DEĞİŞTİRME BUTONU (Geçici olarak burada, test edebilmen için) */}
        <button 
          onClick={toggleTheme}
          style={{
            position: 'absolute',
            top: 'var(--space-3)',
            right: 'var(--space-3)',
            padding: 'var(--space-2) var(--space-3)',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--surface-primary)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-medium)',
            boxShadow: 'var(--shadow-soft)'
          }}
          className="interactive-element"
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>
      </div>

      {/* ALT MENÜ (Premium Bottom Navigation) */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'var(--bg-surface)',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '12px 0 20px 0', 
        borderTop: '1px solid var(--border-subtle)',
        backdropFilter: 'blur(10px)', 
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1000
      }}>
        {navItems.map(item => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="interactive-element"
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-1)',
                cursor: 'pointer',
                flex: 1,
                transition: 'color var(--transition-fast)'
              }}
            >
              <span style={{ 
                fontSize: '20px', 
                filter: isActive ? 'none' : 'grayscale(100%) opacity(0.7)' 
              }}>
                {item.icon}
              </span>
              <span style={{ 
                fontSize: '11px', 
                fontWeight: isActive ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)' 
              }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

    </div>
  );
}