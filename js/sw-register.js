// Service worker is completely disabled to avoid any API dependencies
// This file ensures any existing service workers are unregistered

if ('serviceWorker' in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    if (registrations.length > 0) {
      console.log(`Found ${registrations.length} service worker registrations to remove`);
      
      return Promise.all(
        registrations.map(registration => {
          return registration.unregister().then(() => {
            console.log('ServiceWorker successfully unregistered');
          });
        })
      );
    } else {
      console.log('No service workers found to unregister');
    }
  }).then(() => {
    // Clear any service worker caches
    if ('caches' in window) {
      return caches.keys().then(cacheNames => {
        if (cacheNames.length > 0) {
          console.log(`Found ${cacheNames.length} caches to clear`);
          
          return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          ).then(() => {
            console.log('All caches cleared successfully');
          });
        } else {
          console.log('No caches found to clear');
        }
      });
    }
  }).catch(function(error) {
    console.error('Error during service worker cleanup:', error);
  });
  
  console.log('Service workers disabled for this application');
}
