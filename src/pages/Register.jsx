import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { getErrorMessage } from '../utils/getErrorMessage';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useTheme } from '../theme/ThemeProvider';

import lightBg from '../assets/bg-light.png';
import darkBg from '../assets/bg-dark.png';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState('Female');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/Auth/register', {
        email: email,
        password: password,
        RealName: fullName, 
        Nickname: userName,
        gender: gender,
        birthDate: new Date(birthDate).toISOString(),
        bio: bio
      });

      toast.success('Kimlik yaratıldı! Şimdi giriş yapabilirsin.', { icon: '✨' });
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: 'var(--space-3)',
    backgroundColor: 'var(--bg-secondary)',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontSize: 'var(--font-size-md)',
    outline: 'none',
    transition: 'border-color var(--transition-fast)'
  };

  const labelStyle = {
    fontSize: 'var(--font-size-sm)', 
    color: 'var(--text-secondary)', 
    fontWeight: 'var(--font-weight-medium)'
  };

  return (
    <div className="page-transition" style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      justifyContent: 'center', 
      padding: 'var(--space-4)', 
      backgroundImage: `url(${theme === 'light' ? lightBg : darkBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
      paddingBottom: '40px'
    }}>
            
      <div style={{ 
        backgroundColor: 'var(--surface-primary)', 
        padding: 'var(--space-5) var(--space-4)', 
        borderRadius: 'var(--radius-lg)', 
        border: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-soft)',
        position: 'relative',
        zIndex: 1,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}>
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', color: 'var(--text-primary)', marginBottom: 'var(--space-1)' }}>
            Kimlik Yarat
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Yeni bir başlangıç için bilgilerini gir.
          </p>
        </div>

        <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label style={labelStyle}>E-posta</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label style={labelStyle}>Şifre</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <input 
                type={showPassword ? "text" : "password"} 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                style={{ ...inputStyle, paddingRight: '45px' }} 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '10px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label style={labelStyle}>Ad Soyad</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required style={inputStyle} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label style={labelStyle}>Kullanıcı Adı</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} required style={inputStyle} />
          </div>
          
          <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 }}>
              <label style={labelStyle}>Cinsiyet</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                <option value="Female">Kadın</option>
                <option value="Male">Erkek</option>
                <option value="NonBinary">Belirtmek İstemiyorum</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 }}>
              <label style={labelStyle}>Doğum Tarihi</label>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required style={{ ...inputStyle, cursor: 'pointer' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
            <label style={labelStyle}>Kendinden Bahset (Opsiyonel)</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
              placeholder="Seni benzersiz yapan nedir?"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="interactive-element"
            style={{
              marginTop: 'var(--space-2)',
              width: '100%',
              padding: 'var(--space-3)',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              fontSize: 'var(--font-size-md)',
              fontWeight: 'var(--font-weight-bold)',
              cursor: loading ? 'not-allowed' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'var(--space-2)',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Yaratılıyor...' : <><UserPlus size={20} /> Kaydet</>}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-4)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 'var(--font-size-sm)' }}>
            Zaten hesabın var mı? <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 'var(--font-weight-medium)' }}>Giriş yap</Link>
          </p>
        </div>

      </div>
    </div>
  );
}