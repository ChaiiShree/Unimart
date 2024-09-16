import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./routes/Home";
import About from "./routes/About";
import SellProduct from "./routes/sellproduct";
import Wishlist from "./components/Wishlist";
import Profile from "./routes/Profile";
import Loader from "./components/Loading";
import { WishlistProvider } from "./components/WishlistContext";
import { auth, provider } from "./firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import Disclaimer from "./components/Disclaimer";

// Protected Route Component
const ProtectedRoute = ({ user, children }) => {
  
  if (!user) {
    return <Navigate to="/home" />;
  }
  return children;
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (user) { 
      fetch(BACKEND_URL + `api/user/${user.uid}`)
        .then(res => res.json())
        .then(userData => {
          setShowDisclaimer(!userData.hasAcceptedDisclaimer);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });
    }else{
      //check from local storage
      const disclaimerAccepted = localStorage.getItem('disclaimerAccepted');
      if(disclaimerAccepted){
        setShowDisclaimer(false);
      }else{
        setShowDisclaimer(true);
      }
    }
  }, [user]);


  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsLoading(false);
    }

  

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        if (currentUser.email.endsWith("@thapar.edu")) {
          setUser(currentUser);
          localStorage.setItem("user", JSON.stringify(currentUser));
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

  if (isLoading) {
    return <Loader setIsLoading={setIsLoading} />;
  }

  return (
    <WishlistProvider>
      <Router>
        {authError && <div className="error">{authError}</div>} {/* Display Error */}

        {showDisclaimer && <Disclaimer onClose={() => setShowDisclaimer(false)} />} {/* Display Disclaimer */}
        
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