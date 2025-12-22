// SW Version 1.0.1 - PWA Mobile Optimized
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('notificationclick', function(event) {
  const data = event.notification.data || {};
  const dateKey = data.dateKey || '';
  const url = data.url || '/';
  
  event.notification.close();
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Look for already open tabs
      for (let client of clientList) {
        const clientUrl = client.url.split('?')[0].replace(/\/$/, "");
        const targetUrl = url.split('?')[0].replace(/\/$/, "");
        
        if (clientUrl === targetUrl && 'focus' in client) {
          client.postMessage({ type: 'OPEN_DATE', dateKey: dateKey });
          return client.focus();
        }
      }
      // If no tab open, open a new one with deep link
      if (self.clients.openWindow) {
        return self.clients.openWindow(`${url}?openDate=${dateKey}`);
      }
    })
  );
});

// Handle simple push if it ever gets implemented via server
self.addEventListener('push', function(event) {
  const data = event.data ? event.data.json() : { title: '4AM Events', body: 'New academic update!' };
  const options = {
    body: data.body,
    icon: 'assets/cal.png',
    badge: 'assets/cal.png'
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
