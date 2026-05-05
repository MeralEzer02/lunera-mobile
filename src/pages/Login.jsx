import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.post('/Auth/login', { email, password });
      const token = response.data.token; 
      localStorage.setItem('token', token);
      
      toast.success('Giriş başarılı! Yönlendiriliyorsun...');
      navigate('/matches'); 
    } catch (error) {
      console.error(error);
      toast.error('Giriş başarısız. Bilgileri kontrol et.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Lunera</h2>
        
        <div className="input-group">
          <input type="email" placeholder="E-posta adresin" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="input-group" style={{ display: 'flex', gap: '5px', justifyContent: 'center', width: '100%' }}>
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Şifren" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Bağlanıyor...' : 'Giriş Yap'}
        </button>

        <p>Hesabın yok mu? <Link to="/register">Kayıt ol</Link></p>
      </form>
    </div>
  );
}