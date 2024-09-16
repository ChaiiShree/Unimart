import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../components/WishlistContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import { BACKEND_URL } from "../config";
import Lottie from "react-lottie";
import loadingAnimation from "../animations/loading.json";

const Search = () => {
  const { searchTerm } = useParams(); 
  const { addToWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);

  const lottieOptions = {
    loop: true,
    autoplay: true,
    animationData: loadingAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}api/products/search?q=${searchTerm}`);
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchTerm]);

  const handleAddToWishlist = async (product) => {
    if (!user) {
      toast.warn("Please log in to add items to your wishlist");
      auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider());
      return;
    }

    const result = await addToWishlist(product);
    if (result.success) {
      toast.success("Added to Wishlist");
    } else {
      toast.warn(result.message);
    }
  };

  const renderProducts = () => {
    if (loading) {
      return (
        <div className="loading">
          <Lottie options={lottieOptions} height={150} width={150} />
          <p>Loading products...</p>
        </div>
      );
    }

    if (filteredProducts.length === 0) {
      return <div className="no-products">No products found for "{searchTerm}".</div>;
    }

    return filteredProducts.map((product) => (
      <div key={product._id} className="product-card">
        <div className="product-image-container">
          <img src={product.images[0]} alt={product.productName} className="product-image" />
        </div>
        <div className="product-details">
          <h2>{product.productName}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-hostel">Hostel: {product.hostel}</p>
          <p className="product-price">₹{product.price}</p>

          <button className="btn_classic" onClick={() => handleAddToWishlist(product)}>
            Add to Wishlist
          </button>
        </div>
      </div>
    ));
  };

  return (
    <div className="home-container">
      <div className="products-page page">
        <h2>Search Results for "{searchTerm}"</h2>
        <div className="products-grid">
          {renderProducts()}
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Search;