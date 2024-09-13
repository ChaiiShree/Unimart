// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// Use Vite's import.meta.env for Firebase config
const firebaseConfig = {

  apiKey: "AIzaSyANtMPzEO6lEQ9DB79JPnztOoKdtHY6LYc",
  authDomain: "unimart-d57bc.firebaseapp.com",
  databaseURL: "https://unimart-d57bc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "unimart-d57bc",
  storageBucket: "unimart-d57bc.appspot.com",
  messagingSenderId: "553313828640",
  appId: "1:553313828640:web:501ace36850ac04d922145",
  measurementId: "G-327YKHYJRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app); // Only call this if you are using Firebase Analytics
const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
