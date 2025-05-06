import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Shop from "./Pages/Shop";
import Support from "./Pages/Support";
import Aboutus from "./Pages/Aboutus";
import Cart from "./Pages/Cart";
import LoginSignUp from "./Pages/LoginSignUp";
import Login from "./Pages/Login";
import Product from "./Pages/Product";
import Footer from "./Components/Footer/Footer";
import Heading from "./Components/Heading/Heading";
import { AuthProvider } from './Context/AuthContext';
import { ShopContextProvider } from "./Context/ShopContext";
import VerifyOtp from "./Pages/VerifyOtp";
import Billing from "./Pages/BillingAddress";

// Create a wrapper component that controls footer visibility
const AppContent = () => {
  const location = useLocation();
  
  // Define routes where footer should not appear
  const noFooterRoutes = ['/Signup', '/verify-otp', '/login'];
  
  // Check if current path is in the noFooterRoutes array
  const showFooter = !noFooterRoutes.includes(location.pathname);

  return (
    <>
      <Navbar />
      <Heading />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/support" element={<Support />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/Signup" element={<LoginSignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/loginsignup" element={<LoginSignUp />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
      {showFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <div>
      <AuthProvider>
        <ShopContextProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ShopContextProvider>
      </AuthProvider>
    </div>
  );
}

export default App;