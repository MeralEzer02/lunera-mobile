import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { getErrorMessage } from '../utils/getErrorMessage';
import { ChevronLeft, Save } from 'lucide-react';

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
      toast.error(getErrorMessage(error));
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
      toast.success("Profil yapılandırması kaydedildi.");
      navigate('/profile');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: 'var(--space-6)', fontSize: 'var(--font-size-sm)' }}>Veriler alınıyor...</p>;
  }

  return (
    <div className="page-transition" style={{ maxWidth: '520px', margin: '0 auto', padding: 'var(--space-4)', paddingBottom: '100px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-5)', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--space-3)' }}>
        <button 
          onClick={() => navigate('/profile')}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', marginRight: 'var(--space-3)', padding: 0, display: 'flex', alignItems: 'center' }}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 style={{ color: 'var(--text-primary)', margin: 0, fontSize: 'var(--font-size-lg)' }}>Yapılandırma</h2>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Sistem Adı (@)</label>
          <input 
            type="text" 
            name="nickname"
            value={formData.nickname}
            onChange={handleChange}
            style={{ padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)', fontSize: 'var(--font-size-md)', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Gerçek İsim</label>
          <input 
            type="text" 
            name="realName"
            value={formData.realName}
            onChange={handleChange}
            placeholder="İsteğe bağlı..."
            style={{ padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)', fontSize: 'var(--font-size-md)', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-medium)' }}>Kişisel Veri (Bio)</label>
          <textarea 
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Kendinden bahset..."
            rows="4"
            style={{ padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--surface-primary)', color: 'var(--text-primary)', fontSize: 'var(--font-size-md)', resize: 'none', outline: 'none' }}
          />
        </div>

        <button 
          type="submit"
          disabled={saving}
          className="interactive-element"
          style={{ 
            marginTop: 'var(--space-2)', width: '100%', padding: '14px', 
            backgroundColor: 'var(--text-primary)', 
            color: 'var(--bg-primary)', border: 'none', borderRadius: 'var(--radius-sm)', 
            cursor: saving ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-bold)', opacity: saving ? 0.7 : 1
          }}
        >
          <Save size={18} /> {saving ? 'İşleniyor...' : 'Değişiklikleri Kaydet'}
        </button>

      </form>
    </div>
  );
}