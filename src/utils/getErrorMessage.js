export function getErrorMessage(error) {
  if (!error.response) {
    return "Sunucuyla bağlantı kurulamadı. İnternetinizi kontrol edin.";
  }

  const status = error.response.status;

  if (status === 400)
    return error.response.data?.message ||
      typeof error.response.data === "string"
      ? error.response.data
      : "Geçersiz istek.";
  if (status === 401) return "Oturumunuzun süresi doldu.";
  if (status === 403) return "Bu işlemi yapmaya yetkiniz yok.";
  if (status === 404) return "İstediğiniz veri bulunamadı.";
  if (status === 409) return "Bu işlem başka bir yerde zaten gerçekleşti.";
  if (status === 500)
    return "Sunucularımızda bir sorun var. Birazdan tekrar deneyin.";

  return typeof error.response.data === "string"
    ? error.response.data
    : "Beklenmeyen bir hata oluştu.";
}
