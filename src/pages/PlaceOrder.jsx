import React, { useContext, useEffect, useRef, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { ShopContext } from "../context/ShopContext";
import Cards from "../components/Cards";
import { useLocation } from "react-router-dom";
import { backendUrl } from "../App";
import axios from "axios";
import Loading from "../components/Loading";
import PriceFormatter from "../components/PriceFormatter";
import useSnap from "../hook/UseSnap";
import { toast } from "react-toastify";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";

const PlaceOrder = ({ token }) => {
  const { navigate, cartItems, products, getChart, getProduct, getCartAmount } =
    useContext(ShopContext);
  const intervalRef = useRef(null);
  const url = backendUrl + "/v1/api";
  const [address, setAddress] = useState(null);
  const [addressMain, setAddressMain] = useState(null);
  const [cartData, setCartData] = useState(null);
  const location = useLocation();
  const [paymentShow, setPaymentShow] = useState(false);
  // const count = 0;
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [subTotal, setSubTotal] = useState(0);
  const [fee, setFee] = useState(0);
  const [discountTotal, setDiscountTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [promoChoose, setPromoChoose] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [courierData, setCourierData] = useState([]);
  const [insurance, setInsurance] = useState(false);
  const [insuranceFee, setInsuranceFee] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [promo, setPromo] = useState([]);
  const [promoSearch, setPromoSearch] = useState("");
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const groupedOptions = [
    {
      group: "Fruits",
      items: [
        { title: "Apple", description: "Sweet red fruit", price: "$1.00" },
        { title: "Banana", description: "Yellow and soft", price: "$0.50" },
      ],
    },
    {
      group: "Vegetables",
      items: [
        { title: "Carrot", description: "Orange root veggie", price: "$0.70" },
        { title: "Lettuce", description: "Green and leafy", price: "$1.20" },
      ],
    },
    {
      group: "Vegetables",
      items: [
        { title: "Carrot", description: "Orange root veggie", price: "$0.70" },
        { title: "Lettuce", description: "Green and leafy", price: "$1.20" },
      ],
    },
    {
      group: "Vegetables",
      items: [
        { title: "Carrot", description: "Orange root veggie", price: "$0.70" },
        { title: "Lettuce", description: "Green and leafy", price: "$1.20" },
      ],
    },
    {
      group: "Vegetables",
      items: [
        { title: "Carrot", description: "Orange root veggie", price: "$0.70" },
        { title: "Lettuce", description: "Green and leafy", price: "$1.20" },
      ],
    },
    {
      group: "Vegetables",
      items: [
        { title: "Carrot", description: "Orange root veggie", price: "$0.70" },
        { title: "Lettuce", description: "Green and leafy", price: "$1.20" },
      ],
    },
  ];
  const handleSelect = (item) => {
    setSelectedOption(item);
    setFee(item.price);
    setIsOpen(false);
  };
  // const { snapEmbed } = useSnap();
  const header = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("sessions")}`,
    },
  };
  const choosePromo = async (input) => {
    let result = 0;
    if (input.promoType == "P") {
      let promoValue = parseFloat(input.promoValue) / 100;
      result = parseFloat(subTotal) * promoValue;
      if (input.promoMaxType == "M") {
        if (tmp1 >= input.promoMaxOrder) {
          result = input.promoMaxOrder;
        }
      }
    } else {
      result = input.promoValue;
    }

    let finalResult = parseInt(result) + parseInt(discountTotal);
    setDiscountTotal(finalResult);
    let promoTmpChoose = structuredClone(promoChoose);
    console.log(input);
    promoTmpChoose.push(input);
    setPromoChoose(promoTmpChoose);
    closeModal();
    toast.success(`Success Choose Discount ${input.promoCode}`);
  };
  const findPromo = async (input) => {
    try {
      let response = await axios.get(
        url + "/cart/promo/" + promoSearch,
        header
      );
      if (response.data.success) {
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const getCourier = async () => {
    try {
      let body = {
        addressId: addressMain.id,
        chartId: cartItems.id,
      };
      let response = await axios.post(url + "/shipment/rate", body, header);
      if (response.data.success) {
        setCourierData(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getPromo = async () => {
    try {
      if (cartData != null) {
        let tmp = [];
        cartData.map((item) => {
          tmp.push(item.productId);
        });
        let body = {
          products: tmp,
        };
        let response = await axios.post(url + "/cart/promo", body, header);
        setPromo(response.data.data);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  const getAddress = async () => {
    try {
      let response = await axios.get(url + "/customer/profile", header);
      // kalo addressnya belom ada lempar ke profile
      if (response.data.data.addresses != null) {
        setAddress(response.data.data.addresses);
        setAddressMain(response.data.data.addresses[0]);
      } else {
        toast.warn("Please Add Address First");
        navigate("/profile");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const doPayment = async () => {
    try {
      if (paymentShow) return;
      setLoading(true);
      if (selectedOption == null) {
        toast.error("Please Choose Courier");
      } else {
        let deliveryName = "JNE";
        let old = parseInt(subTotal) + parseInt(fee);
        let body = {
          cartId: cartItems.id,
          promo: promoChoose,
          oldPrice: subTotal,
          finalPrice: totalPrice,
          addressId: addressMain.id,
          feeDelivery: fee,
          deliveryName: selectedOption.courier_code,
          deliveryService: selectedOption.courier_service_code,
          insurance: insurance,
          insuranceFee: insuranceFee,
        };
        console.log(body);
        let response = await axios.post(url + "/order", body, header);
        if (response.data.success) {
          getCartAmount();
          let data = response.data.data;
          window.location.href = data.url;
          // setPaymentShow(true);
          // setTimeout(() => {
          //   snapEmbed(data.api.token, "snap-container", {
          //     onSuccess: (result) => {
          //       console.log("Payment Success:", result);
          //       navigate(`/order-status?transaction_id=${response.data.id}`);
          //       setPaymentShow(false);
          //     },
          //     onPending: (result) => {
          //       console.log("Payment Pending:", result);
          //       navigate(`/order-status?transaction_id=${response.data.id}`);
          //       setPaymentShow(false);
          //     },
          //     onClose: () => {
          //       navigate(`/order-status?transaction_id=${response.data.id}`);
          //       setPaymentShow(false);
          //     },
          //   });
          // }, 500); // Small delay to ensure Snap.js is ready
        } else {
          toast.error(response.data.data);
          setPaymentShow(false);
        }
      }
    } catch (error) {
      console.log(error);
      setPaymentShow(false);
    } finally {
      setLoading(false);
    }
  };
  const totalPriceChange = async () => {
    let result =
      parseInt(subTotal) -
      parseInt(discountTotal) +
      parseInt(fee) +
      parseInt(insuranceFee);
    setTotalPrice(result);
  };
  const removePromo = async (index) => {
    try {
      let result = 0;
      if (index.promoType == "P") {
        let promoValue = index.promoValue / 100;
        result = parseFloat(subTotal) * promoValue;
        if (index.promoMaxType == "M") {
          if (tmp1 >= index.promoMaxOrder) {
            result = index.promoMaxOrder;
          }
        }
      } else {
        result = index.promoValue;
      }
      let finalResult = discountTotal - result;
      setDiscountTotal(finalResult);
      let indexPromo = promoChoose.findIndex(
        (data) => data.promoId == index.promoId
      );
      if (indexPromo != -1) {
        promoChoose.splice(indexPromo, 1);
        toast.error(`Success Remove Discount ${index.promoCode}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      closeModal();
    }
  };
  const insuranceOnChange = async (e) => {
    setInsurance(e.target.checked);

    let feeInsurance = parseFloat(subTotal) * 0.005;
    console.log(feeInsurance, "-", subTotal);
    setInsuranceFee(e.target.checked ? feeInsurance : 0);
  };
  // useEffect(() => {
  //   if (!location.state?.fromCart) {
  //     navigate("/"); // Redirect if accessed directly
  //   }
  // }, [location, navigate]);

  // useEffect(() => {
  //   if (token == null) {
  //     navigate("/login");
  //   }
  // }, [token]);
  useEffect(() => {
    if (products == null) {
      getProduct();
    }
    if (cartItems == null) {
      getChart();
    }
  }, [getChart, getProduct, cartItems, products]);

  useEffect(() => {
    if (cartItems != null) {
      setCartData(cartItems.items);
    }
  }, [cartItems]);

  useEffect(() => {}, [address, addressMain, promoChoose]);

  useEffect(() => {
    totalPriceChange();
  }, [cartData, subTotal, totalPrice]);
  useEffect(() => {
    getPromo();
  }, [cartData]);
  useEffect(() => {
    getSubTotal();
    totalPriceChange();
  }, [cartItems]);

  useEffect(() => {
    totalPriceChange();
  }, [fee, discountTotal, insuranceFee]);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //!todo validation token, get address, get chart, get product, get shipper, (promo coming BE , FE, BO), (ORDER, BE, BO)
  useEffect(() => {
    getAddress();
  }, []);
  useEffect(() => {
    if (address != null && cartItems != null && products != null) {
      setLoading(false);
    }
  }, [address, cartItems, products]);

  const getSubTotal = async () => {
    let total = await getCartAmount();
    setSubTotal(total);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      if (cartItems == null) {
        if (count === 3) {
          navigate("/");
        } else {
          setCount((prev) => prev + 1);
        }
      } else {
        clearInterval(intervalRef.current);
      }
    }, 3000);

    return () => clearInterval(intervalRef.current);
  }, [count]);

  useEffect(() => {
    if (addressMain != null) {
      getCourier();
    }
  }, [addressMain]);
  useEffect(() => {}, [courierData]);
  if (loading) return <Loading />;
  return (
    <>
      {!paymentShow && (
        <>
          <div className="bg-gray-200 min-h-screen py-8 mt-[70px]">
            <div className="container mx-auto px-4">
              {/* Header */}
              <h1 className="text-2xl font-bold mb-6 text-gray-800">
                Delivery
              </h1>

              {/* Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section: Shipping Address */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-bold mb-4 text-gray-800">
                    SHIPPING ADDRESS
                  </h2>
                  <p className="text-green-600 font-semibold mb-2">
                    📍 {`${addressMain.labelAlamat} * ${addressMain.penerima} `}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {`${addressMain.alamat}, ${addressMain.kelurahan.label}, ${addressMain.kecamatan.label}, ${addressMain.kota.label}, ${addressMain.provinsi.label}, ${addressMain.phone} `}
                  </p>
                  <div className="flex gap-4 mt-4">
                    {/* <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                      Change Address
                    </button> */}
                    {/* <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded">
                Kirim ke Beberapa Alamat
              </button> */}
                  </div>
                </div>

                {/* Middle Section: Cart Items */}
                <div className="bg-white p-6 rounded-lg shadow">
                  {/* Product List */}
                  <div className="space-y-4">
                    {/* Item 1 */}
                    {cartData.map((item, index) => {
                      const productData = products.find(
                        (product) => product.id === item.productId
                      );

                      let variant = productData.variants.find(
                        (variant1) => variant1.id == item.variant
                      );
                      return (
                        <div className="flex items-center gap-4" key={index}>
                          <img
                            src={productData.img[0]}
                            alt={productData.name}
                            className="w-16 h-16 rounded"
                          />
                          <div>
                            <h3 className="text-gray-700 font-semibold text-sm">
                              {`${productData.name} / ${variant.name} / ${item.size}`}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              {`${item.quantity} x `}
                              <PriceFormatter price={productData.price} />
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Notes Input */}
                </div>

                {/* Right Section: Pilih Pengiriman */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-bold mb-4 text-gray-800">
                    Courier
                  </h2>
                  <div
                    ref={dropdownRef}
                    className="relative max-w-md mx-auto mt-8"
                  >
                    <div
                      className="border border-gray-300 rounded-md p-3 cursor-pointer bg-white shadow-sm"
                      onClick={() => setIsOpen(!isOpen)}
                    >
                      <div className="text-gray-700">
                        {selectedOption ? (
                          <div className="flex justify-between">
                            <span>
                              {selectedOption.courier_name} -{" "}
                              {selectedOption.courier_service_name}
                            </span>
                            <span className="text-sm text-gray-500">
                              <PriceFormatter price={selectedOption.price} />
                            </span>
                          </div>
                        ) : (
                          "Choose Courier"
                        )}
                      </div>
                    </div>

                    {isOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                        {courierData.map((courier, index) => (
                          <div key={index} className="border-b last:border-b-0">
                            <div className="bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-700 uppercase">
                              {courier.company}
                            </div>
                            {courier.data.map((item, index) => (
                              <div
                                key={index}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-50"
                                onClick={() => handleSelect(item)}
                              >
                                <div className="flex justify-between">
                                  <span className="font-medium text-gray-800">
                                    {item.courier_name} -{" "}
                                    {item.courier_service_name}
                                  </span>
                                  <span className="text-sm text-gray-500">
                                    {item.description}
                                  </span>
                                </div>
                                <div className="text-right text-sm text-green-600">
                                  <PriceFormatter price={item.price} />
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {selectedOption && (
                    <div className="flex gap-2 mt-2 max-w-md mx-auto">
                      <input
                        type="checkbox"
                        id="insurance"
                        checked={insurance}
                        onChange={insuranceOnChange}
                      />
                      <label className="cursor-pointer" htmlFor="insurance">
                        Delivery Insurance
                      </label>
                    </div>
                  )}
                </div>

                {/* Order Summary: Full Width */}
                <div className="bg-white p-6 rounded-lg shadow lg:col-span-3">
                  <h2 className="text-lg font-bold mb-4 text-gray-800">
                    Order Summary
                  </h2>
                  <div className="text-gray-700">
                    {/* Price Details */}
                    <div className="flex justify-between mb-2">
                      <span>Sub Total</span>
                      <PriceFormatter price={subTotal} />
                    </div>
                    {fee != 0 && (
                      <div className="flex justify-between mb-2">
                        <span>Delivery Cost</span>

                        <PriceFormatter price={fee} />
                      </div>
                    )}
                    {insuranceFee != 0 && (
                      <div className="flex justify-between mb-2">
                        <span>Delivery Insurance</span>

                        <PriceFormatter price={insuranceFee} />
                      </div>
                    )}
                    {discountTotal != 0 && (
                      <div className="flex justify-between mb-2">
                        <span>Discount</span>
                        <PriceFormatter price={discountTotal} />
                      </div>
                    )}

                    <hr />
                    <div className="flex justify-between mb-2">
                      <b>Total</b>
                      <b>
                        <PriceFormatter price={totalPrice} />
                      </b>
                    </div>
                  </div>

                  {/* Donation Checkbox */}
                  <div className="mt-4">
                    {/* <div className="flex items-center mb-4">
                <input type="checkbox" id="donation" className="mr-2" />
                <label htmlFor="donation" className="text-gray-600 text-sm">
                  Top Donasi Sembako untuk Masyarakat Prasejahtera (Rp5.000)
                </label>
              </div> */}
                    {/* Promo Button */}
                    <button
                      className="bg-yellow-100 text-yellow-600 px-4 py-2 rounded mb-4 w-full"
                      onClick={() => openModal()}
                    >
                      Save more with discounts
                    </button>
                    {/* Payment Button */}
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded w-full"
                      onClick={() => doPayment()}
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal
            isOpen={modalOpen}
            onClose={closeModal}
            closeOnOutsideClick={false}
          >
            <div className="pt-10">
              <div className="flex gap-2 pb-4">
                <Input
                  width="max-w-[700px]"
                  placeholder="Search Code in here"
                  value={promoSearch}
                  onChange={(e) => setPromoSearch(e.target.value)}
                />
                <Button variant="secondary">Search</Button>
              </div>
              {promo.length === 0 && "No Discounts Available"}

              <div className=" bg-white border border-gray-300 rounded-md shadow-lg max-h-80 overflow-y-auto">
                {promo.map((promos, index) => {
                  const isChosen = promoChoose.some(
                    (p) => p.promoId === promos.promoId
                  );
                  return (
                    <div
                      key={index}
                      className={`border-b last:border-b-0 ${
                        isChosen ? "border-green-600 bg-green-200" : ""
                      }`}
                    >
                      <div
                        key={promos.promoId}
                        className="px-4 py-2 cursor-pointer even:bg-gray-100"
                      >
                        <div className="flex justify-between">
                          <div>
                            <span className="font-medium text-gray-800">
                              {promos.promoCode} - {promos.promoName}
                            </span>
                            <div className="text-sm text-gray-500">
                              {promos.promoDesc}
                              {promos.promoType == "F" ? (
                                <div className=" text-sm text-green-600">
                                  <PriceFormatter price={promos.promoValue} />
                                </div>
                              ) : (
                                <div className=" text-sm text-green-600">
                                  {promos.promoValue}%
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-center align-middle items-center text-center">
                            {isChosen ? (
                              <Button
                                variant="danger"
                                onClick={() => removePromo(promos)}
                              >
                                Remove
                              </Button>
                            ) : (
                              <Button onClick={() => choosePromo(promos)}>
                                Choose
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Modal>
        </>
      )}

      <div id="snap-container"></div>
    </>
  );
};

export default PlaceOrder;
