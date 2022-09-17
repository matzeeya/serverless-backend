/* eslint-disable node/no-unsupported-features/es-syntax */
// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage';

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
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const storage = firebase.storage().ref();
export default database;
