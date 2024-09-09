// src/App.js
import React, { useState, useEffect } from "react";
import ProductTable from "./components/ProductTable";
import UserTable from "./components/UserTable";
import Login from "./components/Login";
import { auth } from "./firebase";
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

  return (
    <div className="App">
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
