const admin = require('firebase-admin');
const serviceAccount = require('./socialmedia-8f7cb-firebase-adminsdk-nrbk0-e7e713b56b.json'); 
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://socialmedia-8f7cb.appspot.com',
});

const bucket = admin.storage().bucket(); 
module.exports = bucket; 
