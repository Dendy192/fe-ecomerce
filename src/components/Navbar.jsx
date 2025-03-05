import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import Loading from "./Loading";

const Navbar = ({ isFixed, token, setToken }) => {
  const [visible, setVisible] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setShowSearch, getCartCount } = useContext(ShopContext);

  const logout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      setToken("");
      setLoading(false);
      navigate("/");
      window.location.reload();
    }, 1000);
  };

  const onSearch = () => {
    setLoading(true);
    setShowSearch(true);
    navigate("/collection");
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/">
        <img src={assets.logo} className="w-32" alt="Logo" />
      </Link>
      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>

        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-4">
        <img
          onClick={onSearch}
          src={assets.search_icon}
          className="w-5 cursor-pointer"
          alt="Search"
        />
        <div className="hidden sm:flex group relative">
          <img
            src={assets.profile_icon}
            className="w-5 cursor-pointer"
            alt=""
          />

          <div className="hidden sm:group-hover:block  absolute dropdown-menu right-0 pt-4">
            {token ? (
              <div className="sm:flex hidden flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p className="cursor-pointer hover:text-black">My Profile</p>
                <p className="cursor-pointer hover:text-black">Order</p>

                <p className="cursor-pointer hover:text-black" onClick={logout}>
                  Log Out
                </p>
              </div>
            ) : (
              <div className="sm:flex hidden  flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <Link to={"/login"}>
                  <p className="cursor-pointer hover:text-black">Login</p>
                </Link>
              </div>
            )}
          </div>
        </div>
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-5" alt="Cart" />
          <p className="absolute -right-2 -bottom-2 bg-black text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(!visible)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt="Menu"
        />
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full bg-white transition-transform transform ${
          visible ? "translate-x-0 w-64 shadow-lg" : "translate-x-full w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} className="h-4 rotate-180" alt="" />
            <p>Back</p>
          </div>
          <div>
            {token ? (
              <>
                <p
                  onClick={() => setShowProfile(!showProfile)}
                  className="cursor-pointer text-gray-700 py-2 pl-6 border"
                >
                  Profile ▼
                </p>
                {showProfile && (
                  <div className="mt-2 pl-6">
                    <p className="cursor-pointer hover:text-black">
                      My Profile
                    </p>
                    <p className="cursor-pointer hover:text-black">Order</p>
                    <p
                      className="cursor-pointer hover:text-black"
                      onClick={logout}
                    >
                      Log Out
                    </p>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login" onClick={() => setVisible(false)}>
                <p className="text-gray-700 cursor-pointer">Login</p>
              </Link>
            )}
          </div>
          <NavLink
            onClick={() => setVisible(false)}
            to="/"
            className="block py-2 pl-6 border"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/collection"
            className="block py-2 pl-6 border"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/about"
            className="block py-2 pl-6 border"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setVisible(false)}
            to="/contact"
            className="block py-2 pl-6 border"
          >
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
