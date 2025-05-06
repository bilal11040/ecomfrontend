import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { AuthContext } from "../Context/AuthContext";
import { fetchProducts } from "../Components/Assets/all_product";

export const ShopContext = createContext(null);

export const useShopContext = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error("useShopContext must be used within a ShopContextProvider");
  }
  return context;
};

export const ShopContextProvider = ({ children }) => {
  const authContext = useContext(AuthContext);

  // Get userId from context or localStorage
  const [userId, setUserId] = useState(() => authContext.userId || localStorage.getItem("userId"));
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [initialized, setInitialized] = useState(false);

  // Sync userId when it changes
  useEffect(() => {
    if (authContext.userId) {
      // If user ID changes, clear any existing cart first
      if (userId !== authContext.userId) {
        setCart({});
      }
      setUserId(authContext.userId);
      console.log("Updated userId from AuthContext:", authContext.userId);
    } else if (authContext.userId === null && userId) {
      // User logged out
      setUserId(null);
      setCart({});
      localStorage.removeItem("cart");
    }
  }, [authContext.userId, userId]);

  // Load products on component mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(Array.isArray(fetchedProducts) ? fetchedProducts : []);
      } catch (error) {
        console.error("Error loading products:", error);
        setProducts([]);
      }
    };

    loadProducts();
  }, []);

  // Generate a unique cart item key from ProductId and size
  const getCartItemKey = (productId, size) => {
    return size ? `${productId}_${size}` : productId;
  };

  // Parse cart item key back to its components
  const parseCartItemKey = (key) => {
    const parts = key.split('_');
    if (parts.length > 1) {
      return {
        ProductId: parts[0],
        size: parts.slice(1).join('_') // Rejoin in case size contained underscores
      };
    }
    return { ProductId: key, size: null };
  };

  // Centralized API request function
  const apiRequest = async (endpoint, method, body) => {
    try {
      const response = await fetch(
        `https://xbxax5exy1.execute-api.ap-south-1.amazonaws.com/dev/cart/${endpoint}`,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const responseData = await response.json();
      if (!response.ok) throw new Error(responseData.message || "API request failed");

      return responseData;
    } catch (error) {
      console.error(`Error in ${endpoint} API call:`, error);
      alert(error.message);
    }
  };

  // Fetch cart from API when user logs in
  const fetchCartFromAPI = useCallback(async () => {
    if (!userId) {
      setCart({});
      return;
    }

    try {
      const response = await fetch(
        `https://xbxax5exy1.execute-api.ap-south-1.amazonaws.com/dev/cart/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch cart");

      const data = await response.json();
      
      // Process API response to maintain our cart format with compound keys
      const updatedCart = {};
      if (data.cart) {
        Object.entries(data.cart).forEach(([key, value]) => {
          // Check if the key includes size information (has underscores)
          if (key.includes('_')) {
            updatedCart[key] = value; // Already in our format
          } else {
            // Legacy format - just ProductId without size
            updatedCart[key] = value;
          }
        });
      }
      
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    } catch (error) {
      console.error("Error fetching cart:", error);
      // In case of error, set an empty cart to avoid showing stale data
      setCart({});
    }
  }, [userId]);

  // Initialize cart on component mount and when userId changes
  useEffect(() => {
    if (userId) {
      fetchCartFromAPI();
    } else {
      // Clear cart when no user is logged in
      setCart({});
      localStorage.removeItem("cart");
    }
    setInitialized(true);
  }, [userId, fetchCartFromAPI]);

  // Convert cart object to array
  const cartArray = Object.keys(cart).map((key) => {
    const { ProductId, size } = parseCartItemKey(key);
    return {
      ProductId,
      size,
      quantity: cart[key],
      cartItemKey: key // Include the composite key for reference
    };
  });

  // Add item to cart
  const addToCart = async (product) => {
    if (!userId) return alert("You need to log in first.");
    if (!product?.ProductId) return alert("Error: Product ID is missing");

    // Create a composite key using ProductId and size
    const cartItemKey = getCartItemKey(product.ProductId, product.size);

    const response = await apiRequest("add", "POST", {
      user_id: userId,
      email: localStorage.getItem("email"),
      item_id: cartItemKey, // Use composite key as item_id
      quantity: 1,
      product_details: {
        ProductId: product.ProductId,
        size: product.size || null
      }
    });

    if (response) await fetchCartFromAPI();
  };

  // Remove item from cart
  const removeFromCart = async (item_id) => {
    if (!userId) return;

    const response = await apiRequest("remove", "POST", { user_id: userId, item_id });
    if (response) await fetchCartFromAPI();
  };

  // Decrement item quantity
  const decrementQuantity = async (item_id) => {
    if (!userId || !cart[item_id]) return;

    const response = await apiRequest("update", "POST", {
      user_id: userId,
      item_id,
      quantity: cart[item_id] > 1 ? cart[item_id] - 1 : 0,
    });

    if (response) await fetchCartFromAPI();
  };

  // Clear cart
  const clearCart = async () => {
    if (!userId) return;

    const response = await apiRequest("clear", "POST", { user_id: userId });
    if (response) {
      setCart({});
      localStorage.removeItem("cart");
    }
  };

  // Get cart count
  const getCartCount = () => Object.values(cart).reduce((total, qty) => total + qty, 0);

  // Force refresh cart - useful when switching between users
  const initializeCart = useCallback(() => {
    if (userId) {
      fetchCartFromAPI();
    } else {
      setCart({});
    }
  }, [userId, fetchCartFromAPI]);

  // Context value
  const contextValue = {
    products,
    cart: cartArray,
    addToCart,
    removeFromCart,
    decrementQuantity,
    clearCart,
    getCartCount,
    isLoggedIn: !!userId,
    refreshCart: fetchCartFromAPI,
    initializeCart,
    initialized
  };

  return <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>;
};