import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyAx8BKVXcJg7RVxWXYRcGLH5sXbrKKKRyQ",
  authDomain: "vocalvitals-125bd.firebaseapp.com",
  projectId: "vocalvitals-125bd",
  storageBucket: "vocalvitals-125bd.firebasestorage.app",
  messagingSenderId: "793474588394",
  appId: "1:793474588394:web:4fa27465f33224b2f70193",
  measurementId: "G-CND2VZZ1C1"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);
export const functions = getFunctions(app);
export const googleProvider = new GoogleAuthProvider();
