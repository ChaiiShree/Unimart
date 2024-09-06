import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductRow from "./ProductRow"; // Assuming you have this component

const ProductTable = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // For error handling

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("https://unipalmark-backend.hf.space/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
      setError("Failed to load products. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveProduct = async (id) => {
    try {
      await axios.delete(`https://unipalmark-backend.hf.space/api/products/${id}`);
      setProducts(products.filter((product) => product._id !== id));  // Remove the product from state
    } catch (error) {
      console.error("Error removing product:", error);
      setError("Failed to remove the product. Please try again.");
    }
  };

  if (loading) {
    return <div>Loading products...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Products</h1>
      <table>
        <thead>
          <tr>
            <th>Seller Name</th>
            <th>Product Name</th>
            <th>Category</th>
            <th>Description</th>
            <th>Price</th>
            <th>Hostel</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <ProductRow
              key={product._id}
              product={product}
              onRemove={handleRemoveProduct}  // Passing the remove handler
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
