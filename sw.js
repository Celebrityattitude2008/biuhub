importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBsVbLw4mvFTJhmORUXCUNyGc98Rripj3M",
  authDomain: "biu-students-hub.firebaseapp.com",
  projectId: "biu-students-hub",
  storageBucket: "biu-students-hub.firebasestorage.app",
  messagingSenderId: "128818531382",
  appId: "1:128818531382:web:190dc5688d1b9d21321c97"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message:', payload);
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png'
  });
});