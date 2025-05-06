import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useParams, useNavigate } from "react-router-dom";


import "./CSS/Product.css";

const Product = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { products, addToCart } = useContext(ShopContext);

  const { productId } = useParams();


  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState("");

  const productSource = products || [];

  if (!Array.isArray(productSource) || productSource.length === 0) {
    return <div className="not-found">Error: Product data is unavailable.</div>;
  }

  const product = productSource.find(
    (e) => String(e.ProductId) === String(productId)
  );

  if (!product) {
    return <div className="not-found">Product not found!</div>;
  }

  const handleSizeChange = (size) => {
    setSelectedSize(size);
  };

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert("Please select a size!");
      return;
    }
    addToCart({ ...product, size: selectedSize });
  };

  const handleGoBack = () => {
    navigate(-1); // Navigate back to previous page
    window.scrollTo(0, 0); // Scroll to top

  };

  return (
    <div className="product-page">
      <div className="back-button-container">
        <button className="back-button" onClick={handleGoBack}>← Back</button>
      </div>
      
      <div className="product-container">
        <div className="product-image">
          <img src={product.ImageUrl} alt={product.Name} />
        </div>

        <div className="product-details">
          <h1 className="product-name">{product.Name}</h1>
          <p className="product-price">Price: ₹{product.NewPrice}</p>
          <p className="product-original-price">
            <s>Original Price: ₹{product.OldPrice}</s>
          </p>
          <p className="product-description">{product.Description}</p>

          <div className="size-selection">
            <p className="size-label">Select Size:</p>
            <div className="size-options">
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => handleSizeChange(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {selectedSize && (
              <p className="selected-size">
                Selected Size: <strong>{selectedSize}</strong>
              </p>
            )}
          </div>

          <div className="product-actions">
            <button className="btn add-to-cart" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;