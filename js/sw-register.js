// Service worker is completely disabled to avoid any API dependencies
// This file ensures any existing service workers are unregistered

if ('serviceWorker' in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister().then(function() {
        console.log('ServiceWorker successfully unregistered');
      });
    }
  }).catch(function(error) {
    console.log('ServiceWorker unregistration failed: ', error);
  });
  
  // Clear any service worker caches
  if ('caches' in window) {
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    }).then(function() {
      console.log('Caches cleared');
    }).catch(function(error) {
      console.log('Cache clearing failed: ', error);
    });
  }
  
  console.log('Service workers disabled for this application');
}
