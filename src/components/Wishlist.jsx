import React from "react";
import { useWishlist } from "./WishlistContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./Wishlist.css";

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();

  const renderWishlistItems = () => {
    return wishlist.map((item) => (
      <div key={item._id} className="wishlist-item">
        {/* Assuming item.images is an array of base64 encoded strings */}
        {item.images.map((image, index) => (
          <img
            key={index}
            src={`data:image/jpeg;base64,${image}`}
            alt={`${item.productName}-${index}`}
            className="wishlist-image"
          />
        ))}
        <div className="wishlist-details">
          <h2>{item.productName}</h2>
          <p>{item.description}</p>
          <p>Hostel: {item.hostel}</p>
          <p>Price: ₹{item.price}</p>
          {item.telegramUsername ? (
            <a
              href={`https://t.me/${item.telegramUsername}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="chat-button">Start Chatting on Telegram</button>
            </a>
          ) : item.whatsappNumber ? (
            <a
              href={`https://wa.me/${item.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="chat-button">Start Chatting on WhatsApp</button>
            </a>
          ) : (
            <p>No contact information provided.</p>
          )}
          <button
            className="remove-button"
            onClick={() => removeFromWishlist(item._id)}
          >
            ✖
          </button>
        </div>
      </div>
    ));
  };

  return (
    <>
      <Navbar />
      <div className="wishlist-container">
        <h1>Wishlist</h1>
        {wishlist.length > 0 ? (
          renderWishlistItems()
        ) : (
          <p>Your Wishlist is empty</p>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Wishlist;
