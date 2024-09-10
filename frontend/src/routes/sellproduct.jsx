import React, { useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebaseConfig";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import './sellproduct.css';
import { BACKEND_URL } from "../config";

function SellProduct() {
  const [formData, setFormData] = useState({
    sellerName: "",
    productName: "",
    category: "",
    description: "",
    price: "",
    images: [], 
    hostel: "",
    quantity: "",
    contactOption: "", 
    contactValue: ""
  });

  const [errors, setErrors] = useState({});
  const [user] = useAuthState(auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "", 
    }));
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
  
    if (totalSize > 1.5 * 1024 * 1024) {
      toast.error("Total file size exceeds 1.5MB. Please choose smaller files.");
      return;
    }
  
    for (const file of files) {
      const form = new FormData();
      form.append('file', file);
  
      try {
        // POST request to the image analysis API
        const response = await axios.post('https://merasabkuch-countthings.hf.space/analyze-image', form);
  
        // Log the raw API response
        console.log("Full API Response:", response);
  
        // Parse the stringified JSON in response.data
        const apiResponse = JSON.parse(response.data);
  
        // Log the parsed response for better inspection
        console.log("API Response Data:", apiResponse);
  
        // Extracting values from the parsed response
        const useable_on_website = apiResponse.useable_on_website;
        const reason = apiResponse.reason;
  
        // Debug log for extracted values
        console.log("useable_on_website:", useable_on_website);
        console.log("reason:", reason);
  
        // Enhanced conditional check for better handling
        if (useable_on_website === true) {
          console.log("Image is usable and can be uploaded.");
  
          // Proceed with uploading the image
          const reader = new FileReader();
          reader.onload = () => {
            const base64Image = reader.result.split(',')[1];
            setFormData(prevData => ({
              ...prevData,
              images: [...prevData.images, base64Image]
            }));
          };
          reader.readAsDataURL(file);
          toast.success("Image uploaded successfully.");
        } else {
          console.error("Image not usable. Reason:", reason || "Unknown reason");
          toast.error(`One or more images are inappropriate: ${reason || "Unknown reason"}`);
        }
      } catch (error) {
        console.error("Error uploading image:", error.message);
        toast.error("Failed to analyze image. Please try again.");
      }
    }
  
    setErrors(prevErrors => ({
      ...prevErrors,
      images: "",
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    const { sellerName, productName, category, description, price, images, hostel, quantity, contactOption, contactValue } = formData;

    if (!sellerName) newErrors.sellerName = "Seller name is required";
    if (!productName) newErrors.productName = "Product name is required";
    if (!category || category === "") newErrors.category = "Category is required";
    if (!description) newErrors.description = "Description is required";
    if (!price) newErrors.price = "Price is required";
    if (images.length === 0) newErrors.images = "Please Upload an Image (Size limit:1.5Mb)";
    if (!hostel || hostel === "") newErrors.hostel = "Hostel is required";
    if (!quantity) newErrors.quantity = "Quantity is required";
    if (!contactOption) newErrors.contactOption = "Contact option is required";
    if (!contactValue) newErrors.contactValue = "Contact value is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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
      price: Number(price),
      images,
      hostel,
      quantity: Number(quantity),
      uid: user.uid,
      telegramUsername: contactOption === "telegram" ? contactValue : "",
      whatsappNumber: contactOption === "whatsapp" ? contactValue : ""
    };
  
    try {
      const response = await fetch(BACKEND_URL + "api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
  
      if (response.ok) {
        const responseData = await response.json();
        toast.success(responseData.message || "Product Uploaded");
  
        // Send notification to all users
        sendProductNotification(productName, price);
  
        // Clear form data
        setFormData({
          sellerName: "",
          productName: "",
          category: "",
          description: "",
          price: "",
          images: [], 
          hostel: "",
          quantity: "",
          contactOption: "", 
          contactValue: ""
        });
        setErrors({});
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to upload product. Please try again.");
    }
  };
  
  // Function to send notification to all registered users
  const sendProductNotification = async (productName, price) => {
    try {
      const notificationData = {
        title: "New Product Uploaded!",
        body: `${productName} is up for sale at $${price}. Check it out now!`
      };
  
      // Replace with your notification API endpoint
      const response = await fetch(BACKEND_URL + "api/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationData),
      });
  
      if (!response.ok) {
        console.error("Failed to send notification.");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
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
            error={errors.sellerName} // Pass error if exists
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
            error={errors.contactOption} // Pass error if exists
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
              error={errors.contactValue} // Pass error if exists
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
            error={errors.productName} // Pass error if exists
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
            error={errors.category} // Pass error if exists
          />
          <FormField
            label="Description *"
            id="description"
            name="description"
            type="textarea"
            required
            value={formData.description}
            onChange={handleChange}
            error={errors.description} // Pass error if exists
          />
          <FormField
            label="Price *"
            id="price"
            name="price"
            type="number"
            required
            value={formData.price}
            onChange={handleChange}
            error={errors.price} // Pass error if exists
          />
          <FormField
            label="Images *"
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            required
            onChange={handleFileChange}
            error={errors.images}
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
              { value: "F", label: "F" },
              { value: "G", label: "G" },
              { value: "H", label: "H" },
              { value: "I", label: "I" },
              { value: "J", label: "J" },
              { value: "K", label: "K" },
              { value: "L", label: "L" },
              { value: "M", label: "M" },
              { value: "N", label: "N" },
              { value: "O", label: "O" },
              { value: "Q", label: "Q" },
              { value: "PG", label: "PG" }
            ]}
            error={errors.hostel} // Pass error if exists
          />
          <FormField
            label="Quantity *"
            id="quantity"
            name="quantity"
            type="number"
            required
            value={formData.quantity}
            onChange={handleChange}
            error={errors.quantity} // Pass error if exists
          />
          <button type="submit">Submit</button>
        </form>
        <ToastContainer />
      </div>
      <Footer />
    </>
  );
}

// Reusable FormField component
const FormField = ({ label, id, name, type, value, onChange, options, required, accept, multiple, error }) => {
  return (
    <div className={`form-group ${error ? "has-error" : ""}`}>
      <label htmlFor={id}>{label}</label>
      {type === "select" ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
        />
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
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default SellProduct;
