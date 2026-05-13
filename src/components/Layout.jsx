import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../theme/ThemeProvider'; 
import { Sparkles, MessageCircle, User } from 'lucide-react';

import lightBg from '../assets/bg-light.png';
import darkBg from '../assets/bg-dark.png';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const navItems = [
    { path: '/matches', icon: Sparkles, label: 'Keşif' },
    { path: '/chats', icon: MessageCircle, label: 'Mesajlar' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      backgroundImage: `url(${theme === 'light' ? lightBg : darkBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative'
    }}>
      
      {/* SİHİRLİ BLUR KATMANI */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.4)' : 'rgba(10, 10, 10, 0.5)',
        backdropFilter: 'blur(16px)', 
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 0,
        pointerEvents: 'none'
      }}></div>

      {/* ÜST KISIM */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '80px', position: 'relative', zIndex: 1 }}>
        <Outlet />
      </div>

      {/* ALT MENÜ */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '520px',
        backgroundColor: 'var(--surface-primary)', 
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
          const IconComponent = item.icon; 

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
              <IconComponent size={24} strokeWidth={isActive ? 2.5 : 2} />
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