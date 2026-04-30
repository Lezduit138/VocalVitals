
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { getFirestore } = require("firebase-admin/firestore");
const { getDatabase } = require("firebase-admin/database");

exports.onAudioUploaded = onObjectFinalized(async (event) => {
  const object = event.data;
  if (!object.name.startsWith('audio/')) return;
  const sessionId = object.name.split('/')[2].replace('.wav', '');
  
  const db = getFirestore();
  const rtdb = getDatabase();
  
  await rtdb.ref(`analysisStatus/${sessionId}`).set({
    status: 'processing', progress: 10, message: 'Audio received...', updatedAt: Date.now()
  });

  await db.collection('analysisSessions').doc(sessionId).update({ status: 'processing' });
  
  // MOCK ML RESPONSE FOR NOW
  await rtdb.ref(`analysisStatus/${sessionId}`).update({ progress: 50, message: 'Running AI analysis...' });
  setTimeout(async () => {
     const resultRef = db.collection('analysisResults').doc();
     await resultRef.set({
       sessionId,
       userId: object.name.split('/')[1],
       childId: 'mock-child',
       primaryCondition: 'Asthma',
       primaryConfidence: 0.85,
       severity: 'moderate',
       recommendedSpecialties: ['Pulmonologist'],
       createdAt: new Date()
     });
     await db.collection('analysisSessions').doc(sessionId).update({ status: 'completed', completedAt: new Date() });
     await rtdb.ref(`analysisStatus/${sessionId}`).set({ status: 'completed', progress: 100, resultId: resultRef.id, message: 'Complete', updatedAt: Date.now() });
  }, 2000);
});
