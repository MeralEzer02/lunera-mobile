import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../api/client';
import { getErrorMessage } from '../utils/getErrorMessage';

export default function Matches() {
  // RADAR (Keşif) State'leri
  const [matchData, setMatchData] = useState(null); 
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // GELEN İSTEKLER State'i
  const [pendingRequests, setPendingRequests] = useState([]);
  
  // SEKME (TAB) State'i: 'incoming' (Gelen) veya 'outgoing' (Giden)
  const [activeTab, setActiveTab] = useState('incoming');

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

  // --- 2. SAYFA İLK AÇILDIĞINDA ÇALIŞACAK BLOK ---
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

  // VERİYİ İKİYE BÖLÜYORUZ:
  const incomingRequests = visibleRequests.filter(req => !req.isSentByMe);
  const outgoingRequests = visibleRequests.filter(req => req.isSentByMe);

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
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // --- 5. RADAR: İSTEK GÖNDER ---
  const handleSendRequest = async () => {
    if (!matchData) return;
    setActionLoading(true);

    try {
      const response = await api.post(`/Match/request/${matchData.matchedUser.id}`);
      
      if (response.data.isMutual) {
        toast.success('Çift taraflı eşleşme sağlandı! 🔥 Artık mesajlaşabilirsiniz.', { duration: 4000 });
      } else {
        toast.success('İstek karşı tarafa fırlatıldı! Onay bekleniyor. ⏳');
      }

      setMatchData(null); 
      fetchPendingRequests();
    } catch (error) {
      console.error(error); 
      toast.error(getErrorMessage(error));
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
      console.error("Backend Hata Detayı:", error); 
      toast.error(getErrorMessage(error));
    }
  };

  // --- 7. ÇIKIŞ YAP ---
  const handleLogout = () => {
    localStorage.removeItem('token');
    toast('Başarıyla çıkış yapıldı.', { icon: '👋' });
    navigate('/login');
  };

  return (
    <div className="matches-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', paddingBottom: '100px' }}>
      
      {/* ÜST BAR */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#fff' }}>Keşif Merkezi</h2>
        <button 
          onClick={handleLogout}
          style={{ backgroundColor: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Çıkış Yap
        </button>
      </div>
      
      {/* RADAR ALANI */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button 
          onClick={findNewMatch} 
          disabled={loading || actionLoading}
          style={{ padding: '15px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', width: '100%', boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)' }}
        >
          {loading ? 'Radar Taranıyor...' : 'Yeni Kullanıcı Bul 🔍'}
        </button>
      </div>

      {!matchData && !loading && (
        <p style={{ textAlign: 'center', color: '#888', fontSize: '15px', backgroundColor: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
          Radarda kimse yok. Aramaya başla!
        </p>
      )}

      {matchData && matchData.matchedUser && (
        <div style={{ border: '1px solid #334155', backgroundColor: '#111', borderRadius: '16px', padding: '25px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)', marginBottom: '30px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff', fontWeight: 'bold', fontSize: '24px', marginBottom: '15px' }}>
            {matchData.matchedUser.nickname ? matchData.matchedUser.nickname.charAt(0).toUpperCase() : '?'}
          </div>
          <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '22px' }}>@{matchData.matchedUser.nickname || "Anonim"}</h3>
          <p style={{ fontSize: '15px', color: '#94a3b8', lineHeight: '1.5', fontStyle: 'italic' }}>
            "{matchData.matchedUser.bio || "Gizemli biri, kendinden bahsetmemiş..."}"
          </p>
          
          <div style={{ display: 'flex', gap: '15px', marginTop: '25px' }}>
            <button onClick={handleSendRequest} disabled={actionLoading} style={{ flex: 1, backgroundColor: '#10b981', color: 'white', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              İSTEK GÖNDER
            </button>
            <button onClick={() => setMatchData(null)} disabled={actionLoading} style={{ flex: 1, backgroundColor: '#334155', color: 'white', padding: '12px', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' }}>
              GEÇ
            </button>
          </div>
        </div>
      )}

      <hr style={{ borderColor: '#334155', margin: '30px 0' }} />

      {/* ŞIK SEKME (TAB) MENÜSÜ */}
      <div style={{ display: 'flex', backgroundColor: '#0f172a', borderRadius: '12px', padding: '5px', marginBottom: '20px', border: '1px solid #334155' }}>
        <button
          onClick={() => setActiveTab('incoming')}
          style={{ 
            flex: 1, padding: '12px', borderRadius: '8px', border: 'none', 
            backgroundColor: activeTab === 'incoming' ? '#3b82f6' : 'transparent', 
            color: activeTab === 'incoming' ? '#fff' : '#64748b', 
            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px'
          }}
        >
          Gelenler 📥 {incomingRequests.length > 0 && `(${incomingRequests.length})`}
        </button>
        <button
          onClick={() => setActiveTab('outgoing')}
          style={{ 
            flex: 1, padding: '12px', borderRadius: '8px', border: 'none', 
            backgroundColor: activeTab === 'outgoing' ? '#3b82f6' : 'transparent', 
            color: activeTab === 'outgoing' ? '#fff' : '#64748b', 
            fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s', fontSize: '14px'
          }}
        >
          Gönderdiklerim 🚀
        </button>
      </div>

      {/* SEKME İÇERİKLERİ */}
      <div style={{ minHeight: '200px' }}>
        
        {/* GELENLER EKRANI */}
        {activeTab === 'incoming' && (
          <div>
            {incomingRequests.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px dashed #334155' }}>Seni bekleyen kimse yok.</p>
            ) : (
              incomingRequests.map(req => {
                const isExpired = new Date(req.expiresAt) <= new Date();
                return (
                  <div key={req.matchId} style={{ border: '1px solid #334155', backgroundColor: '#111', borderRadius: '12px', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isExpired ? 0.5 : 1 }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#fff', textDecoration: isExpired ? 'line-through' : 'none', fontSize: '16px' }}>@{req.nickname}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: isExpired ? '#ef4444' : '#10b981' }}>{isExpired ? 'Fırsat kaçtı...' : 'Seni bekliyor...'}</p>
                    </div>
                    <button 
                      onClick={() => !isExpired && handleAcceptPending(req.matchId)}
                      disabled={isExpired}
                      style={{ backgroundColor: isExpired ? '#1e293b' : '#3b82f6', color: isExpired ? '#64748b' : '#fff', padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: isExpired ? 'not-allowed' : 'pointer', fontWeight: 'bold', fontSize: '14px' }}
                    >
                      {isExpired ? 'SÜRESİ DOLDU' : 'KABUL ET'}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* GÖNDERİLENLER EKRANI */}
        {activeTab === 'outgoing' && (
          <div>
            {outgoingRequests.length === 0 ? (
              <p style={{ color: '#64748b', fontSize: '14px', textAlign: 'center', backgroundColor: '#0f172a', padding: '15px', borderRadius: '8px', border: '1px dashed #334155' }}>Henüz kimseye istek göndermedin.</p>
            ) : (
              outgoingRequests.map(req => {
                const isExpired = new Date(req.expiresAt) <= new Date();
                return (
                  <div key={req.matchId} style={{ border: '1px solid #334155', backgroundColor: '#111', borderRadius: '12px', padding: '15px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: isExpired ? 0.5 : 1 }}>
                    <div>
                      <h4 style={{ margin: '0 0 5px 0', color: '#fff', textDecoration: isExpired ? 'line-through' : 'none', fontSize: '16px' }}>@{req.nickname}</h4>
                      <p style={{ margin: 0, fontSize: '13px', color: isExpired ? '#ef4444' : '#f59e0b' }}>{isExpired ? 'Zaman aşımına uğradı' : 'Cevap bekleniyor...'}</p>
                    </div>
                    <div style={{ backgroundColor: '#1e293b', color: '#94a3b8', padding: '10px 15px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                      {isExpired ? 'İPTAL OLDU' : 'BEKLENİYOR'}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}