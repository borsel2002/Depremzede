// This is a minimal placeholder service worker
// Service workers are disabled in this application via sw-register.js

// This file exists only for structure and to be properly unregistered
// No actual service worker functionality is implemented

self.addEventListener('install', event => {
  self.skipWaiting();
  console.log('Service worker install event - but service workers are disabled');
});

self.addEventListener('activate', event => {
  console.log('Service worker activate event - but service workers are disabled');
});

self.addEventListener('fetch', event => {
  // Pass through all fetch events to the browser
  // No caching or offline functionality is implemented
});
