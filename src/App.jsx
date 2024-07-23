// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./routes/Home";
import About from "./routes/About";
import SellProduct from "./routes/sellproduct";
import Wishlist from "./components/Wishlist";
import Profile from "./routes/Profile";
import Loader from "./components/Loading";
import { WishlistProvider } from "./components/WishlistContext";
import { auth } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        localStorage.setItem("user", JSON.stringify(currentUser));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <Loader setIsLoading={setIsLoading} />;
  }

  return (
    <WishlistProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sellproduct" element={<SellProduct />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </WishlistProvider>
  );
}

export default App;
