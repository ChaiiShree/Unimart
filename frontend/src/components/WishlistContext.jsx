import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig'; // Your Firebase configuration file
import { BACKEND_URL } from '../config';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [user] = useAuthState(auth);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (user) {
        try {
          const response = await axios.get(`${BACKEND_URL}/api/wishlist/${user.uid}`);
          setWishlist(response.data);
        } catch (error) {
          console.error('Error fetching wishlist:', error);
        }
      }
    };

    fetchWishlist();
  }, [user]);

  const addToWishlist = async (item) => {
    if (user) {
      try {
        // Check if the item is already in the wishlist
        const itemInWishlist = wishlist.some(wishlistItem => wishlistItem._id === item._id);
        
        if (itemInWishlist) {
          // Return a specific error message if the item is already in the wishlist
          return { success: false, message: 'Item already in wishlist' };
        }
        
        const response = await axios.post(BACKEND_URL + '/api/wishlist/add', {
          ...item,
          userId: user.uid,
        });
        setWishlist([...wishlist, response.data]);
        return { success: true };
      } catch (error) {
        console.error('Error adding to wishlist:', error);
        return { success: false, message: 'Product Already in Wishlist' };
      }
    }
  };

  const removeFromWishlist = async (itemId) => {
    if (user) {
      try {
        await axios.delete( BACKEND_URL + `api/wishlist/remove/${itemId}`);
        setWishlist(wishlist.filter((item) => item._id !== itemId));
      } catch (error) {
        console.error('Error removing from wishlist:', error);
      }
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
