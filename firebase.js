const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://koyidakanka-6474e-default-rtdb.firebaseio.com',
});

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
