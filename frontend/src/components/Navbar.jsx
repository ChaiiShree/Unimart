import React, { useState, useEffect } from "react";
import "./NavbarStyles.css";
import { MenuItems } from "./MenuItems";
import { Link } from "react-router-dom";
import logo from "../assets/unipal_logo.png";
import { auth, provider } from "../firebaseConfig";
import { signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";

const Navbar = ({ onSearch }) => {
  const [clicked, setClicked] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleClick = () => {
    setClicked(!clicked);
    document.body.classList.toggle('no-scroll', clicked);
  };

  const handleSearchChange = (e) => {
    const searchText = e.target.value;
    setSearchText(searchText);
    onSearch(searchText); // Call onSearch callback with current search text
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

  return (
    <nav className="NavbarItems">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img alt="UniPal Logo" src={logo} width={110} />
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
      </div>
      <div className="menu-icons" onClick={handleClick}>
        <i className={clicked ? "fas fa-times" : "fas fa-bars"}></i>
      </div>
      <ul className={clicked ? "nav-menu active" : "nav-menu"}>
        {MenuItems.map((item, index) => (
          <li key={index}>
            {(!user && (item.title === 'Wishlist' || item.title === 'Sell Your Product')) ? (
              <button className="nav-links login-button" onClick={handleLogin}>
                {item.icon && <i className={item.icon}></i>}
                {item.title}
              </button>
            ) : (
              <Link className={item.cname} to={item.url}>
                {item.icon && <i className={item.icon}></i>}
                {item.title}
              </Link>
            )}
          </li>
        ))}
        <li className="login-button-container">
          {user ? (
            <>
              <Link className="nav-links login-button" to="/profile"><i className="fa fa-user"></i>
                Profile
              </Link>
              <button className="nav-links login-button" onClick={handleLogout}>
                Log Out
              </button>
            </>
          ) : (
            <button className="nav-links login-button" onClick={handleLogin}>
              Log In
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
