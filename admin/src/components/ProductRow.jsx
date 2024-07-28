import React from "react";

const ProductRow = ({ product, onRemove }) => {
  const { _id, sellerName, productName, category, description, price, hostel } = product;

  return (
    <tr>
      <td>{sellerName}</td>
      <td>{productName}</td>
      <td>{category}</td>
      <td>{description}</td>
      <td>{price}</td>
      <td>{hostel}</td>
      <td>
        <button onClick={() => onRemove(_id)}>Remove</button>
      </td>
    </tr>
  );
};

export default ProductRow;
