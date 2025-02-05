// server/config/firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./socialmediaimages-a0839-firebase-adminsdk-fbsvc-52d4c4a270.json'); // Firebase service account key

// Initialize Firebase Admin only if it hasn't been initialized already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://socialmedia-8f7cb.appspot.com',
  });
}

const bucket = admin.storage().bucket();
module.exports = bucket;
