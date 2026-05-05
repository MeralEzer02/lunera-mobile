import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Matches from './pages/Matches';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      <Route 
        path="/matches" 
        element={
          <ProtectedRoute>
            <Matches />
          </ProtectedRoute>
        } 
      />
    </Routes>
  );
}

export default App;