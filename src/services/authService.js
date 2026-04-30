import { auth, db, googleProvider } from '../lib/firebase';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithPopup, signInAnonymously, signOut, sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

export const registerWithEmail = async (email, password, name) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await setDoc(doc(db, 'users', cred.user.uid), {
    email, displayName: name, role: 'parent',
    isGuest: false, fcmToken: null, language: 'en',
    createdAt: new Date(), updatedAt: new Date()
  });
  return cred.user;
};

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const loginAsGuest = () => signInAnonymously(auth);
export const logoutUser = () => signOut(auth);
export const resetPassword = (email) => sendPasswordResetEmail(auth, email);
