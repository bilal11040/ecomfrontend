import React, { useContext, useEffect } from 'react';
import { Link } from "react-router-dom";
import { ShopContext } from '../../Context/ShopContext'; // Ensure this is correctly imported
import Item from '../item/Item';
import './Classic.css';

const Classic = () => {
  const { products, loading } = useContext(ShopContext);

  // Filter products where category is "all"
  const filteredProducts = Array.isArray(products)
    ? products.filter((item) => item.Category === "classic")
    : [];

  // Log filtered products in console
  useEffect(() => {
    console.log("Filtered Products (Category: all):", filteredProducts);
  }, [filteredProducts]);

  // Handle loading state
  if (loading) {
    return <p className="loading">Loading products...</p>;
  }

  // Handle empty product list
  if (filteredProducts.length === 0) {
    return <p className="no-products">No products found in this category.</p>;
  }

  return (
    <div className='classic'>
      <h1>CLASSIC COLLECTIONS</h1>
      <hr />
      <div className="classic-item grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-full px-4">
  {filteredProducts.map((item) => (
    <Link to={`/product/${item.ProductId}?source=classic`} key={item.ProductId}>
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
}

export default Classic;
