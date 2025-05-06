import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../Assets/logo.jpg";
import cart1 from "../Assets/cart.jpg";
import userIcon from "../Assets/user.jpeg";
import { ShopContext } from "../../Context/ShopContext";
import { AuthContext } from "../../Context/AuthContext";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { cart, products } = useContext(ShopContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);

  const cartCount = Array.isArray(cart)
    ? cart.reduce((total, item) => total + (item.quantity || 1), 0)
    : 0;

  const handleLogout = () => {
    logout();
    navigate("/Signup");
  };
  useEffect(() => {
    // Map the path to the menu key
    if (location.pathname === "/") {
      setMenu("home");
    } else if (location.pathname.toLowerCase().startsWith("/shop")) {
      setMenu("shop");
    } else if (location.pathname.toLowerCase().startsWith("/support")) {
      setMenu("Support");
    } else if (location.pathname.toLowerCase().startsWith("/aboutus")) {
      setMenu("AboutUs");
    } else {
      setMenu(""); // no underline for unknown paths
    }
  }, [location.pathname]);
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length >= 3 && Array.isArray(products)) {
      const matches = products.filter((product) =>
        product.Name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredSuggestions(matches.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (product) => {
    setSearchTerm(product.Name);
    setShowSuggestions(false);
    navigate(`/product/${product.ProductId}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim().length >= 3) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm)}`);
      setShowSuggestions(false);
    }
  };

  return (
    <div className="navbar">
      <div className="ham-flex">
        <div className="nav-logo">
          <Link to="/" className="nav-logo">
            <img src={logo} alt="logo" />
            <p>King Makker</p>
          </Link>
        </div>
        <div className="hamburger pos-ham-bar" onClick={() => setShowMenu(!showMenu)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>

      {/* 🔍 Search Bar + Suggestions */}
      {location.pathname !== "/billing" && (
        <div className="nav-search-wrapper">
          <form onSubmit={handleSearchSubmit} className="nav-search">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="search-input"
              onFocus={() => setShowSuggestions(true)}
            />
            <button type="submit" className="search-btn">🔍</button>
          </form>

          {showSuggestions && filteredSuggestions.length > 0 && (
            <ul className="suggestions-dropdown">
              {filteredSuggestions.map((suggestion, index) => (
                <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                  {suggestion.Name}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ul className={`nav-menu ${showMenu ? "active" : ""}`}>
        <li onClick={() => { setMenu("home"); setShowMenu(false); }}>
          <Link to="/">Home</Link>
          {menu === "home" && <hr />}
        </li>
        <li onClick={() => { setMenu("shop"); setShowMenu(false); }}>
          <Link to="/Shop">Shop</Link>
          {menu === "shop" && <hr />}
        </li>
        <li onClick={() => { setMenu("Support"); setShowMenu(false); }}>
          <Link to="/support">Support</Link>
          {menu === "Support" && <hr />}
        </li>
        <li onClick={() => { setMenu("AboutUs"); setShowMenu(false); }}>
          <Link to="/aboutus">About Us</Link>
          {menu === "AboutUs" && <hr />}
        </li>
      </ul>

      <div className="nav-login-cart">
        {user ? (
          <>
            <div className="user-container">
              <img src={userIcon} alt="User Icon" className="user-icon" />
              <span className="welcome-text">{user}</span>
            </div>

            <Link
  to="/Cart"
  className={`cart-icon ${location.pathname.toLowerCase() === "/cart" ? "active-cart" : ""}`}
>
  <img src={cart1} alt="cart" className="cart-img" />
  {cartCount > 0 && <div className="nav-cart-count">{cartCount}</div>}
</Link>


            <button onClick={handleLogout} className="auth-btn logout-btn">
              Logout
            </button>
          </>
        ) : (
          <>
            {location.pathname === "/Signup" ? (
              <Link to="/login">
                <button className="auth-btn login-btn">Login</button>
              </Link>
            ) : location.pathname === "/login" ? (
              <Link to="/Signup">
                <button className="auth-btn login-btn">Signup</button>
              </Link>
            ) : (
              <Link to="/Signup">
                <button className="auth-btn login-btn">Signup / Login</button>
              </Link>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
