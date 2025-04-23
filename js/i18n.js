// Internationalization support
let currentLanguage = 'tr'; // Set Turkish as default

// Translation strings
const translations = {
  'en': {
    'verified': 'Verified Reports',
    'unverified': 'Unverified Reports',
    'resolved': 'Resolved Reports',
    'report-heading': 'Report a Person Trapped',
    'location-description': 'Location Description',
    'location-help': 'Describe the location as precisely as possible',
    'num-people': 'Estimated Number of People',
    'situation': 'Situation Details',
    'situation-help': 'Describe the situation (building type, collapse level, etc.)',
    'contact-info': 'Contact Info (Optional)',
    'contact-help': 'Phone number or other contact method',
    'submit': 'Submit Report',
    'clear': 'Clear Form',
    'pin-location': 'Pin Exact Location',
    'pin-instructions': 'Click on the map to place a pin at the exact location',
    'confirm-location': 'Confirm Location',
    'footer-text': 'This is an open-source project aimed at helping earthquake victims.',
    'your-location': 'Your Location',
    'people': 'People',
    'status': 'Status',
    'reported': 'Reported',
    'contact': 'Contact',
    'navigate': 'Navigate',
    'verify': 'Verify',
    'resolve': 'Mark as Resolved',
    'geolocation-not-supported': 'Geolocation is not supported by your browser',
    'geolocation-error': 'Unable to retrieve your location',
    'report-success': 'Report submitted successfully!',
    'report-error': 'Error submitting report. Please try again.',
    'report-offline': 'You are offline. Report saved locally and will be submitted when you are back online.',
    'offline-message': 'You are currently offline. Some features may be limited.',
    'pending-submitted': 'Pending reports have been submitted successfully!',
    'offline-update-error': 'Cannot update report status while offline',
    'status-updated': 'Report status updated successfully',
    'update-error': 'Error updating report status',
    'location-required': 'Your location is required to submit a report. Please allow location access.',
    'firebase-error': 'Unable to connect to the database. The app is running in offline mode.'
  },
  'tr': {
    'verified': 'Doğrulanmış Raporlar',
    'unverified': 'Doğrulanmamış Raporlar',
    'resolved': 'Çözülmüş Raporlar',
    'report-heading': 'Enkaz Altında Kalan Kişiyi Bildir',
    'location-description': 'Konum Açıklaması',
    'location-help': 'Konumu mümkün olduğunca kesin bir şekilde tanımlayın',
    'num-people': 'Tahmini Kişi Sayısı',
    'situation': 'Durum Detayları',
    'situation-help': 'Durumu açıklayın (bina tipi, yıkım seviyesi, vb.)',
    'contact-info': 'İletişim Bilgisi (İsteğe Bağlı)',
    'contact-help': 'Telefon numarası veya başka bir iletişim yöntemi',
    'submit': 'Raporu Gönder',
    'clear': 'Formu Temizle',
    'pin-location': 'Tam Konumu İşaretle',
    'pin-instructions': 'Tam konumu işaretlemek için haritaya tıklayın',
    'confirm-location': 'Konumu Onayla',
    'footer-text': 'Bu, deprem mağdurlarına yardım etmeyi amaçlayan açık kaynaklı bir projedir.',
    'your-location': 'Konumunuz',
    'people': 'Kişi Sayısı',
    'status': 'Durum',
    'reported': 'Bildirilme Zamanı',
    'contact': 'İletişim',
    'navigate': 'Yol Tarifi',
    'verify': 'Doğrula',
    'resolve': 'Çözüldü Olarak İşaretle',
    'geolocation-not-supported': 'Konum belirleme tarayıcınız tarafından desteklenmiyor',
    'geolocation-error': 'Konumunuz alınamadı',
    'report-success': 'Rapor başarıyla gönderildi!',
    'report-error': 'Rapor gönderilirken hata oluştu. Lütfen tekrar deneyin.',
    'report-offline': 'Çevrimdışısınız. Rapor yerel olarak kaydedildi ve çevrimiçi olduğunuzda gönderilecek.',
    'offline-message': 'Şu anda çevrimdışısınız. Bazı özellikler sınırlı olabilir.',
    'pending-submitted': 'Bekleyen raporlar başarıyla gönderildi!',
    'offline-update-error': 'Çevrimdışıyken rapor durumu güncellenemez',
    'status-updated': 'Rapor durumu başarıyla güncellendi',
    'update-error': 'Rapor durumu güncellenirken hata oluştu',
    'location-required': 'Rapor göndermek için konumunuz gereklidir. Lütfen konum erişimine izin verin.',
    'firebase-error': 'Veritabanına bağlanılamıyor. Uygulama çevrimdışı modda çalışıyor.'
  },
  'ar': {
    'verified': 'تقارير مؤكدة',
    'unverified': 'تقارير غير مؤكدة',
    'resolved': 'تقارير تم حلها',
    'report-heading': 'الإبلاغ عن شخص محاصر',
    'location-description': 'وصف الموقع',
    'location-help': 'صف الموقع بدقة قدر الإمكان',
    'num-people': 'العدد التقديري للأشخاص',
    'situation': 'تفاصيل الوضع',
    'situation-help': 'صف الوضع (نوع المبنى، مستوى الانهيار، إلخ)',
    'contact-info': 'معلومات الاتصال (اختياري)',
    'contact-help': 'رقم الهاتف أو طريقة اتصال أخرى',
    'submit': 'إرسال التقرير',
    'clear': 'مسح النموذج',
    'pin-location': 'تحديد الموقع الدقيق',
    'pin-instructions': 'انقر على الخريطة لوضع دبوس في الموقع الدقيق',
    'confirm-location': 'تأكيد الموقع',
    'footer-text': 'هذا مشروع مفتوح المصدر يهدف إلى مساعدة ضحايا الزلازل.',
    'your-location': 'موقعك',
    'people': 'الأشخاص',
    'status': 'الحالة',
    'reported': 'تم الإبلاغ',
    'contact': 'الاتصال',
    'navigate': 'التنقل',
    'verify': 'تأكيد',
    'resolve': 'وضع علامة كمحلول',
    'geolocation-not-supported': 'تحديد الموقع الجغرافي غير مدعوم من متصفحك',
    'geolocation-error': 'تعذر تحديد موقعك',
    'report-success': 'تم إرسال التقرير بنجاح!',
    'report-error': 'خطأ في إرسال التقرير. يرجى المحاولة مرة أخرى.',
    'report-offline': 'أنت غير متصل بالإنترنت. تم حفظ التقرير محليًا وسيتم إرساله عندما تعود للاتصال.',
    'offline-message': 'أنت حاليًا غير متصل بالإنترنت. قد تكون بعض الميزات محدودة.',
    'pending-submitted': 'تم إرسال التقارير المعلقة بنجاح!',
    'offline-update-error': 'لا يمكن تحديث حالة التقرير أثناء عدم الاتصال',
    'status-updated': 'تم تحديث حالة التقرير بنجاح',
    'update-error': 'خطأ في تحديث حالة التقرير',
    'location-required': 'موقعك مطلوب لإرسال تقرير. يرجى السماح بالوصول إلى الموقع.',
    'firebase-error': 'غير قادر على الاتصال بقاعدة البيانات. التطبيق يعمل في وضع عدم الاتصال.'
  },
  'es': {
    'verified': 'Informes Verificados',
    'unverified': 'Informes No Verificados',
    'resolved': 'Informes Resueltos',
    'report-heading': 'Reportar una Persona Atrapada',
    'location-description': 'Descripción de la Ubicación',
    'location-help': 'Describa la ubicación con la mayor precisión posible',
    'num-people': 'Número Estimado de Personas',
    'situation': 'Detalles de la Situación',
    'situation-help': 'Describa la situación (tipo de edificio, nivel de colapso, etc.)',
    'contact-info': 'Información de Contacto (Opcional)',
    'contact-help': 'Número de teléfono u otro método de contacto',
    'submit': 'Enviar Informe',
    'clear': 'Limpiar Formulario',
    'pin-location': 'Marcar Ubicación Exacta',
    'pin-instructions': 'Haga clic en el mapa para colocar un pin en la ubicación exacta',
    'confirm-location': 'Confirmar Ubicación',
    'footer-text': 'Este es un proyecto de código abierto destinado a ayudar a las víctimas de terremotos.',
    'your-location': 'Su Ubicación',
    'people': 'Personas',
    'status': 'Estado',
    'reported': 'Reportado',
    'contact': 'Contacto',
    'navigate': 'Navegar',
    'verify': 'Verificar',
    'resolve': 'Marcar como Resuelto',
    'geolocation-not-supported': 'La geolocalización no es compatible con su navegador',
    'geolocation-error': 'No se puede recuperar su ubicación',
    'report-success': '¡Informe enviado con éxito!',
    'report-error': 'Error al enviar el informe. Por favor, inténtelo de nuevo.',
    'report-offline': 'Está desconectado. El informe se guardó localmente y se enviará cuando vuelva a estar en línea.',
    'offline-message': 'Actualmente está desconectado. Algunas funciones pueden estar limitadas.',
    'pending-submitted': '¡Los informes pendientes se han enviado con éxito!',
    'offline-update-error': 'No se puede actualizar el estado del informe mientras está desconectado',
    'status-updated': 'Estado del informe actualizado con éxito',
    'update-error': 'Error al actualizar el estado del informe',
    'location-required': 'Se requiere su ubicación para enviar un informe. Por favor, permita el acceso a la ubicación.',
    'firebase-error': 'No se puede conectar a la base de datos. La aplicación se está ejecutando en modo sin conexión.'
  }
};

// Initialize language
function initLanguage() {
  // Get language from localStorage or use default
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && config.supportedLanguages.includes(savedLanguage)) {
    currentLanguage = savedLanguage;
  }
  
  // Set the language selector
  document.getElementById('language-select').value = currentLanguage;
  
  // Apply translations
  applyTranslations();
}

// Change language
function changeLanguage(lang) {
  if (!config.supportedLanguages.includes(lang)) return;
  
  currentLanguage = lang;
  localStorage.setItem('language', lang);
  
  // Apply translations
  applyTranslations();
}

// Apply translations to the page
function applyTranslations() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLanguage][key]) {
      el.textContent = translations[currentLanguage][key];
    }
  });
}

// Get translation for a key
function getTranslation(key) {
  if (translations[currentLanguage] && translations[currentLanguage][key]) {
    return translations[currentLanguage][key];
  }
  
  // Fallback to English
  if (translations['en'] && translations['en'][key]) {
    return translations['en'][key];
  }
  
  // Return the key if no translation found
  return key;
}
