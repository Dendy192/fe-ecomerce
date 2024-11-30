import { React } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

import { GoogleOAuthProvider } from "@react-oauth/google";

import ShopContextProvider from "./context/ShopContext.jsx";
import UserProvider from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="496860517548-g11ohdqt2ovm1m8k5q8j41ehak1ig951.apps.googleusercontent.com">
    <BrowserRouter>
      <UserProvider>
        <ShopContextProvider>
          <App />
        </ShopContextProvider>
      </UserProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
