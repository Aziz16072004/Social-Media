// /config/firebaseConfig.js
const admin = require('firebase-admin');
const serviceAccount = require('./socialmedia-8f7cb-firebase-adminsdk-nrbk0-d578b2ce14.json'); // Adjust the path as necessary

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://socialmedia-8f7cb.appspot.com',  // Your Firebase Storage bucket
});

const bucket = admin.storage().bucket();  // Get the storage bucket
module.exports = bucket;  // Export the bucket for use in other files
