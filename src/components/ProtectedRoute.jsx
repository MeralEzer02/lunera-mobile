import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');

  // GÜÇLENDİRİLMİŞ KONTROL (Harden): 
  const isAuthenticated = 
    token && 
    token !== 'undefined' && 
    token !== 'null' && 
    token.trim() !== '';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}