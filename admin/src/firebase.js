// src/firebase.js
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.REACT_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { auth };
