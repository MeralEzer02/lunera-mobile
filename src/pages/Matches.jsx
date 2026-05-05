import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';

export default function Matches() {
  // RADAR (Keşif) State'leri
  const [matchData, setMatchData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // GELEN İSTEKLER State'i
  const [pendingRequests, setPendingRequests] = useState([]);

  const navigate = useNavigate();

  // --- 1. BUTONLAR İÇİN YENİLEME FONKSİYONU ---
  const fetchPendingRequests = async () => {
    try {
      const response = await api.get('/Match/pending');
      setPendingRequests(response.data);
    } catch (error) {
      console.error("İstekler çekilemedi:", error);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const response = await api.get('/Match/pending');
        setPendingRequests(response.data);
      } catch (error) {
        console.error("İlk yükleme hatası:", error);
      }
    };
    loadInitialData();
  }, []);

  // --- 3. RADAR: YENİ AJAN BUL ---
  const findNewMatch = async () => {
    setLoading(true);
    setMatchData(null); 
    
    try {
      const response = await api.post('/Match/find');
      setMatchData(response.data);
      toast.success('Sistemin seçtiği ajan ekranda! 🚀');
    } catch (error) {
      console.error(error); 
      if (error.response && error.response.status === 404) {
        toast.error('Şu an etrafta uygun kimse yok.');
      } else {
        toast.error('Kullanıcı aranırken bir sorun oluştu.');
      }
    } finally {
      setLoading(false);
    }
  };

  // --- 4. RADAR: İSTEK GÖNDER ---
  const handleSendRequest = async () => {
    if (!matchData) return;
    setActionLoading(true);

    try {
      await api.post(`/Match/request/${matchData.matchedUser.id}`);
      toast.success('İstek karşı tarafa fırlatıldı! ✨');
      setMatchData(null); 
      fetchPendingRequests();
    } catch (error) {
      console.error(error); 
      toast.error('İstek gönderilemedi.');
    } finally {
      setActionLoading(false);
    }
  };

  // --- 5. GELEN İSTEĞİ KABUL ET ---
  const handleAcceptPending = async (matchId) => {
    try {
      await api.post(`/Match/${matchId}/accept`);
      toast.success('Eşleşme sağlandı! Artık mesajlaşabilirsiniz. 🎉');
      fetchPendingRequests();
    } catch (error) {
      console.error(error); 
      toast.error('Kabul işlemi başarısız oldu.');
    }
  };

  // --- 6. ÇIKIŞ YAP ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast('Başarıyla çıkış yapıldı.', { icon: '👋' });
    navigate('/login');
  };

  return (
    <div className="matches-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
      
      {/* ÜST BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0 }}>Keşif Merkezi</h2>
        <button 
          onClick={handleLogout}
          style={{ backgroundColor: 'transparent', color: '#dc3545', border: '1px solid #dc3545', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Çıkış Yap
        </button>
      </div>
      
      {/* RADAR ALANI */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={findNewMatch} 
          disabled={loading || actionLoading}
          style={{ padding: '12px 24px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', width: '100%' }}
        >
          {loading ? 'Radar Taranıyor...' : 'Yeni Ajan Bul 🔍'}
        </button>
      </div>

      {!matchData && !loading && (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '14px' }}>Radarda kimse yok.</p>
      )}

      {matchData && matchData.matchedUser && (
        <div style={{ border: '1px solid #007bff', backgroundColor: '#1a1a1a', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 15px rgba(0, 123, 255, 0.2)', marginBottom: '30px' }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff' }}>@{matchData.matchedUser.nickname || "Anonim"}</h3>
          <p style={{ fontSize: '15px', color: '#ddd', lineHeight: '1.5' }}>{matchData.matchedUser.bio || "Gizemli biri, kendinden bahsetmemiş..."}</p>
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
            <button onClick={handleSendRequest} disabled={actionLoading} style={{ flex: 1, backgroundColor: '#28a745', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              İSTEK GÖNDER
            </button>
            <button onClick={() => setMatchData(null)} disabled={actionLoading} style={{ flex: 1, backgroundColor: '#dc3545', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              GEÇ
            </button>
          </div>
        </div>
      )}

      <hr style={{ borderColor: '#333', margin: '30px 0' }} />

      {/* BEKLEYEN İSTEKLER ALANI */}
      <div>
        <h3 style={{ color: '#fff', marginBottom: '15px' }}>Bekleyen İstekler ⏳</h3>
        
        {pendingRequests.length === 0 ? (
          <p style={{ color: '#666', fontSize: '14px' }}>Henüz bir hareket yok.</p>
        ) : (
          pendingRequests.map(req => (
            <div key={req.matchId} style={{ border: '1px solid #444', backgroundColor: '#111', borderRadius: '8px', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#fff' }}>@{req.nickname}</h4>
                <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>Seni bekliyor...</p>
              </div>
              <button 
                onClick={() => handleAcceptPending(req.matchId)}
                style={{ backgroundColor: '#ffc107', color: '#000', padding: '8px 16px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                KABUL ET
              </button>
            </div>
          ))
        )}
      </div>

    </div>
  );
}