import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import PlaceOrder from "./pages/PlaceOrder";
import Orders from "./pages/Orders";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AnnounchmentBar from "./components/AnnounchmentBar";
import Otp from "./pages/Otp";
import ResetPassword from "./pages/ResetPassword";
import AccountPage from "./pages/AccountPage";
import axios from "axios";
import OrderStatus from "./pages/OrderStatus";
import Payment from "./pages/Payment";
import OrderDetail from "./pages/OrderDetail";
import MapPicker from "./pages/MapPicker";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const MIDTRANS_APP = import.meta.env.VITE_MIDTRANS_APP_URL;
export const MIDTRANS_CLIENT = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("sessions"));
  const location = useLocation();
  const getToken = async () => {
    const fetchedToken = await fetchToken();
    setToken(fetchedToken);
  };
  const fetchToken = async () => {
    let result = null;

    if (localStorage.getItem("sessions") !== null) {
      try {
        let response = await axios.get(
          backendUrl + "/v1/api/check-token",

          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("sessions")}`,
            },
          }
        );
        let data = response.data;
        if (data.success) {
          result = localStorage.getItem("sessions");
        }
      } catch (error) {
        console.log("error dari fetch token", error);
        // localStorage.removeItem("sessions");
      }
    }
    return result;
  };

  useEffect(() => {
    getToken();
  }, []); // Empty dependency array to run once when the component mounts
  useEffect(() => {
    if (token) {
      localStorage.setItem("sessions", token);
      getToken();
    }
  }, [token]);
  // useEffect(() => {
  //   if (token) {
  //     localStorage.setItem("sessions", token);
  //   }
  // }, [token]);
  useEffect(() => {
    // const fetchPaths = ["/", "/collection", "/product", "/cart"];
    // const isProductPage = location.pathname.startsWith("/product/");
    // const isCartPage = location.pathname.startsWith("/cart/");
    // if (fetchPaths.includes(location.pathname) || isProductPage) {
    //   getProduct();
    // }
    // if (fetchPaths.includes(location.pathname) || isCartPage) {
    //   getChart();
    // }
    if (
      !location.pathname.startsWith("/login") ||
      !location.pathname.startsWith("/profile")
    ) {
      sessionStorage.removeItem("activeTab");
    }
  }, [location.pathname]); // akan re-fetch saat path berubah

  // const responseMessage = (response) => {
  //   console.log(response);
  // };
  // const errorMessage = (error) => {
  //   console.log(error);
  // };
  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Hide AnnouncementBar and fix Navbar based on scroll position
    if (scrollY > 50) {
      setIsVisible(false);
      setIsNavbarFixed(true);
    } else {
      setIsVisible(true);
      setIsNavbarFixed(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="px-0 pt-0">
      {/* <GoogleLogin onSuccess={responseMessage} onError={errorMessage} /> */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover={false}
        theme="light"
        transition:Bounce
      />
      {/* <AnnounchmentBar isVisible={isVisible} /> */}
      <Navbar token={token} setToken={setToken} />
      <SearchBar />
      <Routes>
        <Route path="/test" element={<MapPicker />} />
        <Route path="/" element={<Home />} />
        <Route path="/verification" element={<Otp setToken={setToken} />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product token={token} />} />
        <Route path="/cart" element={<Cart token={token} />} />
        <Route
          path="/login"
          element={
            <Login setToken={setToken} token={token} getToken={getToken} />
          }
        />
        <Route path="/checkout" element={<PlaceOrder token={token} />} />
        <Route path="/list/order" element={<Orders token={token} />} />
        <Route
          path="/list/order/:orderId"
          element={<OrderDetail token={token} />}
        />
        <Route path="/order-status/" element={<OrderStatus token={token} />} />
        <Route path="/payment/" element={<Payment token={token} />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/profile" element={<AccountPage token={token} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
