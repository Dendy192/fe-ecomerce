import React, { useContext, useEffect, useRef, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import { useSearchParams } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import Cards from "../components/Cards";
import Button from "../components/Button";
import axios from "axios";
import { backendUrl } from "../App";
import Loading from "../components/Loading";
import PriceFormatter from "../components/PriceFormatter";

const Orders = ({ token }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, currency } = useContext(ShopContext);
  const url = backendUrl + "/v1/api/order";
  const [loading, setLoading] = useState(false);
  const toastId = useRef(null);
  const toastIdError = useRef(null);
  // localStorage.getItem("sessions")
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  // const tabs = [
  //   "Semua",
  //   "Belum Bayar",
  //   "Sedang Dikemas",
  //   "Dikirim",
  //   "Selesai",
  //   "Dibatalkan",
  // ];
  const tabs = [
    {
      id: "all",
      value: "All",
    },
    {
      id: "pay",
      value: "To Pay",
    },
    {
      id: "ship",
      value: "To Ship",
    },
    {
      id: "receive",
      value: "To Receive",
    },
    {
      id: "complete",
      value: "Complete",
    },
    {
      id: "cancelled",
      value: "Cancelled",
    },
  ];
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [activeTab, setActiveTab] = useState({ id: "all", value: "All" });
  const { ref, inView } = useInView();

  const fetchOrder = async (pageNum, reset = false) => {
    // setLoading(true);
    try {
      console.log(reset, pageNum);
      let response = await axios.get(
        `${url}?page=${pageNum}&limit=5&status=${activeTab.id}`,
        header
      );

      if (response.data.success) {
        let data = response.data.data;
        if (data.length > 0) {
          setOrders((prev) => (reset ? data : [...prev, ...data]));
          setPage((prevPage) => {
            return prevPage + 1;
          });
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    setOrders([]);
    setPage(0);
    setHasMore(true);
    fetchOrder(0, true);
  }, [activeTab]);

  useEffect(() => {
    if (inView && hasMore && page > 0) {
      fetchOrder(page);
    }
  }, [inView]);

  if (loading) return <Loading />;
  return (
    <div className="border-t pt-16 mt-[60px]  px-4 min-h-screen flex flex-col">
      <div className="text-2xl">
        <Title text1={"MY"} text2={"ORDERS"} />
      </div>
      <div className="p-4 max-w-2xl mx-auto flex-grow">
        <div className="flex space-x-4 overflow-x-auto pb-2 border-b justify-between w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 font-medium ${
                activeTab.id === tab.id
                  ? " text-black border-b-2 border-black"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.value}
            </button>
          ))}
        </div>
        {orders.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No Orders</p>
        )}

        {orders.map((order, index) => (
          <Cards
            key={index}
            className="mb-4 p-4 shadow-md flex justify-between items-center"
          >
            <div className="flex justify-between items-center">
              <h3 className="font-bold">{order.id}</h3>
              <p className="font-semibold text-gray-600">{order.message}</p>
            </div>
            <a href={`/list/order/${order.id}`}>
              {order.items.map((item, index) => {
                const varian = item.product.variants.find(
                  (variant1) => variant1.id == item.variantId
                );
                return (
                  <div
                    key={index}
                    className="grid grid-cols-3 items-center gap-2  border-b py-4  text-center text-xs sm:text-base"
                  >
                    <div className="flex items-center  relative">
                      <img
                        className="w-16 h-12 rounded object-cover"
                        src={`${backendUrl}/api/image/${item.product.img[0]}`}
                        alt={item.product.name}
                      />
                    </div>

                    <div className="text-left">
                      <p className="text-sm font-medium">{item.product.name}</p>
                      <p className="text-xs">Variant: {varian.name}</p>
                      <p className="text-xs">Size: {item.size}</p>
                      <p className="text-xs">Quantity: {item.quantity}</p>
                    </div>

                    <div>
                      <PriceFormatter price={item.price} />
                    </div>
                  </div>
                );
              })}
            </a>
            <div className="text-right">
              <p className="text-red-500 font-bold">
                Total: <PriceFormatter price={order.price} />
              </p>
            </div>
          </Cards>
        ))}
        {hasMore && <div ref={ref} className="h-10" />}
      </div>
      {/* <div>
        
        <div
        
          className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex items-start gap-6 text-sm">
            <img className="w-16 sm:20" src={""} alt="" />
            <div>
              <p className="sm:text-base font-medium">Test</p>
              <div className="flex items-center gap-3 mt-2 text-base text-gray-700">
                <p className="text-lg">
                  {currency}
                  1.000
                </p>
                <p>Quantity: 1</p>
                <p>Size: M</p>
              </div>
              <p className="mt-2">
                Date: <span className="text-gray-400">26 Oct 2024</span>
              </p>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-between">
            <div className="flex items-center gap-2">
              <p className="min-w-2 h-2 rounded-full bg-green-500"></p>
              <p className="text-sm md:text-base">Ready to ship</p>
            </div>
            <button className="border px-4 py-2 text-sm font-medium rounded-sm">
              Track Order
            </button>
          </div>
        </div>
        
      </div> */}
    </div>
  );
};

export default Orders;
