import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Matches from './pages/Matches';
import Chat from './pages/Chat';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Chats from './pages/Chats';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ALT MENÜSÜ OLAN SAYFALAR */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/matches" element={<Matches />} />
        
        <Route path="/chats" element={<Chats />} />
        
        <Route path="/profile" element={<Profile />} />

        <Route path="/profile/edit" element={<EditProfile />} /> 
      </Route>

      {/* ALT MENÜSÜ OLMAYAN SAYFALAR */}
      <Route
        path="/chat/:matchId"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;