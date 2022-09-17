const firebase = require('firebase/compat/app');

require('firebase/compat/firestore');

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAqxUN-Qrn4J7vKR7ZPcAJAd6GDY3IakqY',
  authDomain: 'ecpe-inventory-bc685.firebaseapp.com',
  projectId: 'ecpe-inventory-bc685',
  storageBucket: 'ecpe-inventory-bc685.appspot.com',
  messagingSenderId: '455942000147',
  appId: '1:455942000147:web:94a91ef13926999af179e6',
};
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebaseApp.firestore();
module.exports = database;
