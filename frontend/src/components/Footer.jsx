// Footer.jsx
import React, { useState } from "react";
import axios from "axios";
import "./FooterStyles.css";
import { BACKEND_URL } from "../config";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleJoinClick = async () => {
    try {
      const response = await axios.post(BACKEND_URL + "api/subscribe", { email });
      alert("Thank you for joining our community!");
      setEmail("");
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("This email is already subscribed.");
      } else {
        console.error("Error subscribing:", error.response ? error.response.data : error.message);
        alert("There was an error. Please try again.");
      }
    }
  };

  return (
    <div className="footer">
      <div className="top">
        <div>
          <h1 className="footer-title">JOIN OUR COMMUNITY</h1>
          <p className="footer-subtitle">
            Be the first to hear about our Newest Products
          </p>
          <div className="email-container">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
              className="email-input"
            />
            <button onClick={handleJoinClick} className="join-button">
              Join
            </button>
          </div>
        </div>
      </div>
      
      <div className="bottom">
        <div className="left-section">
          <h4>Stay in the know</h4>
          <p>Follow our socials</p>
          <div className="social-links">
          <a href=" https://www.instagram.com/uniipal?igsh=aXAybTloMXZ3aTZh&utm_source=qr " target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-instagram"></i>
            </a>
            <a href="mailto:unipalmark@gmail.com" target="_blank" rel="noopener noreferrer">
    <i className="fa-solid fa-envelope"></i>
</a>
            <a href="https://x.com/uniipal " target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-twitter"></i>
            </a>
            <a href="https://www.linkedin.com/in/unipal-marketplace/?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin"></i>
            </a>
          </div>
        </div>
        <hr className="footer-divider" />
        <div className="right-section">
          <h4>UniiPal</h4>
          <p>
            UniiPal is the ultimate college marketplace where students can buy, sell, and trade with ease. Join our community and be a part of the revolution.
          </p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2024 UniiPal</p>
      </div>
    </div>
  );
};

export default Footer;
