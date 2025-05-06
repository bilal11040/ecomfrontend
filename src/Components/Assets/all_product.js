const API_URL = "https://iapfra4sdg.execute-api.ap-south-1.amazonaws.com/dev/add-product";

// Function to fetch products
export const fetchProducts = async () => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    console.log("API Response:", data); // Debugging log
    if (Array.isArray(data.products)) {
      return data.products;
    } else {
      console.error("Invalid API response format:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

// If `all_product` is needed, ensure it's properly exported
const all_product = []; // Replace with actual product data if available
export default all_product;
