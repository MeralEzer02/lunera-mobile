import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';

export default function EditProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    nickname: '',
    realName: '',
    bio: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/Auth/my-profile');
        setFormData({
          nickname: response.data.nickname || '',
          realName: response.data.realName || '',
          bio: response.data.bio || ''
        });
      } catch (error) {
        console.error("Hata detayı:", error);
        toast.error("Profil bilgileri alınamadı.");
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nickname.trim()) {
      toast.error("Takma ad boş bırakılamaz!");
      return;
    }

    setSaving(true);
    try {
      await api.put('/Auth/my-profile', formData);
      toast.success("Profilin başarıyla güncellendi!");
      navigate('/profile');
    } catch (error) {
      toast.error(error.response?.data || "Güncelleme başarısız oldu.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ color: '#888', textAlign: 'center', marginTop: '50px' }}>Bilgiler getiriliyor...</p>;
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', paddingBottom: '100px', height: '100vh', overflowY: 'auto', boxSizing: 'border-box' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
        <button 
          onClick={() => navigate('/profile')}
          style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', marginRight: '15px', padding: 0 }}
        >
          ←
        </button>
        <h2 style={{ color: '#fff', margin: 0, fontSize: '22px' }}>Profili Düzenle ⚙️</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        
        {/* NICKNAME ALANI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}>Takma Ad (@)</label>
          <input 
            type="text" 
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            style={{ padding: '15px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#111', color: '#fff', fontSize: '15px' }}
          />
        </div>

        {/* GERÇEK İSİM ALANI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}>Gerçek İsim</label>
          <input 
            type="text" 
            name="realName"
            value={formData.realName}
            onChange={handleChange}
            placeholder="İsteğe bağlı..."
            style={{ padding: '15px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#111', color: '#fff', fontSize: '15px' }}
          />
        </div>

        {/* BIO ALANI */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 'bold' }}>Hakkımda</label>
          <textarea 
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Kendinden bahset..."
            rows="4"
            style={{ padding: '15px', borderRadius: '12px', border: '1px solid #334155', backgroundColor: '#111', color: '#fff', fontSize: '15px', resize: 'none' }}
          />
        </div>

        <button 
          type="submit"
          disabled={saving}
          style={{ 
            marginTop: '10px', width: '100%', padding: '15px', 
            backgroundColor: saving ? '#4c1d95' : '#7c3aed', 
            color: '#fff', border: 'none', borderRadius: '12px', 
            cursor: saving ? 'not-allowed' : 'pointer', 
            fontSize: '16px', fontWeight: 'bold', transition: 'background-color 0.2s'
          }}
        >
          {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
        </button>

      </form>
    </div>
  );
}