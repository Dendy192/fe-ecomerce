import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
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

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
const App = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isNavbarFixed, setIsNavbarFixed] = useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token") === null ? "" : localStorage.getItem("token")
  );
  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);
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
      <ToastContainer />
      {/* <AnnounchmentBar isVisible={isVisible} /> */}
      <Navbar isFixed={isNavbarFixed} token={token} setToken={setToken} />
      <SearchBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verification" element={<Otp setToken={setToken} />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/product/:productId" element={<Product token={token} />} />
        <Route path="/cart" element={<Cart token={token} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/place-order" element={<PlaceOrder token={token} />} />
        <Route path="/orders" element={<Orders token={token} />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
