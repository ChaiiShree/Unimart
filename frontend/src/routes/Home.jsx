import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useWishlist } from "../components/WishlistContext";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebaseConfig';
import firebase from 'firebase/compat/app';
import { BACKEND_URL } from "../config";
import { FaHeart, FaFilter } from 'react-icons/fa';
import Lottie from "react-lottie";
import loadingAnimation from "../animations/loading.json"; // Make sure to add this JSON file
import "./Home.css";

const Home = () => {
  const { addToWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [hostel, setHostel] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState("");
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
        const response = await fetch(`${BACKEND_URL}api/products`);
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
  }, []);

  useEffect(() => {
    filterProducts();
  }, [category, hostel, searchText, products]);

  const filterProducts = () => {
    let tempProducts = products;

    if (category) {
      tempProducts = tempProducts.filter(product => product.category === category);
    }

    if (hostel) {
      tempProducts = tempProducts.filter(product => product.hostel === hostel);
    }

    if (searchText) {
      tempProducts = tempProducts.filter(product =>
        product.productName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    setFilteredProducts(tempProducts);
  };

  const handleSearch = (text) => {
    setSearchText(text);
  };

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
      return <div className="no-products">No products found.</div>;
    }

    return filteredProducts.map((product) => (
      <div key={product._id} className="product-card">
        <div className="product-image-container">
          <img src={product.images[0]} alt={product.productName} className="product-image" />
          {/* <button className="wishlist-btn" onClick={() => handleAddToWishlist(product)}>
            <FaHeart />
          </button> */}
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
        <div className="filter-section">
          <button onClick={() => setShowFilters(!showFilters)} className="filter-toggle">
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          {showFilters && (
            <div className="filters">
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">All Categories</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Stationery">Stationery</option>
                <option value="Furniture">Furniture</option>
                <option value="Kitchenware">Kitchenware</option>
                <option value="Accessories">Accessories</option>
                <option value="Bicycles">Bicycles</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Room Decor">Home Decor</option>
                <option value="Food Items">Food Items</option>
                <option value="Health & Fitness">Health & Fitness</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                <option value="Others">Others</option>
              </select>
              <select value={hostel} onChange={(e) => setHostel(e.target.value)}>
                <option value="">All Hostels</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="G">G</option>
                <option value="H">H</option>
                <option value="I">I</option>
                <option value="J">J</option>
                <option value="K">K</option>
                <option value="L">L</option>
                <option value="M">M</option>
                <option value="N">N</option>
                <option value="O">O</option>
                <option value="PG">PG</option>
                <option value="Q">Q</option>
              </select>
            </div>
          )}
        </div>
        <div className="products-grid">
          {renderProducts()}
        </div>
      </div>
      <Footer />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Home;