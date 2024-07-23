import React, { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './sellproduct.css';

function SellProduct() {
  const [formData, setFormData] = useState({
    sellerName: "",
    productName: "",
    category: "",
    description: "",
    price: "",
    images: [], // Changed to an array for multiple images
    hostel: "",
    quantity: "",
    contactOption: "", // No default value for dropdown
    contactValue: "" // Store the value for Telegram username or WhatsApp number
  });

  const [user] = useAuthState(auth); // Get the currently logged-in user

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Ensure the total size of images does not exceed 1.5MB
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 1.5 * 1024 * 1024) {
      toast.error("Total file size exceeds 1.5MB. Please choose smaller files.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64Image = reader.result.split(',')[1]; // Extract only the base64 data
      setFormData(prevData => ({
        ...prevData,
        images: [...prevData.images, base64Image]
      }));
    };

    files.forEach(file => reader.readAsDataURL(file));
  };

  const validateForm = () => {
    const { sellerName, productName, category, description, price, images, hostel, quantity, contactOption, contactValue } = formData;
    
    if (!sellerName || !productName || !category || category === "" || !description || !price || images.length === 0 || !hostel || hostel === "" || !quantity || !contactOption || !contactValue) {
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const { sellerName, productName, category, description, price, images, hostel, quantity, contactOption, contactValue } = formData;

    const productData = {
      sellerName,
      productName,
      category,
      description,
      price: Number(price), // Ensure price is converted to number
      images,
      hostel,
      quantity: Number(quantity), // Ensure quantity is converted to number
      uid: user.uid,
      telegramUsername: contactOption === "telegram" ? contactValue : "",
      whatsappNumber: contactOption === "whatsapp" ? contactValue : ""
    };

    try {
      const response = await fetch("https://uniipal.vercel.app/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message || "Product Uploaded");
        setFormData({
          sellerName: "",
          productName: "",
          category: "",
          description: "",
          price: "",
          images: [], // Reset images array
          hostel: "",
          quantity: "",
          contactOption: "", // Reset to default option
          contactValue: ""
        });
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to upload product. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="sell-product-container">
        <h2>Sell Your Product</h2>
        <form className="sell-product-form" onSubmit={handleSubmit}>
          <FormField
            label="Seller Name *"
            id="sellerName"
            name="sellerName"
            type="text"
            required
            value={formData.sellerName}
            onChange={handleChange}
          />
          <FormField
            label="Contact Info *"
            id="contactOption"
            name="contactOption"
            type="select"
            required
            value={formData.contactOption}
            onChange={handleChange}
            options={[
              { value: "", label: "Select Contact Info" },
              { value: "telegram", label: "Telegram Username" },
              { value: "whatsapp", label: "WhatsApp Number" }
            ]}
          />
          {formData.contactOption && (
            <FormField
              label={formData.contactOption === "telegram" ? "Telegram Username *" : "WhatsApp Number *"}
              id="contactValue"
              name="contactValue"
              type="text"
              required
              value={formData.contactValue}
              onChange={handleChange}
            />
          )}
          <FormField
            label="Product Name *"
            id="productName"
            name="productName"
            type="text"
            required
            value={formData.productName}
            onChange={handleChange}
          />
<FormField
  label="Category *"
  id="category"
  name="category"
  type="select"
  required
  value={formData.category}
  onChange={handleChange}
  options={[
    { value: "", label: "Select Category" },
    { value: "Electronics", label: "Electronics" },
    { value: "Clothing", label: "Clothing" },
    { value: "Books", label: "Books" },
    { value: "Sports", label: "Sports" },
    { value: "Stationery", label: "Stationery" },
    { value: "Furniture", label: "Furniture" },
    { value: "Kitchenware", label: "Kitchenware" },
    { value: "Accessories", label: "Accessories" },
    { value: "Bicycles", label: "Bicycles" },
    { value: "Musical Instruments", label: "Musical Instruments" },
    { value: "Room Decor", label: "Room Decor" },
    { value: "Food Items", label: "Food Items" },
    { value: "Health & Fitness", label: "Health & Fitness" },
    { value: "Beauty & Personal Care", label: "Beauty & Personal Care" },
    { value: "Others", label: "Others" }
  ]}
/>
          <FormField
            label="Description *"
            id="description"
            name="description"
            type="textarea"
            required
            value={formData.description}
            onChange={handleChange}
          />
          <FormField
            label="Price *"
            id="price"
            name="price"
            type="number"
            required
            value={formData.price}
            onChange={handleChange}
          />
          <FormField
            label="Images *"
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple // Allow multiple image selection
            required
            onChange={handleFileChange}
          />
<FormField
  label="Hostel *"
  id="hostel"
  name="hostel"
  type="select"
  required
  value={formData.hostel}
  onChange={handleChange}
  options={[
    { value: "", label: "Select Hostel" },
    { value: "A", label: "A" },
    { value: "B", label: "B" },
    { value: "C", label: "C" },
    { value: "D", label: "D" },
    { value: "E", label: "E" },
    { value: "G", label: "G" },
    { value: "H", label: "H" },
    { value: "I", label: "I" },
    { value: "J", label: "J" },
    { value: "K", label: "K" },
    { value: "L", label: "L" },
    { value: "M", label: "M" },
    { value: "N", label: "N" },
    { value: "O", label: "O" },
    { value: "PG", label: "PG" },
    { value: "Q", label: "Q" },
    { value: "R", label: "R" },
    { value: "S", label: "S" },
    { value: "T", label: "T" },
    { value: "U", label: "U" }
  ]}
/>
          <FormField
            label="Quantity *"
            id="quantity"
            name="quantity"
            type="number"
            required
            value={formData.quantity}
            onChange={handleChange}
          />
          <button type="submit" className="submit-button">Upload Product</button>
        </form>
      </div>
      <Footer />
      <ToastContainer />
    </>
  );
}

function FormField({ label, id, name, type, value, onChange, options, required, accept, multiple }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      {type === 'select' ? (
        <select id={id} name={name} value={value} onChange={onChange} required={required}>
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea id={id} name={name} value={value} onChange={onChange} required={required} />
      ) : (
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          accept={accept}
          multiple={multiple}
        />
      )}
    </div>
  );
}

export default SellProduct;
