export function getErrorMessage(error) {
  if (!error.response) {
    return "Bağlantı kurulamadı. Lütfen ağ durumunuzu kontrol edin.";
  }

  const status = error.response.status;
  const data = error.response.data;

  if (status === 409) return "Bu işlem zaten tamamlanmış.";
  if (status === 500) return "Beklenmeyen bir hata oluştu.";

  if (status === 401) return "Oturumunuz sonlandı. Lütfen tekrar giriş yapın.";
  if (status === 403) return "Bu işlem için yetkiniz bulunmuyor.";
  if (status === 404) return "Aradığınız veri bulunamadı.";

  if (status === 400) {
    if (data && data.message && typeof data.message === "string") {
      return data.message;
    }
    return "İşlem gerçekleştirilemedi. Lütfen bilgilerinizi kontrol edin.";
  }

  return "Beklenmeyen bir hata oluştu.";
}
