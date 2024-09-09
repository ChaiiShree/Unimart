// src/App.js
import React, { useState, useEffect } from "react";
import ProductTable from "./components/ProductTable";
import UserTable from "./components/UserTable";
import Login from "./components/Login";
import { auth, signOut } from "./firebase";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </header>
      {!user ? (
        <Login />
      ) : (
        <>
          <h1>Admin Dashboard</h1>
          <UserTable />
          <ProductTable />
        </>
      )}
    </div>
  );
}

export default App;
