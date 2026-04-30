
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
