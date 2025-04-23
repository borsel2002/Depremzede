// Service worker registration is completely disabled
if ('serviceWorker' in navigator) {
  // Unregister all service workers
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister().then(function() {
        console.log('ServiceWorker successfully unregistered');
      });
    }
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
    });
  }
}
