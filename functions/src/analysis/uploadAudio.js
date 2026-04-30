
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

exports.uploadAudio = onCall(async (request) => {
  const { auth, data } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'Login required');

  const db = getFirestore();
  const sessionRef = db.collection('analysisSessions').doc();
  const storagePath = `audio/${auth.uid}/${sessionRef.id}.wav`;

  await sessionRef.set({
    userId: auth.uid,
    childId: data.childId,
    audioStoragePath: storagePath,
    audioDurationSeconds: data.audioDurationSeconds,
    audioFormat: data.audioFormat || 'wav',
    status: 'uploaded',
    isOfflineSubmission: data.isOffline || false,
    deviceId: data.deviceId || null,
    createdAt: new Date(),
    completedAt: null,
  });

  const bucket = getStorage().bucket();
  const [uploadUrl] = await bucket.file(storagePath).getSignedUrl({
    version: 'v4',
    action: 'write',
    expires: Date.now() + 10 * 60 * 1000, 
    contentType: 'audio/wav',
  });

  return { sessionId: sessionRef.id, uploadUrl, storagePath };
});
