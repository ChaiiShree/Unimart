import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import "./Profile.css"; // Import styles from Profile.css

const Profile = () => {
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null); // State to store additional user data
  const [products, setProducts] = useState([]); // State to store user products
  const [isEditing, setIsEditing] = useState(false); // State to track if the user is entering data
  const [formData, setFormData] = useState({
    rollNumber: "",
    branch: "",
    passingOutYear: "",
  }); // State to store form data

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/user/${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setUserData(data);
          // Populate form data from fetched user data
          setFormData({
            rollNumber: data.rollNumber || "",
            branch: data.branch || "",
            passingOutYear: data.passingOutYear || "",
          });
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchUserProducts = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/user/${user.uid}`);
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error("Failed to fetch user products");
        }
      } catch (error) {
        console.error("Error fetching user products:", error);
      }
    };

    if (user) {
      fetchUserData();
      fetchUserProducts();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/user/${user.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: user.uid, ...formData }),
      });
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setIsEditing(false);
      } else {
        console.error("Failed to save user data");
      }
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  const handleRemoveProduct = async (productId, productName) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete "${productName}"?`);
    if (confirmDelete) {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${productId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setProducts(products.filter((product) => product._id !== productId));
        } else {
          console.error("Failed to remove product");
        }
      } catch (error) {
        console.error("Error removing product:", error);
      }
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-content">
          <h1>Profile</h1>
          {user && (
            <div className="profile-details">
              <img src={user.photoURL} alt="Profile" className="profile-picture" />
              <p>
                <strong>Name:</strong> {user.displayName}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              {userData && !isEditing ? (
                <div>
                  <p>
                    <strong>Roll Number:</strong> {userData.rollNumber}
                  </p>
                  <p>
                    <strong>Branch:</strong> {userData.branch}
                  </p>
                  <p>
                    <strong>Passing Out Year:</strong> {userData.passingOutYear}
                  </p>
                  <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
              ) : (
                <div>
                  <form onSubmit={handleSubmit}>
                    <input
                      type="text"
                      name="rollNumber"
                      placeholder="Roll Number"
                      value={formData.rollNumber}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="text"
                      name="branch"
                      placeholder="Branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      required
                    />
                    <input
                      type="number"
                      name="passingOutYear"
                      placeholder="Passing Out Year"
                      value={formData.passingOutYear}
                      onChange={handleInputChange}
                      required
                    />
                    <button type="submit">Save</button>
                  </form>
                </div>
              )}
            </div>
          )}
          <h2>Your Products</h2>
          {products.length > 0 ? (
            <ul className="product-list">
              {products.map((product) => (
                <li key={product._id} className="product-item">
                  <img src={`data:image/jpeg;base64,${product.images[0]}`} // Assuming first image for simplicity
          alt={product.productName}
          className="product-image" />
                  <div className="product-details">
                    <h3>{product.productName}</h3>
                    <p>{product.description}</p>
                    <p>Price: {product.price}</p>
                    <p>Hostel: {product.hostel}</p>
                    <button onClick={() => handleRemoveProduct(product._id, product.productName)}>Remove</button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No products uploaded yet.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
