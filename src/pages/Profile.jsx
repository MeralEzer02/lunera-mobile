import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/Auth/my-profile');
        setProfile(response.data);
      } catch (error) {
        console.error("Profil çekilemedi:", error);
        toast.error("Profil bilgileri yüklenemedi.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast('Başarıyla çıkış yapıldı.', { icon: '👋' });
    navigate('/login', { replace: true });
  };

  const handleEditProfile = () => {
    toast('Düzenleme moduna geçiliyor...', { icon: '⚙️' });
  };

  const nickname = profile?.nickname || profile?.Nickname || 'Kullanıcı';
  const realName = profile?.realName || profile?.RealName || '';
  const bio = profile?.bio || profile?.Bio || '';
  const initial = nickname !== 'Kullanıcı' ? nickname.charAt(0).toUpperCase() : '?';

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      <h2 style={{ color: '#fff', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px', textAlign: 'left' }}>
        Profilim 👤
      </h2>

      {loading ? (
        <p style={{ color: '#888', textAlign: 'center', marginTop: '50px' }}>Kimlik doğrulanıyor...</p>
      ) : profile ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ backgroundColor: '#111', border: '1px solid #334155', borderRadius: '16px', padding: '30px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#7c3aed', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 'bold', fontSize: '32px', marginBottom: '15px', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)' }}>
              {initial}
            </div>
            <h3 style={{ margin: '0 0 5px 0', color: '#fff', fontSize: '22px' }}>@{nickname}</h3>
            {realName && <p style={{ margin: '0 0 15px 0', color: '#94a3b8', fontSize: '15px' }}>{realName}</p>}
            {bio ? (
              <p style={{ margin: 0, color: '#e2e8f0', fontSize: '14px', textAlign: 'center', fontStyle: 'italic', backgroundColor: '#1e293b', padding: '10px 15px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}>"{bio}"</p>
            ) : (
              <p style={{ margin: 0, color: '#64748b', fontSize: '13px', textAlign: 'center' }}>Gizemli bir ajan. Kendinden bahsetmemiş.</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ flex: 1, backgroundColor: '#111', border: '1px solid #334155', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '12px' }}>Durum</p>
              <h4 style={{ margin: 0, color: '#10b981', fontSize: '16px' }}>{profile?.status === 1 ? 'Aktif' : 'Aktif'}</h4>
            </div>
            <div style={{ flex: 1, backgroundColor: '#111', border: '1px solid #334155', borderRadius: '12px', padding: '15px', textAlign: 'center' }}>
              <p style={{ margin: '0 0 5px 0', color: '#94a3b8', fontSize: '12px' }}>Rol</p>
              <h4 style={{ margin: 0, color: '#7c3aed', fontSize: '16px' }}>Üye</h4>
            </div>
          </div>

        </div>
      ) : (
        <p style={{ color: '#dc3545', textAlign: 'center', marginTop: '50px' }}>Profil bilgileri bulunamadı!</p>
      )}

      {/* BUTONLAR BÖLGESİ */}
      <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
        
        {/* PROFİLİ DÜZENLE BUTONU */}
        <button 
          onClick={handleEditProfile}
          style={{ width: '100%', padding: '15px', backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          Profili Düzenle ⚙️
        </button>

        <button 
          onClick={handleLogout}
          style={{ width: '100%', padding: '15px', backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold' }}
        >
          Sistemden Çıkış Yap
        </button>
      </div>

    </div>
  );
}