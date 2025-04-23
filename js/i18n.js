// Internationalization support
let currentLanguage = 'tr'; // Set Turkish as default

// Translation strings
const translations = {
  'en': {
    'app-title': 'Earthquake Rescue Locator',
    'verified': 'Verified',
    'unverified': 'Unverified',
    'resolved': 'Resolved',
    'show-verified': 'Show Verified Reports',
    'show-unverified': 'Show Unverified Reports',
    'show-resolved': 'Show Resolved Reports',
    'report-button': 'Report a Person Trapped',
    'locate-me': 'Find My Location',
    'filters': 'Filters',
    'report-form-title': 'Report a Person Trapped',
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
    'report': 'Report',
    'people': 'People',
    'status': 'Status',
    'time': 'Time',
    'reported': 'Reported',
    'contact': 'Contact',
    'navigate': 'Navigate',
    'verify': 'Verify',
    'resolve': 'Mark as Resolved',
    'geolocation-not-supported': 'Geolocation is not supported by your browser',
    'geolocation-error': 'Unable to retrieve your location',
    'report-success': 'Report submitted successfully!',
    'report-error': 'Error submitting report. Please try again.',
    'report-offline': 'You are offline. Report saved locally.',
    'offline-message': 'You are currently offline. Some features may be limited.',
    'status-updated': 'Report status updated successfully',
    'update-error': 'Error updating report status',
    'location-required': 'Your location is required to submit a report. Please allow location access.',
    'location': 'Location',
    'p2p-connected': 'Connected to peer network',
    'p2p-disconnected': 'Disconnected from peer network',
    'sync-success': 'Successfully synchronized with other nodes',
    'sync-error': 'Error synchronizing with other nodes'
  },
  'tr': {
    'app-title': 'Deprem Kurtarma Konum Belirleyici',
    'verified': 'Doğrulanmış',
    'unverified': 'Doğrulanmamış',
    'resolved': 'Çözülmüş',
    'show-verified': 'Doğrulanmış Bildirimleri Göster',
    'show-unverified': 'Doğrulanmamış Bildirimleri Göster',
    'show-resolved': 'Çözülmüş Bildirimleri Göster',
    'report-button': 'Enkaz Bildirimi Yap',
    'locate-me': 'Konumumu Bul',
    'filters': 'Filtreler',
    'report-form-title': 'Enkaz Bildirimi',
    'location-description': 'Konum Açıklaması',
    'location-help': 'Konumu mümkün olduğunca kesin bir şekilde tanımlayın',
    'num-people': 'Tahmini Kişi Sayısı',
    'situation': 'Durum Detayları',
    'situation-help': 'Durumu açıklayın (bina tipi, yıkım seviyesi, vb.)',
    'contact-info': 'İletişim Bilgisi (İsteğe Bağlı)',
    'contact-help': 'Telefon numarası veya başka bir iletişim yöntemi',
    'submit': 'Gönder',
    'clear': 'Temizle',
    'pin-location': 'Tam Konumu İşaretle',
    'pin-instructions': 'Tam konumu işaretlemek için haritaya tıklayın',
    'confirm-location': 'Konumu Onayla',
    'footer-text': 'Bu, deprem mağdurlarına yardım etmeyi amaçlayan açık kaynaklı bir projedir.',
    'your-location': 'Konumunuz',
    'report': 'Bildirim',
    'people': 'Kişi Sayısı',
    'status': 'Durum',
    'time': 'Zaman',
    'reported': 'Bildirilme Zamanı',
    'contact': 'İletişim',
    'navigate': 'Yol Tarifi',
    'verify': 'Doğrula',
    'resolve': 'Çözüldü Olarak İşaretle',
    'geolocation-not-supported': 'Konum belirleme tarayıcınız tarafından desteklenmiyor',
    'geolocation-error': 'Konumunuz alınamadı',
    'report-success': 'Rapor başarıyla gönderildi!',
    'report-error': 'Rapor gönderilirken hata oluştu. Lütfen tekrar deneyin.',
    'report-offline': 'Çevrimdışısınız. Rapor yerel olarak kaydedildi.',
    'offline-message': 'Şu anda çevrimdışısınız. Bazı özellikler sınırlı olabilir.',
    'status-updated': 'Rapor durumu başarıyla güncellendi',
    'update-error': 'Rapor durumu güncellenirken hata oluştu',
    'location-required': 'Rapor göndermek için konumunuz gereklidir. Lütfen konum erişimine izin verin.',
    'location': 'Konum',
    'p2p-connected': 'Eş ağına bağlandı',
    'p2p-disconnected': 'Eş ağından bağlantı kesildi',
    'sync-success': 'Diğer düğümlerle başarıyla senkronize edildi',
    'sync-error': 'Diğer düğümlerle senkronizasyon hatası'
  },
  'ar': {
    'app-title': 'محدد موقع الإنقاذ من الزلازل',
    'verified': 'تم التحقق',
    'unverified': 'غير مؤكد',
    'resolved': 'تم الحل',
    'show-verified': 'عرض التقارير المؤكدة',
    'show-unverified': 'عرض التقارير غير المؤكدة',
    'show-resolved': 'عرض التقارير التي تم حلها',
    'report-button': 'الإبلاغ عن شخص محاصر',
    'locate-me': 'البحث عن موقعي',
    'filters': 'المرشحات',
    'report-form-title': 'الإبلاغ عن شخص محاصر',
    'location-description': 'وصف الموقع',
    'location-help': 'صف الموقع بأكبر قدر ممكن من الدقة',
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
    'report': 'تقرير',
    'people': 'الأشخاص',
    'status': 'الحالة',
    'time': 'الوقت',
    'reported': 'تم الإبلاغ',
    'contact': 'الاتصال',
    'navigate': 'التنقل',
    'verify': 'تأكيد',
    'resolve': 'وضع علامة كمحلول',
    'geolocation-not-supported': 'تحديد الموقع الجغرافي غير مدعوم من متصفحك',
    'geolocation-error': 'تعذر تحديد موقعك',
    'report-success': 'تم إرسال التقرير بنجاح!',
    'report-error': 'خطأ في إرسال التقرير. يرجى المحاولة مرة أخرى.',
    'report-offline': 'أنت غير متصل بالإنترنت. تم حفظ التقرير محليًا.',
    'offline-message': 'أنت حاليًا غير متصل بالإنترنت. قد تكون بعض الميزات محدودة.',
    'status-updated': 'تم تحديث حالة التقرير بنجاح',
    'update-error': 'خطأ في تحديث حالة التقرير',
    'location-required': 'موقعك مطلوب لإرسال تقرير. يرجى السماح بالوصول إلى الموقع.',
    'location': 'الموقع',
    'p2p-connected': 'متصل بشبكة الأقران',
    'p2p-disconnected': 'انقطع الاتصال بشبكة الأقران',
    'sync-success': 'تمت المزامنة بنجاح مع العقد الأخرى',
    'sync-error': 'خطأ في المزامنة مع العقد الأخرى'
  },
  'es': {
    'app-title': 'Localizador de Rescate de Terremotos',
    'verified': 'Verificado',
    'unverified': 'No Verificado',
    'resolved': 'Resuelto',
    'show-verified': 'Mostrar Informes Verificados',
    'show-unverified': 'Mostrar Informes No Verificados',
    'show-resolved': 'Mostrar Informes Resueltos',
    'report-button': 'Reportar una Persona Atrapada',
    'locate-me': 'Encontrar Mi Ubicación',
    'filters': 'Filtros',
    'report-form-title': 'Reportar una Persona Atrapada',
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
    'report': 'Informe',
    'people': 'Personas',
    'status': 'Estado',
    'time': 'Tiempo',
    'reported': 'Reportado',
    'contact': 'Contacto',
    'navigate': 'Navegar',
    'verify': 'Verificar',
    'resolve': 'Marcar como Resuelto',
    'geolocation-not-supported': 'La geolocalización no es compatible con su navegador',
    'geolocation-error': 'No se puede recuperar su ubicación',
    'report-success': '¡Informe enviado con éxito!',
    'report-error': 'Error al enviar el informe. Por favor, inténtelo de nuevo.',
    'report-offline': 'Está desconectado. El informe se guardó localmente.',
    'offline-message': 'Actualmente está desconectado. Algunas funciones pueden estar limitadas.',
    'status-updated': 'Estado del informe actualizado con éxito',
    'update-error': 'Error al actualizar el estado del informe',
    'location-required': 'Se requiere su ubicación para enviar un informe. Por favor, permita el acceso a la ubicación.',
    'location': 'Ubicación',
    'p2p-connected': 'Conectado a la red de pares',
    'p2p-disconnected': 'Desconectado de la red de pares',
    'sync-success': 'Sincronizado con éxito con otros nodos',
    'sync-error': 'Error al sincronizar con otros nodos'
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
