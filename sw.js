// sw.js
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://biu-students-hub.firebaseapp.com/calendar.html')
  );
});