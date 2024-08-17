import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig'; // Your Firebase configuration file
import { BACKEND_URL } from '../config'; // Ensure BACKEND_URL does not have a trailing slash

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await axios.get(`${BACKEND_URL}api/wishlist/${user.uid}`);
          setWishlist(response.data);
        } catch (error) {
          console.error('Error fetching wishlist:', error.message);
        }
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (item) => {
    if (user) {
      try {
        const itemInWishlist = wishlist.some(wishlistItem => wishlistItem._id === item._id);
        
        if (itemInWishlist) {
          return { success: false, message: 'Item already in wishlist' };
        }
        
        const response = await axios.post(`${BACKEND_URL}api/wishlist/add`, {
          ...item,
          userId: user.uid,
        });
        setWishlist([...wishlist, response.data]);
        return { success: true };
      } catch (error) {
        console.error('Error adding to wishlist:', error.message);
        return { success: false, message: 'Error adding item to wishlist' };
      }
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (user) {
      try {
        const response = await axios.delete(`${BACKEND_URL}api/wishlist/remove/${itemId}`);
        if (response.status === 200) {
          setWishlist(wishlist.filter((item) => item._id !== itemId));
        } else {
          throw new Error('Failed to remove item from wishlist');
        }
      } catch (error) {
        console.error('Error removing from wishlist:', error.message);
        // Optionally display a toast or alert to notify the user
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
