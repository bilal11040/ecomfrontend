import React, { useContext, useState, useEffect } from "react";
import { ShopContext } from "../Context/ShopContext";
import { useNavigate } from 'react-router-dom';
import './CSS/Cart.css';

const Cart = () => {
  const shopContext = useContext(ShopContext);
  const { cart, products, removeFromCart, decrementQuantity, clearCart, addToCart, initializeCart, initialized } = shopContext;
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [productToRemove, setProductToRemove] = useState(null);
  const [showClearModal, setShowClearModal] = useState(false); // for clear cart
  // State to manage promo code and discount
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [cartWithDetails, setCartWithDetails] = useState([]);
const handlegoback =() =>{
  navigate(-1);
}
  // Initialize cart when component mounts to ensure fresh data
  useEffect(() => {
    if (initialized) {
      initializeCart();
    }
  }, [initialized, initializeCart]);

  // Merge cart items with product details
  useEffect(() => {
    if (Array.isArray(cart) && cart.length > 0 && Array.isArray(products)) {
      const detailedCart = cart.map(cartItem => {
        const productDetails = products.find(p => p.ProductId === cartItem.ProductId);
        return productDetails ? { ...cartItem, ...productDetails } : cartItem;
      });
  
      setCartWithDetails(detailedCart);
    } else {
      setCartWithDetails([]);
    }
  }, [cart, products]);

  // Helper function to safely format price
  const formatPrice = (price) => {
    // Convert to number first to ensure we can use toFixed
    const numPrice = Number(price);
    // Check if it's a valid number
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  // Helper function to safely get price
  const getItemPrice = (item) => {
    if (item.NewPrice !== undefined && item.NewPrice !== null) {
      return Number(item.NewPrice);
    }
    if (item.Price !== undefined && item.Price !== null) {
      return Number(item.Price);
    }
    return 0;
  };

  // Calculate subtotal based on detailed cart
  const subtotal = cartWithDetails.reduce((acc, item) => {
    const price = getItemPrice(item);
    return acc + price * (item.quantity || 1);
  }, 0);

  // Fixed shipping fee
  const shippingFee = 0; // Free shipping

  // Calculate total
  const total = subtotal - discount + shippingFee;

  // Handle promo code submission
  const handlePromoCodeSubmit = () => {
    if (promoCode === "SAVE10") {
      setDiscount(subtotal * 0.1); // 10% discount
      alert("Promo code applied! You saved 10%.");
    } else {
      alert("Invalid promo code.");
    }
  };
  const handleGoBack = () => {
    navigate(-1); // This navigates back to the previous page
    window.scrollTo(0, 0); // Scroll to top
  };
  const removeFromCartQuantity = (productId) => {
    if (cart.some(item => item.ProductId === productId && item.quantity > 1)) {
      decrementQuantity(productId);
    } else {
      removeFromCart(productId);
    }
  };
  
  if (!cartWithDetails.length) {
    return (
      <div className="cart-empty">
        <h2>Your cart is empty!</h2>
        <p>Start shopping to add items to your cart.</p>
      </div>
    );
  }

  return (
    <div className="cart">
      <button className="back-button" onClick={handleGoBack}>← Back</button>
      <h2>Your Shopping Cart</h2>
      {cartWithDetails.map((item, index) => (
        <div key={index} className="cart-item">
          <img 
            src={item.ImageUrl || "/placeholder-image.jpg"} 
            alt={item.Name || `Product ${item.ProductId}`} 
          />
          <div className="cart-item-details">
            <h3>{item.Name || `Product ${item.ProductId}`}</h3>
            {item.size && <p>Size: {item.size}</p>}
            <p>Price: ₹{formatPrice(getItemPrice(item))}</p>

            {/* Quantity Controls */}
            <div className="quantity-controls">
              <button onClick={() => addToCart({ProductId: item.ProductId})}>+</button>
              <span>{item.quantity || 1}</span>
              <button onClick={() => removeFromCartQuantity(item.ProductId)}>-</button>
            </div>

            {/* Remove Button */}
            <button
  onClick={() => {
    setProductToRemove(item.ProductId);
    setShowModal(true);
  }}
>
  Remove
</button>

{showModal && (
  <div className="modal-overlay">
    <div className="modal">
      <p>Do you really want to remove this item from the cart?</p>
      <div className="modal-buttons">
        <button
          onClick={() => {
            removeFromCart(productToRemove);
            setShowModal(false);
          }}
        >
          Yes
        </button>
        <button onClick={() => setShowModal(false)}>No</button>
      </div>
    </div>
  </div>
)}

        </div>
        </div>
      ))}
      
      <button onClick={() => setShowClearModal(true)} className="clear-cart">Clear Cart</button>
      {showClearModal && (
  <div className="modal-overlay">
    <div className="modal">
      <p>Are you sure you want to clear the cart?</p>
      <div className="modal-buttons">
        <button onClick={() => { clearCart(); setShowClearModal(false); }}>Yes</button>
        <button onClick={() => setShowClearModal(false)}>No</button>
      </div>
    </div>
  </div>
)}

      <div className="cart-totals">
        <div className="promo-section">
          <p className="font-semibold mb-2">If you have a promo code, enter it here:</p>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            placeholder="Promo code"
          />
          <button onClick={handlePromoCodeSubmit}>Submit</button>
        </div>

        <div className="totals-section">
          <h3>Cart Totals</h3>
          <div className="totals-row">
            <span>Subtotal:</span>
            <span>₹{formatPrice(subtotal)}</span>
          </div>
          <div className="totals-row">
            <span>Shipping Fee:</span>
            <span>Free</span>
          </div>
          <div className="totals-row">
            <strong>Total:</strong>
            <strong>₹{formatPrice(total)}</strong>
          </div>
          <button className="proceed-to-checkout" onClick={() => navigate('/billing')}>Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;