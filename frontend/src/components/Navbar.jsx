import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuItems } from "./MenuItems";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import logo from "../assets/unipal_logo.png";
import "./NavbarStyles.css";

const Navbar = () => {
  const [clicked, setClicked] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const navigate = useNavigate(); // Get the navigate function

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    setClicked(!clicked);
    document.body.classList.toggle('menu-open');
  };

  let onSearch = (text) => {
    if (text.length > 2) {
      navigate(`/search/${text}`); // Navigate to the search page
    }
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    onSearch(searchText);
  };

  const mobileMenuCleanup = () => {
    if (window.innerWidth <= 960) {
      document.body.classList.toggle('menu-open');
      setClicked(false);
    }
  };

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const email = result.user.email;
      if (email.endsWith("@thapar.edu")) {
        setUser(result.user);
      } else {
        alert("Only Thapar.edu email addresses are allowed to log in.");
        await signOut(auth);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // const handleSearchIconClick = () => {
  //   setShowMobileSearch(!showMobileSearch);
  // };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="UniPal Logo" />
        </Link>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearchChange}
          />
          <button>
            <i className="fas fa-search"></i>
          </button>
        </div>
        <div className="menu-icon" onClick={handleClick}>
          <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
        </div>
        <ul className={clicked ? "nav-menu active" : "nav-menu"}>
          {MenuItems.map((item, index) => (
            <li key={index}>
              {(!user && (item.title === 'Wishlist' || item.title === 'Sell Your Product')) ? (
                <button className="nav-links" onClick={() => {
                  handleLogin();
                  mobileMenuCleanup();
                }}>
                  {item.icon && <i className={item.icon}></i>}
                  {item.title}
                </button>
              ) : (
                <Link className="nav-links" to={item.url} onClick={() => {
                  document.body.classList.toggle('menu-open');
                  setClicked(false);
                }}>
                  {item.icon && <i className={item.icon}></i>}
                  {item.title}
                </Link>
              )}
            </li>
          ))}
          {showMobileSearch && (
            <li className="mobile-search-bar">
              <input
                type="text"
                placeholder="Search..."
                value={searchText}
                onChange={handleSearchChange}
              />
              <button>
                <i className="fas fa-search"></i>
              </button>
            </li>
          )}
          <li>
            {user ? (
              <div className="user-actions">
                <Link className="nav-links" to="/profile" 
                onClick={() => {
                  mobileMenuCleanup();
                }
                }
                >
                  <i className="fa fa-user"></i>
                  Profile
                </Link>
                <button className="nav-links login-button" onClick={() => {
                  handleLogout();
                  mobileMenuCleanup();
                }}>
                  Log Out
                </button>
              </div>
            ) : (
              <button className="nav-links login-button" onClick={() => {
                handleLogin();
                mobileMenuCleanup();
              }}>
                Log In
              </button>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;