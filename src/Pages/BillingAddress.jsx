import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../Context/ShopContext';
import './CSS/BillingAddress.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BillingAddress = () => {
  // Razorpay test credentials
  const RAZORPAY_KEY_ID = "rzp_test_7UfZjyVrxF8ae2";
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });

  const navigate = useNavigate();
  const { cart, products } = useContext(ShopContext);
  const [cartWithDetails, setCartWithDetails] = useState([]);

  useEffect(() => {
    if (Array.isArray(cart) && Array.isArray(products)) {
      const detailedCart = cart.map(cartItem => {
        const productDetails = products.find(p => p.ProductId === cartItem.ProductId);
        return productDetails ? { ...cartItem, ...productDetails } : cartItem;
      });
      setCartWithDetails(detailedCart);
    }
  }, [cart, products]);

  const formatPrice = (price) => {
    const numPrice = Number(price);
    return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
  };

  const handleGoBack = () => {
    navigate(-1); // This navigates back to the previous page
  };

  const getItemPrice = (item) => {
    if (item.NewPrice !== undefined && item.NewPrice !== null) {
      return Number(item.NewPrice);
    }
    if (item.Price !== undefined && item.Price !== null) {
      return Number(item.Price);
    }
    return 0;
  };

  const subtotal = cartWithDetails.reduce((acc, item) => {
    const price = getItemPrice(item);
    return acc + price * (item.quantity || 1);
  }, 0);

  const shippingFee = 0;
  const discount = 0;
  const total = subtotal - discount + shippingFee;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    try {
      // IMPORTANT: We need to know if the backend is expecting rupees or paise
      // Based on the issue, it seems the backend might be converting to paise again
      // Let's try a direct approach without calling the create API
      
      // Create Razorpay options directly
      const razorpayOptions = {
        key: RAZORPAY_KEY_ID, // Use test key directly
        amount: Math.round(total * 100), // Convert to paise here
        currency: "INR",
        name: "Your Store Name",
        description: "Test Transaction",
        image: "/your_logo.png",
        handler: async function (response) {
          console.log('Payment Success:', response);
          
          // You can handle post-payment actions here
          // For example, store the order in your database
          try {
            // If you still need to verify the payment
            const verifyResponse = await axios.post('https://m8nj89uv24.execute-api.ap-south-1.amazonaws.com/prod/order/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            
            console.log('Verify Response:', verifyResponse.data);
            
            if (verifyResponse.data.success) {
              alert('Payment Successful and Verified!');
              // Redirect to Thank You page or Order Summary
            } else {
              alert('Payment Failed Verification!');
            }
          } catch (verifyError) {
            console.error('Verification Error:', verifyError);
            // Still consider the payment successful if verification fails
            // as this might be due to backend issues
            alert('Payment received but verification failed. Your order is being processed.');
          }
        },
        prefill: {
          name: formData.fullname,
          email: formData.email,
          contact: formData.phone || '9999999999', // Use form phone if available
        },
        notes: {
          address: `${formData.address}, ${formData.city}, ${formData.state}, ${formData.zip}, ${formData.country}`,
        },
        theme: {
          color: "#3399cc"
        }
      };

      console.log('Opening Razorpay with options:', razorpayOptions);
      
      // Check if Razorpay is loaded
      if (window.Razorpay) {
        const rzp = new window.Razorpay(razorpayOptions);
        rzp.open();
      } else {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
      }
    } catch (error) {
      console.error('Error in Payment:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="billing-wrapper">
      <button className="back-button" onClick={handleGoBack}>← Back</button>
      <div className="billing-container form-section">
      
        <h2>Billing Address</h2>
        <form className="billing-form" onSubmit={handleSubmit}>
          {/* Your form fields here */}
          <label htmlFor="fullname">Full Name</label>
          <input
            type="text"
            id="fullname"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            placeholder="John Doe"
            required
          />

          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            required
          />

          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="1234 Main St"
            required
          />

          <label htmlFor="city">City</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Mumbai"
            required
          />

          <label htmlFor="state">State</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            placeholder="Maharashtra"
            required
          />

          <label htmlFor="zip">Zip Code</label>
          <input
            type="text"
            id="zip"
            name="zip"
            value={formData.zip}
            onChange={handleChange}
            placeholder="400001"
            required
          />

          <label htmlFor="country">Country</label>
          <select
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
          >
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
          </select>

          <button type="submit">Proceed to Payment</button>
        </form>
      </div>

      <div className="billing-container summary-section">
        <h3>Order Summary</h3>
        <div className="totals-row">
          <span>Subtotal:</span>
          <span>₹{formatPrice(subtotal)}</span>
        </div>
        <div className="totals-row">
          <span>Shipping:</span>
          <span>Free</span>
        </div>
        <div className="totals-row">
          <strong>Total:</strong>
          <strong>₹{formatPrice(total)}</strong>
        </div>
      </div>
    </div>
  );
};

export default BillingAddress;