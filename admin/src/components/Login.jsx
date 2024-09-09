// src/components/Login.jsx
import React from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebase";

const Login = () => {
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;

      // Hardcode the allowed emails (You can later manage this via a database if needed)
      const allowedEmails = [
        "dgoyal5_be22@thapar.edu",
        "cjayant_be22@thapar.edu",
        "athukral1_be22@thapar.edu",
        "jmalik_be22@thapar.edu",
        "jkaur4_be22@thapar.edu"
      ];

      // Check if the logged-in user's email is in the allowed emails list
      if (!allowedEmails.includes(email)) {
        alert("Access denied. You are not an authorized user.");
        // Sign out the unauthorized user
        await signOut(auth);
      } else {
        alert("Login successful!");
        // Proceed with application logic or redirect to the protected page
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
