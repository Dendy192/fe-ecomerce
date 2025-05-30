import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import CartTotal from "../components/CartTotal";
import Loading from "../components/Loading";
import PriceFormatter from "../components/PriceFormatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleMinus,
  faCirclePlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import ConfirmationModal from "../components/Confirmation";
import { backendUrl } from "../App";
import axios from "axios";

const Cart = ({ token }) => {
  const [loading, setLoading] = useState(false);
  const {
    products,
    currency,
    cartItems,
    updateQuantity,
    navigate,
    getChart,
    getProduct,
  } = useContext(ShopContext);
  const url = backendUrl + "/v1/api/cart";
  const toastId = useRef(null);
  const toastIdError = useRef(null);
  const [cartData, setCartData] = useState([]);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const openModal = () => setConfirmationModal(true);
  const closeModal = () => setConfirmationModal(false);

  const onSubmitConfirmationModal = async (e, cartItemId) => {
    e.preventDefault();
    setLoading(true);
    try {
      await deleteCart(cartItemId);
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
      setLoading(false);
    }
  };

  const deleteCart = async (cartItemId) => {
    try {
      let body = {
        cartId: cartItems.id,
        cartItemId: cartItemId,
      };

      let response = await axios.delete(url, {
        data: body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        if (!toast.isActive(toastId.current)) {
          toastId.current = toast.success("Item has been deleted from cart");
        }
        setCartData((prevItems) =>
          prevItems.filter((item) => item.id !== cartItemId)
        );
        getChart();
        navigate("/cart");
      } else {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error(response.data.data);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleBlur = async (
    productId,
    cartItemId,
    variant,
    size,
    quantity,
    newQuantity
  ) => {
    setLoading(true);
    // Pastikan input angka valid
    newQuantity = String(newQuantity).replace(/^0+/, "") || "1";
    newQuantity = parseInt(newQuantity) > 0 ? parseInt(newQuantity) : 1;
    const updatedCartData = cartData.map((item) => {
      if (item.productId === productId && item.id === cartItemId) {
        return {
          ...item,
          quantity: newQuantity,
        };
      }
      return item;
    });

    setCartData(updatedCartData);

    let response = await updateQuantity(productId, size, variant, newQuantity);

    if (!response.success) {
      // console.log(response.data);
      if (!toast.isActive(toastIdError.current)) {
        toastIdError.current = toast.error(response.data);
      }
      setCartData(cartItems.items);
    }
    getChart();
    setLoading(false);
  };
  const onQuantityButtonChange = async (
    productId,
    cartItemId,
    variant,
    size,
    quantity,
    newQuantity
  ) => {
    setLoading(true);
    newQuantity = String(newQuantity).replace(/^0+/, "") || "0";
    quantity = String(quantity).replace(/^0+/, "") || "0";

    let tmp = parseInt(quantity) + parseInt(newQuantity);

    let updatedCartData = cartData.map((item) => {
      if (item.productId === productId && item.id === cartItemId) {
        let updatedQuantity = parseInt(quantity) + parseInt(newQuantity);

        return {
          ...item,
          quantity: updatedQuantity > 0 ? updatedQuantity : 0,
        };
      }
      return item;
    });

    if (tmp == 0) {
      await deleteCart(cartItemId);
    } else {
      // ini update data
      let response = await updateQuantity(productId, size, variant, tmp);

      if (!response.success) {
        // console.log(response.data);
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error(response.data);
        }

        setCartData(cartItems.items);
      } else {
        setCartData(updatedCartData);
        getChart();
      }
    }
    setLoading(false);
  };
  const onQuantityChange = async (
    productId,
    cartItemId,
    variant,
    size,
    quantity,
    newQuantity
  ) => {
    newQuantity = String(newQuantity).replace(/^0+/, "") || "0";

    let updatedCartData = cartData.map((item) => {
      if (item.productId === productId && item.id === cartItemId) {
        return {
          ...item,
          quantity: newQuantity > 0 ? newQuantity : 0,
        };
      }
      return item;
    });

    setCartData(updatedCartData);
  };

  const fectData = () => {
    setLoading(true);

    if (products == null) {
      getProduct();
    }

    if (cartItems == null) {
      getChart();
    }

    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };
  useEffect(() => {
    // Fetch products only if not already loaded
    fectData();
    if (cartItems != null) setCartData(cartItems.items);
  }, [products, cartItems]); // Only trigger if `products` is empty

  // useEffect(() => {
  //   // Fetch products only if not already loaded
  //   setLoading(true);

  //   if (cartItems == null) {
  //     getChart();
  //   }

  //   setLoading(false);
  // }, [cartItems, products]); // Only trigger if `products` is empty
  useEffect(() => {}, [cartData]);

  useEffect(() => {
    if (!token && localStorage.getItem("sessions") == null) {
      navigate("/login");
    }
  }, [token]);
  if (loading) return <Loading />;

  return (
    <div className="border-t pt-14 px-4 mt-[80px]">
      <div className="text-2xl mb-3 ">
        <Title text1={"YOUR"} text2={"CART"} />
      </div>
      <div className="">
        <div className="hidden sm:grid grid-cols-7 font-medium border-b pb-2 text-center text-xs sm:text-base">
          <p>Product</p>
          <p>Variant</p>
          <p>Size</p>
          <p>Price</p>
          <p>Quantity</p>
          <p>Total Price</p>
          <p>Action</p>
        </div>
        {cartData == 0
          ? "No Item"
          : cartData.map((item, index) => {
              const productData = products.find(
                (product) => product.id === item.productId
              );

              let variant = productData.variants.find(
                (variant1) => variant1.id == item.variant
              );

              return (
                <div
                  key={index}
                  className="grid sm:grid-cols-7 items-center gap-2 sm:gap-4 border-b py-4 text-left sm:text-center text-xs sm:text-base"
                >
                  {/* Mobile Layout */}
                  <div className="sm:hidden flex items-center gap-4 relative">
                    <img
                      className="w-16 rounded object-cover"
                      src={productData.img[0]}
                      alt={productData.name}
                    />
                    <div>
                      <p className="text-sm font-medium">{productData.name}</p>
                      <p className="text-xs">Variant: {variant.name}</p>
                      <p className="text-xs">Size: {item.size}</p>
                      <p className="text-xs">
                        Price: <PriceFormatter price={productData.price} />
                      </p>
                      <p className="text-xs">
                        Total:
                        <PriceFormatter
                          price={productData.price * item.quantity}
                        />
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div
                          className="px-2 cursor-pointer"
                          onClick={() =>
                            onQuantityButtonChange(
                              item.productId,
                              item.id,
                              item.variant,
                              item.size,
                              item.quantity,
                              -1
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faCircleMinus} size="2xl" />
                        </div>
                        <div>
                          <input
                            className="border w-12 text-center px-1 py-1 rounded text-xs"
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              onQuantityChange(
                                item.productId,
                                item.id,
                                item.variant,
                                item.size,
                                item.quantity,
                                e.target.value
                              )
                            }
                            onBlur={(e) => {
                              handleBlur(
                                item.productId,
                                item.id,
                                item.variant,
                                item.size,
                                item.quantity,
                                e.target.value
                              );
                            }}
                          />
                        </div>
                        <div
                          className="px-2 cursor-pointer"
                          onClick={() =>
                            onQuantityButtonChange(
                              item.productId,
                              item.id,
                              item.variant,
                              item.size,
                              item.quantity,
                              +1
                            )
                          }
                        >
                          <FontAwesomeIcon icon={faCirclePlus} size="2xl" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 right-0 p-2">
                        <button onClick={openModal}>
                          <img
                            className="w-5 cursor-pointer"
                            src={assets.bin_icon}
                            alt="Delete"
                          />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden sm:flex items-center gap-4 ">
                    <img
                      className="w-16 sm:w-20 rounded object-cover"
                      src={productData.img[0]}
                      alt={productData.name}
                    />
                    <p className="text-sm sm:text-base font-medium">
                      {productData.name}
                    </p>
                  </div>
                  <p className="hidden sm:block">{variant.name}</p>
                  <p className="hidden sm:block">{item.size}</p>
                  <PriceFormatter
                    className="hidden sm:block"
                    price={productData.price}
                  />
                  <div className="hidden items-center sm:flex justify-center">
                    <div
                      className="px-2 cursor-pointer"
                      onClick={() =>
                        onQuantityButtonChange(
                          item.productId,
                          item.id,
                          item.variant,
                          item.size,
                          item.quantity,
                          -1
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faCircleMinus} size="2xl" />
                    </div>
                    <div>
                      <input
                        className="border w-12 text-center px-1 py-1 rounded text-xs"
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          onQuantityChange(
                            item.productId,
                            item.id,
                            item.variant,
                            item.size,
                            item.quantity,
                            e.target.value
                          )
                        }
                        onBlur={(e) =>
                          handleBlur(
                            item.productId,
                            item.id,
                            item.variant,
                            item.size,
                            item.quantity,
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div
                      className="px-2 cursor-pointer"
                      onClick={() =>
                        onQuantityButtonChange(
                          item.productId,
                          item.id,
                          item.variant,
                          item.size,
                          item.quantity,
                          +1
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faCirclePlus} size="2xl" />
                    </div>
                  </div>
                  <PriceFormatter
                    className="hidden sm:block"
                    price={productData.price * item.quantity}
                  />
                  <div className="hidden sm:flex justify-center">
                    <button onClick={openModal}>
                      <img
                        className="w-5 cursor-pointer"
                        src={assets.bin_icon}
                        alt="Delete"
                      />
                    </button>
                  </div>
                  <ConfirmationModal
                    isOpen={confirmationModal}
                    onClose={closeModal}
                    onSubmit={(e) => onSubmitConfirmationModal(e, item.id)}
                  />
                </div>
              );
            })}
      </div>
      {cartData != 0 ? (
        <div className="flex justify-end my-20">
          <div className="w-full sm:w-[450px]">
            <CartTotal />
            <div className="w-full text-end">
              <button
                onClick={() =>
                  navigate("/checkout", { state: { fromCart: true } })
                }
                className="bg-black text-white text-sm my-8 px-8 py-3"
              >
                PROCESS TO CHECKOUT
              </button>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default Cart;
