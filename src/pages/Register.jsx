import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Göz simgesi için state eklendi
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [gender, setGender] = useState('Female'); // Varsayılan değer backend'e uygun hale getirildi
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/Auth/register', {
        email: email,
        password: password,
        RealName: fullName, 
        Nickname: userName,
        gender: gender, // Artık arkaplanda 'Female', 'Male' veya 'NonBinary' gidecek
        birthDate: new Date(birthDate).toISOString(),
        bio: bio
      });

      toast.success('Kimlik yaratıldı! Şimdi giriş yapabilirsin. 🚀');
      navigate('/login');
    } catch (error) {
      console.error(error);
      toast.error('Kayıt başarısız! Bilgilerini kontrol et.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleRegister} className="auth-form">
        <h2>Kimlik Yarat</h2>
        <input type="email" placeholder="E-posta" value={email} onChange={(e) => setEmail(e.target.value)} required />
        
        {/* Şifre ve Göz Simgesi Konteyneri */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Şifre" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: '100%', paddingRight: '40px' }} 
          />
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '10px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '18px',
              padding: '0',
              color: '#aaa'
            }}
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <input type="text" placeholder="Ad Soyad" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input type="text" placeholder="Kullanıcı Adı" value={userName} onChange={(e) => setUserName(e.target.value)} required />
        
        <select value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="Female">Kadın</option>
          <option value="Male">Erkek</option>
          <option value="NonBinary">Belirtmek İstemiyorum</option>
        </select>

        <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
        <textarea placeholder="Kendinden Bahset (Bio)" value={bio} onChange={(e) => setBio(e.target.value)} />

        <button type="submit" disabled={loading}>
          {loading ? 'Yaratılıyor...' : 'KAYDET'}
        </button>
        <p>Zaten hesabın var mı? <Link to="/login">Giriş yap</Link></p>
      </form>
    </div>
  );
}