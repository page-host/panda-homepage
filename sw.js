self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('notificationclick', function(event) {
  const dateKey = event.notification.data ? event.notification.data.dateKey : '';
  const url = event.notification.data ? event.notification.data.url : '/';
  
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(clientList) {
      // Look for already open tabs
      for (let client of clientList) {
        if (client.url.split('?')[0].replace(/\/$/, "") === url.replace(/\/$/, "") && 'focus' in client) {
          // Send message to index.html to navigate
          client.postMessage({ type: 'OPEN_DATE', dateKey: dateKey });
          return client.focus();
        }
      }
      // If no tab open, open a new one with deep link
      if (clients.openWindow) return clients.openWindow(`${url}?openDate=${dateKey}`);
    })
  );
});