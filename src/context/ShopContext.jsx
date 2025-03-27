import { createContext, useEffect, useState } from "react";
// import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import { backendUrl } from "../App";
import axios from "axios";

export const ShopContext = createContext();
const ShopContextProvider = (props) => {
  const url = backendUrl + "/v1/api";
  const currency = "Rp ";
  const delivery_fee = 10;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState(null);
  const [products, setProducts] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const header = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("sessions")}`,
    },
  };
  const getProduct = async () => {
    try {
      let response = await axios.get(url + "/products", header);
      let data = response.data.data.map((product) => ({
        ...product,
        img: product.img.map((imgPath) => `${backendUrl}/api/image/${imgPath}`),
        variants: product.variants.map((variant) => ({
          ...variant,
          img: `${backendUrl}/api/image/${variant.img}`,
        })),
      }));

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getChart = async () => {
    if (localStorage.getItem("sessions") !== null) {
      try {
        let response = await axios.get(url + "/cart", header);

        if (response.data.success) {
          let dataTmp = response.data.data;

          let data = {
            ...dataTmp,
            items: dataTmp.items.map((item) => ({
              ...item,
              images: `${backendUrl}/api/image/${item.images}`,
            })),
          };

          setCartItems(data);
        } else {
          setCartItems(null);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const addToCart = async (itemId, variantsId, size, quantity) => {
    try {
      let cartData = structuredClone(cartItems);

      let body = {
        cart_id: !cartData ? "" : cartData.id,
        product_id: itemId,
        product_variant: variantsId,
        product_qty: quantity,
        product_size: size,
      };
      let response = await axios.post(url + "/cart", body, header);
      if (response.data.success) {
        getChart();
        getCartCount();
        return {
          status: true,
          messages: "Success add to cart",
        };
      } else {
        return {
          status: false,
          messages: response.data.data,
        };
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    if (cartItems != null) {
      if (cartItems.items.length > 0) totalCount = cartItems.items.length;
    }

    return totalCount;
  };

  const updateQuantity = async (productId, size, variant, newQuantity) => {
    try {
      let cartData = structuredClone(cartItems);
      let body = {
        cart_id: cartData.id,
        product_id: productId,
        product_variant: variant,
        product_qty: newQuantity,
        product_size: size,
      };
      let response = await axios.put(url + "/cart", body, header);
      return response.data;
    } catch (error) {
      console.log(error);
      return;
    }

    // cartData[itemId][size] = quantity;
    // setCartItems(cartData);
  };

  const getCartAmount = async () => {
    let totalAmount = 0;
    if (cartItems != null) {
      let cartData = structuredClone(cartItems);

      cartData.items.map((items) => {
        let product = products.find(
          (product1) => product1.id === items.productId
        );
        totalAmount += parseInt(product.price) * parseInt(items.quantity);
      });
    }

    // totalAmount += parseInt(product.price) * parseInt(item.quantity);

    // for (const items in cartItems) {
    //   let itemInfo = products.find((products) => products._id === items);
    //   for (const item in cartItems[items]) {
    //     try {
    //       if (cartItems[items][item] > 0) {
    //         totalAmount += itemInfo.price * cartItems[items][item];
    //       }
    //     } catch (error) {}
    //   }
    // }

    return totalAmount;
  };
  useEffect(() => {
    const fetchPaths = ["/", "/collection", "/product", "/cart"];
    const isProductPage = location.pathname.startsWith("/product/");
    const isCartPage = location.pathname.startsWith("/cart/");
    if (fetchPaths.includes(location.pathname) || isProductPage) {
      getProduct();
    }
    if (fetchPaths.includes(location.pathname) || isCartPage) {
      getChart();
    }
  }, [location.pathname]); // akan re-fetch saat path berubah

  useEffect(() => {}, [cartItems, products]);
  useEffect(() => {
    getCartCount();
  }, [cartItems]);
  // useEffect(() => {
  //   getChart();
  // }, [localStorage.getItem("token")]);
  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    getProduct,
    getChart,
  };
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
