// src/components/Login.jsx
import React from "react";
import { auth } from "../firebase";
import firebase from "firebase/app";

const Login = () => {
  const handleGoogleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      const email = result.user.email;

      // Get allowed emails from .env
      const allowedEmails = import.meta.env.VITE_ALLOWED_EMAILS.split(",");
      if (!allowedEmails.includes(email)) {
        alert("Access denied. You are not an authorized user.");
        await auth.signOut();
      } else {
        alert("Login successful!");
        // Proceed with application logic
      }
    } catch (error) {
      console.error("Error logging in with Google:", error);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
};

export default Login;
