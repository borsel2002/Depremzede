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
  useLocalStorage: true,
  // Enable peer-to-peer communication for distributed deployment
  enableP2P: true,
  // Required number of verifications to mark a report as verified
  requiredVerifications: 3,
  // Required number of resolutions to mark a report as resolved
  requiredResolutions: 5,
  // Map tile server URLs (for redundancy)
  mapTileSources: [
    {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    {
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>'
    }
  ]
};
