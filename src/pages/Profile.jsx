import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { getErrorMessage } from '../utils/getErrorMessage';
import { User, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider'; 

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/Auth/my-profile');
        setProfile(response.data);
      } catch (error) {
        console.error("Hata detayı:", error);
        toast.error(getErrorMessage(error)); 
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast('Çıkış yapıldı.', { icon: '👋' });
    navigate('/login', { replace: true });
  };

  const nickname = profile?.nickname || profile?.Nickname || 'Kullanıcı';
  const realName = profile?.realName || profile?.RealName || '';
  const bio = profile?.bio || profile?.Bio || '';
  const initial = nickname !== 'Kullanıcı' ? nickname.charAt(0).toUpperCase() : '?';

  return (
    <div className="page-transition" style={{ maxWidth: '520px', margin: '0 auto', padding: 'var(--space-4)', paddingBottom: '100px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-2)' }}>
        <User size={20} color="var(--text-primary)" />
        <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 'var(--font-size-xl)' }}>
          Profil
        </h2>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-muted)', textAlign: 'center', fontSize: 'var(--font-size-sm)', marginTop: 'var(--space-6)' }}>Kimlik doğrulanıyor...</p>
      ) : profile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          
          <div style={{ backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5) var(--space-4)', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: 'var(--shadow-soft)', backdropFilter: 'blur(10px)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--bg-primary)', fontWeight: 'bold', fontSize: '32px', marginBottom: 'var(--space-3)' }}>
              {initial}
            </div>
            <h3 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)' }}>@{nickname}</h3>
            {realName && <p style={{ margin: '0 0 var(--space-3) 0', color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{realName}</p>}
            
            {bio ? (
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center', fontStyle: 'italic', backgroundColor: 'var(--surface-hover)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', width: '100%', boxSizing: 'border-box' }}>"{bio}"</p>
            ) : (
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center' }}>Sistem kaydı kısıtlı. Bilgi yok.</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <div style={{ flex: 1, backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <p style={{ margin: '0 0 4px 0', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Durum</p>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-medium)' }}>Aktif</h4>
            </div>
            <div style={{ flex: 1, backgroundColor: 'var(--surface-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: 'var(--space-3)', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <p style={{ margin: '0 0 4px 0', color: 'var(--text-muted)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>Yetki</p>
              <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: 'var(--font-size-md)', fontWeight: 'var(--font-weight-medium)' }}>Standart</h4>
            </div>
          </div>

        </div>
      ) : (
        <p style={{ color: 'var(--accent-primary)', textAlign: 'center', marginTop: '50px' }}>Profil bilgileri bulunamadı.</p>
      )}

      {/* BUTONLAR BÖLGESİ */}
      <div style={{ marginTop: 'var(--space-5)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        
        <button 
          onClick={toggleTheme}
          className="interactive-element"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)', backdropFilter: 'blur(10px)' }}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? 'Aydınlık Temaya Geç' : 'Karanlık Temaya Geç'}
        </button>

        <button 
          onClick={() => navigate('/profile/edit')}
          className="interactive-element"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', backgroundColor: 'var(--text-primary)', color: 'var(--bg-primary)', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)' }}
        >
          <Settings size={18} /> Yapılandırma
        </button>

        <button 
          onClick={handleLogout}
          className="interactive-element"
          style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', backgroundColor: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}
        >
          <LogOut size={18} /> Sistemi Kapat
        </button>
      </div>

    </div>
  );
}