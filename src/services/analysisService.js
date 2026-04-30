import { functions, storage, rtdb, db } from '../lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { ref as storageRef, uploadBytes } from 'firebase/storage';
import { ref as rtdbRef, onValue } from 'firebase/database';
import { collection, query, where, getDocs } from 'firebase/firestore';

const uploadAudioFn = httpsCallable(functions, 'uploadAudio');

export const submitAnalysis = async (audioBlob, childId, childData, userLocation) => {
  const { data } = await uploadAudioFn({
    childId,
    audioDurationSeconds: childData.duration || 5,
    audioFormat: 'wav',
    isOffline: !navigator.onLine,
    deviceId: localStorage.getItem('deviceId'),
    userLocation,
  });

  const audioFile = new File([audioBlob], `${data.sessionId}.wav`, { type: 'audio/wav' });
  const fileRef = storageRef(storage, data.storagePath);
  await uploadBytes(fileRef, audioFile);

  return data.sessionId;
};

export const listenToAnalysisStatus = (sessionId, callback) => {
  const statusRef = rtdbRef(rtdb, `analysisStatus/${sessionId}`);
  const unsubscribe = onValue(statusRef, (snap) => {
    if (snap.exists()) callback(snap.val());
  });
  return unsubscribe; 
};

export const getAnalysisResult = async (sessionId) => {
  const q = query(
    collection(db, 'analysisResults'),
    where('sessionId', '==', sessionId)
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return { id: snap.docs[0].id, ...snap.docs[0].data() };
};
