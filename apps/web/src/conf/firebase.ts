import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'prevezic-dev.firebaseapp.com',
  projectId: 'prevezic-dev',
  storageBucket: 'prevezic-dev.appspot.com',
  messagingSenderId: '756699426455',
  appId: '1:756699426455:web:dff09e29d749583ca903d2',
};

initializeApp(firebaseConfig);
