/* Minimal service worker - prevents 404 from PWA/browser requests */
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => self.clients.claim())
