import { initializeApp } from 'firebase/app';
import { connectAuthEmulator, getAuth } from 'firebase/auth';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: 'prevezic-dev.firebaseapp.com',
  projectId: 'prevezic-dev',
  storageBucket: 'prevezic-dev.appspot.com',
  messagingSenderId: '756699426455',
  appId: '1:756699426455:web:dff09e29d749583ca903d2',
};

const app = initializeApp(firebaseConfig);

if (import.meta.env.DEV) {
  const auth = getAuth();
  connectAuthEmulator(auth, 'http://192.168.1.10:9099', { disableWarnings: true });

  const db = getFirestore();
  connectFirestoreEmulator(db, '192.168.1.10', 8081);

  const functions = getFunctions(app);
  connectFunctionsEmulator(functions, '192.168.1.10', 5001);
}
