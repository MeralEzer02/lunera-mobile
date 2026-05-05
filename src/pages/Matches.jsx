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

  // --- 2. SAYFA İLK AÇILDIĞINDA ÇALIŞACAK BLOK (Linter Dostu) ---
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

  const visibleRequests = pendingRequests.filter(req => {
    const hideTime = new Date(req.expiresAt);
    hideTime.setHours(hideTime.getHours() + 5);
    
    return new Date() <= hideTime; 
  });

  // --- 4. RADAR: YENİ KULLANICI BUL ---
  const findNewMatch = async () => {
    setLoading(true);
    setMatchData(null); 
    
    try {
      const response = await api.post('/Match/find');
      setMatchData(response.data);
      toast.success('Sistemin seçtiği kullanıcı ekranda! 🚀');
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

  // --- 5. RADAR: İSTEK GÖNDER ---
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

  // --- 6. GELEN İSTEĞİ KABUL ET ---
  const handleAcceptPending = async (matchId) => {
    try {
      await api.post(`/Match/${matchId}/accept`);
      
      toast.success('Eşleşme sağlandı! Artık mesajlaşabilirsiniz. 🎉');
      fetchPendingRequests();
    } catch (error) {
      console.error("Backend Hata Detayı:", error.response?.data); 
      
      const errorData = error.response?.data;
      const backendMessage = errorData?.detail || errorData?.title || 'Bilinmeyen bir hata oluştu.';
      
      toast.error(`Sistem Diyor ki: ${backendMessage}`);
    }
  };

  // --- 7. ÇIKIŞ YAP ---
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
          {loading ? 'Radar Taranıyor...' : 'Yeni Kullanıcı Bul 🔍'}
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
        
        {visibleRequests.length === 0 ? (
          <p style={{ color: '#666', fontSize: '14px' }}>Henüz bir hareket yok.</p>
        ) : (
          visibleRequests.map(req => {
            const isExpired = new Date(req.expiresAt) <= new Date();

            return (
              <div key={req.matchId} style={{ 
                border: '1px solid #444', 
                backgroundColor: '#111', 
                borderRadius: '8px', 
                padding: '15px', 
                marginBottom: '10px', 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                opacity: isExpired ? 0.5 : 1
              }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', color: '#fff', textDecoration: isExpired ? 'line-through' : 'none' }}>
                    @{req.nickname}
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: isExpired ? '#dc3545' : '#aaa' }}>
                    {isExpired ? 'Fırsat kaçtı...' : 'Seni bekliyor...'}
                  </p>
                </div>
                <button 
                  onClick={() => !isExpired && handleAcceptPending(req.matchId)}
                  disabled={isExpired}
                  style={{ 
                    backgroundColor: isExpired ? '#333' : '#007bff', 
                    color: isExpired ? '#777' : '#fff', 
                    padding: '8px 16px', 
                    border: 'none', 
                    borderRadius: '6px', 
                    cursor: isExpired ? 'not-allowed' : 'pointer', 
                    fontWeight: 'bold' 
                  }}
                >
                  {isExpired ? 'SÜRESİ DOLDU' : 'KABUL ET'}
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}