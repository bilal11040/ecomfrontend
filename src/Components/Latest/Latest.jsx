import React, { useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ShopContext } from '../../Context/ShopContext';
import "./latest.css";
import Item from "../item/Item";

const Latest = () => {
  const { products, loading } = useContext(ShopContext);

  const filteredProducts = Array.isArray(products)
    ? products.filter((item) => item.Category === "latest")
    : [];

  useEffect(() => {
    console.log("Filtered Products (Category: latest):", filteredProducts);
  }, [filteredProducts]);

  if (loading) {
    return <p className="loading">Loading products...</p>;
  }

  if (filteredProducts.length === 0) {
    return <p className="no-products">No products found in this category.</p>;
  }

  // ✅ RETURN your JSX layout here
  return (
    <div className="Latest">
      <h1>LATEST COLLECTION</h1>
      <hr />
      <div className="Latest-item">
        {filteredProducts.map((item) => (
          <Link to={`/product/${item.ProductId}?source=latest`} key={item.ProductId}>
            <Item
              id={item.ProductId}
              name={item.Name}
              image={item.ImageUrl}
              NewPrice={item.NewPrice}
              old_price={item.OldPrice}
            />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Latest;
