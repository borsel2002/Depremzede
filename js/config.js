// App configuration
const config = {
  // Default map center (can be overridden by user location)
  defaultMapCenter: [39.9334, 32.8597], // Ankara, Turkey as a default center
  defaultZoom: 6,
  maxZoom: 18,
  // Time in minutes after which reports are considered stale if not verified
  reportStaleTime: 24 * 60, // 24 hours
  // Maximum reports to fetch initially
  maxReports: 100,
  // How often to refresh data (in milliseconds)
  refreshInterval: 60000, // 1 minute
  // Default language
  defaultLanguage: 'tr',
  // Supported languages
  supportedLanguages: ['tr', 'en', 'ar', 'es'],
  // Use local storage instead of Firebase
  useLocalStorage: true
};
