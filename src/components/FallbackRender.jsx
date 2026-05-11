export default function FallbackRender({ error, resetErrorBoundary }) {
  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a', color: '#fff', padding: '20px', textAlign: 'center', boxSizing: 'border-box' }}>
      <h1 style={{ color: '#ef4444', marginBottom: '10px' }}>Olamaz! Sistem Çöktü 💥</h1>
      <p style={{ color: '#94a3b8', marginBottom: '20px' }}>Uygulamada beklenmeyen bir hata meydana geldi.</p>
      
      <pre style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', color: '#f87171', fontSize: '13px', maxWidth: '100%', overflowX: 'auto', marginBottom: '30px', border: '1px solid #334155' }}>
        {error.message}
      </pre>
      
      <button 
        onClick={resetErrorBoundary} 
        style={{ padding: '15px 30px', backgroundColor: '#7c3aed', color: '#fff', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', boxShadow: '0 4px 15px rgba(124, 58, 237, 0.4)' }}>
        Sistemi Yeniden Başlat 🔄
      </button>
    </div>
  );
}