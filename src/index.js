import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Global CSS file
import App from "./App"; // Main application component
import reportWebVitals from "./reportWebVitals"; // Performance measurement
import { UserProvider } from "./Context/Allheadings"; // User context provider
import { ShopContextProvider } from "./Context/ShopContext"; // Shop context provider


// Root element where the React app will be mounted
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    {/* Wrapping the app with context providers */}
      <UserProvider>
        <App />
      </UserProvider>
  </React.StrictMode>
);

// Optional: Log app performance metrics
reportWebVitals();
