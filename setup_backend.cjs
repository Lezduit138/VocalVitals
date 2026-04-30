const fs = require('fs');
const path = require('path');

const functionsDir = path.join(__dirname, 'functions');
const srcDir = path.join(functionsDir, 'src');

if (!fs.existsSync(functionsDir)) fs.mkdirSync(functionsDir);
if (!fs.existsSync(srcDir)) fs.mkdirSync(srcDir);

const dirs = ['auth', 'analysis', 'doctors', 'diseases', 'reports', 'notifications'];
dirs.forEach(d => {
  const p = path.join(srcDir, d);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

fs.writeFileSync(path.join(functionsDir, 'package.json'), JSON.stringify({
  "name": "functions",
  "engines": { "node": "18" },
  "main": "index.js",
  "dependencies": {
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^6.0.0",
    "pdfkit": "^0.15.0"
  }
}, null, 2));

const indexJs = `
const { initializeApp } = require('firebase-admin/app');
initializeApp();

exports.auth = require('./src/auth/onUserCreate');
exports.analysis = require('./src/analysis');
exports.doctors = require('./src/doctors/searchDoctors');
exports.diseases = require('./src/diseases/getDiseaseInfo');
exports.reports = require('./src/reports');
`;
fs.writeFileSync(path.join(functionsDir, 'index.js'), indexJs);

// __ auth/onUserCreate.js __
fs.writeFileSync(path.join(srcDir, 'auth', 'onUserCreate.js'), `
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { auth } = require("firebase-functions/v1");
const { getFirestore } = require("firebase-admin/firestore");

exports.onUserCreate = auth.user().onCreate(async (user) => {
  const db = getFirestore();
  await db.collection('users').doc(user.uid).set({
    email: user.email || null,
    displayName: user.displayName || 'Parent',
    photoURL: user.photoURL || null,
    role: 'parent',
    isGuest: user.providerData.length === 0,
    fcmToken: null,
    language: 'en',
    createdAt: new Date(),
    updatedAt: new Date(),
  });
});
`);

// __ analysis/index.js __
fs.writeFileSync(path.join(srcDir, 'analysis', 'index.js'), `
const uploadAudio = require('./uploadAudio');
const triggerAnalysis = require('./triggerAnalysis');
module.exports = {
  ...uploadAudio,
  ...triggerAnalysis
};
`);

// __ analysis/uploadAudio.js __
fs.writeFileSync(path.join(srcDir, 'analysis', 'uploadAudio.js'), `
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const { getStorage } = require("firebase-admin/storage");

exports.uploadAudio = onCall(async (request) => {
  const { auth, data } = request;
  if (!auth) throw new HttpsError('unauthenticated', 'Login required');

  const db = getFirestore();
  const sessionRef = db.collection('analysisSessions').doc();
  const storagePath = \`audio/\${auth.uid}/\${sessionRef.id}.wav\`;

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
`);

// __ analysis/triggerAnalysis.js __
fs.writeFileSync(path.join(srcDir, 'analysis', 'triggerAnalysis.js'), `
const { onObjectFinalized } = require("firebase-functions/v2/storage");
const { getFirestore } = require("firebase-admin/firestore");
const { getDatabase } = require("firebase-admin/database");

exports.onAudioUploaded = onObjectFinalized(async (event) => {
  const object = event.data;
  if (!object.name.startsWith('audio/')) return;
  const sessionId = object.name.split('/')[2].replace('.wav', '');
  
  const db = getFirestore();
  const rtdb = getDatabase();
  
  await rtdb.ref(\`analysisStatus/\${sessionId}\`).set({
    status: 'processing', progress: 10, message: 'Audio received...', updatedAt: Date.now()
  });

  await db.collection('analysisSessions').doc(sessionId).update({ status: 'processing' });
  
  // MOCK ML RESPONSE FOR NOW
  await rtdb.ref(\`analysisStatus/\${sessionId}\`).update({ progress: 50, message: 'Running AI analysis...' });
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
     await rtdb.ref(\`analysisStatus/\${sessionId}\`).set({ status: 'completed', progress: 100, resultId: resultRef.id, message: 'Complete', updatedAt: Date.now() });
  }, 2000);
});
`);

// MOCK doctors, diseases, reports to complete the structure
fs.writeFileSync(path.join(srcDir, 'doctors', 'searchDoctors.js'), `
const { onCall } = require("firebase-functions/v2/https");
exports.searchDoctors = onCall(async (request) => { return { doctors: [] }; });
`);
fs.writeFileSync(path.join(srcDir, 'diseases', 'getDiseaseInfo.js'), `
const { onCall } = require("firebase-functions/v2/https");
exports.getDiseaseInfo = onCall(async (request) => { return { disease: null }; });
exports.getAllDiseases = onCall(async (request) => { return { diseases: [] }; });
`);
fs.writeFileSync(path.join(srcDir, 'reports', 'index.js'), `
const { onCall } = require("firebase-functions/v2/https");
exports.shareReport = onCall(async (request) => { return { shareUrl: '' }; });
exports.generatePDF = onCall(async (request) => { return { pdfUrl: '' }; });
`);

console.log('Backend scaffolded.');
