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
import { signOut, onAuthStateChanged } from "firebase/auth";
import PropTypes from 'prop-types';
import "./App.css"; // Ensure you add modal styling here

// Disclaimer Modal Component
const DisclaimerModal = ({ onAccept }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Disclaimer</h2>
        <p>
          The website is managed by Team Unipal, and TIET is not responsible for any sort of purchases or quality issues.
        </p>
        <button onClick={onAccept}>I Accept</button>
      </div>
    </div>
  );
};

DisclaimerModal.propTypes = {
  onAccept: PropTypes.func.isRequired,
};

// Protected Route Component
const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    return <Navigate to="/home" />;
  }
  return children;
};

ProtectedRoute.propTypes = {
  user: PropTypes.object,
  children: PropTypes.node.isRequired,
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(false); // Track if disclaimer needs to be shown

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const disclaimerAccepted = localStorage.getItem("disclaimerAccepted");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setShowDisclaimer(!disclaimerAccepted); // Show disclaimer if not accepted
      setIsLoading(false);
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.email.endsWith("@thapar.edu")) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
          if (!disclaimerAccepted) {
            setShowDisclaimer(true); // Show disclaimer if not accepted
          }
        } else {
          setAuthError("Only Thapar.edu email addresses are allowed to log in.");
          handleLogout();
        }
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleAcceptDisclaimer = () => {
    localStorage.setItem("disclaimerAccepted", "true");
    setShowDisclaimer(false);
  };

  if (isLoading) {
    return <Loader setIsLoading={setIsLoading} />;
  }

  return (
    <WishlistProvider>
      <Router>
        {authError && <div className="error">{authError}</div>} {/* Display Error */}
        {showDisclaimer && <DisclaimerModal onAccept={handleAcceptDisclaimer} />} {/* Show Disclaimer Modal */}
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/sellproduct" element={
            <ProtectedRoute user={user}>
              <SellProduct />
            </ProtectedRoute>
          }/>
          <Route path="/wishlist" element={
            <ProtectedRoute user={user}>
              <Wishlist />
            </ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute user={user}>
              <Profile />
            </ProtectedRoute>
          }/>
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </WishlistProvider>
  );
}

export default App;
