self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    // Open the app when they tap the notification
    event.waitUntil(
      clients.openWindow('https://biu-students-hub.firebaseapp.com/calendar.html')
    );
  });