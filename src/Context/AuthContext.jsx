import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState(null);
  const [token, setToken] = useState(null);

  // Load user data from localStorage on app start
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedUserId = localStorage.getItem("userId");

    if (storedToken) {
      setToken(storedToken);
      extractUserData(storedToken);
    }
    if (storedUser) setUser(storedUser);
    if (storedEmail) setEmail(storedEmail);
    if (storedUserId) setUserId(storedUserId);
  }, []);

  useEffect(() => {
    console.log("Updated User ID:", userId);
    console.log("Updated Email:", email);
  }, [userId, email]);

  // Function to extract userId & email from JWT token
  const extractUserData = (token) => {
    try {
      console.log("Token being decoded:", token);
      const decodedToken = jwtDecode(token);
      console.log("Full decoded token:", decodedToken);
      
      // Check which properties actually exist in the token
      console.log("Properties in token:", Object.keys(decodedToken));
      
      // Try multiple possible field names for user identifiers
      const extractedUserId = decodedToken?.user_id || decodedToken?.sub || decodedToken?.userId;
      const extractedEmail = decodedToken?.email || localStorage.getItem("email");
      const extractedUsername = decodedToken?.username || decodedToken?.sub;

      console.log("Extracted userId:", extractedUserId);
      console.log("Extracted email:", extractedEmail);
      console.log("Extracted username:", extractedUsername);

      if (extractedUserId) {
        setUserId(extractedUserId);
        localStorage.setItem("userId", extractedUserId);
      }

      if (extractedEmail) {
        setEmail(extractedEmail);
        localStorage.setItem("email", extractedEmail);
      }

      if (extractedUsername) {
        setUser(extractedUsername);
        localStorage.setItem("username", extractedUsername);
      }
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  };

  // Login function
  const login = (username, email, token) => {
    setUser(username);
    setEmail(email);
    setToken(token);
    extractUserData(token);

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("email");

    setUser(null);
    setUserId(null);
    setEmail(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, userId, email, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};