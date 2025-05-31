import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { backendUrl } from "../App";
import axios from "axios";
import Loading from "../components/Loading";
import PriceFormatter from "../components/PriceFormatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import StarsRatingDisplay from "../components/StarsRatingDisplay";

const Product = ({ token }) => {
  const { productId } = useParams();
  const url = backendUrl + "/v1/api/products";
  const { products, addToCart, getProduct, navigate } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [variants, setVariants] = useState("");
  const [video, setVideo] = useState(null);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(0);
  const [sizeData, setSizeData] = useState(null);
  const toastId = useRef(null);
  const toastIdError = useRef(null);
  const [currentState, setCurrentState] = useState("desc");
  const [review, setReview] = useState([]);
  const sizeTemplate = [
    {
      size: "S",
      stock: 0,
    },
    {
      size: "M",
      stock: 0,
    },
    {
      size: "L",
      stock: 0,
    },
    {
      size: "XL",
      stock: 0,
    },
    {
      size: "XLL",
      stock: 0,
    },
  ];
  const fetchProductData = async () => {
    let result = true;
    if (products == null) {
      getProduct();
    } else {
      products.map((item) => {
        if (item.id === productId) {
          setQuantity(0);
          setSize(null);
          setVariants(null);
          setProductData(item);

          setImage(item.img[0]);
          setCurrentMedia("img");
          setVideo(null);
          if (item.video) {
            setVideo(`${backendUrl}/api/video/${item.video}`);

            setCurrentMedia("video");
          }
          setIsLoading(false);
          result = false;
          return null;
        }
      });
      if (result) navigate("/collection");
    }
  };
  const onClickVariant = async (id) => {
    setVariants(id);
    setSize(null);
    setQuantity(null);
    productData.variants.map((item) => {
      if (item.id == id) {
        setImage(item.img);
        setSizeData(item.sizeStock);
      }
    });
  };
  const quantityChange = (value) => {
    value = value.replace(/^0+/, "");
    if (value == 0) {
      setQuantity(0);
    } else {
      setQuantity(value);
    }
  };
  const quantityButton = (value) => {
    let valTmp = parseInt(quantity) + parseInt(value);

    if (valTmp >= 0) setQuantity(valTmp);
  };
  const onAddToCart = async () => {
    try {
      setIsLoading(true);
      if (!variants) {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error("Select Product Variant");
        }
      } else if (!size) {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error("Select Product Size");
        }
      } else if (!quantity || quantity == 0) {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error("Input Quantity ");
        }
      } else if (token) {
        // itemId, variantsId, size, quantity
        let response = await addToCart(
          productData.id,
          variants,
          size,
          quantity
        );
        if (response.status) {
          if (!toast.isActive(toastId.current)) {
            toastId.current = toast.success(response.messages);
          }
        } else {
          if (!toast.isActive(toastIdError.current)) {
            toastIdError.current = toast.error(response.messages);
          }
        }
      } else {
        navigate("/login");
        window.scrollTo(0, 0);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRating = async () => {
    try {
      setIsLoading(true);
      let response = await axios.get(url + "/rating/" + productId);
      setReview(response.data.data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch products only if not already loaded
    if (products == null) {
      setIsLoading(true);
      getProduct();
      setIsLoading(false);
    }
  }, [products, getProduct]); // Only trigger if `products` is empty

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);
  useEffect(() => {
    getRating();
  }, []);
  useEffect(() => {}, [
    productData,
    image,
    variants,
    video,
    sizeData,
    quantity,
  ]);
  if (isLoading) return <Loading />;
  return productData ? (
    <div className="border-t-2 mt-[80px] pt-10 transition-opacity ease-in duration-500 opacity-100 px-4">
      {/* product data */}
      <div className="flex gap-12 sm:gap12 flex-col sm:flex-row">
        {/* product images */}
        <div className="flex-1 min-h-[400px] flex flex-col-reverse gap-3 sm:flex-row">
          {/* Thumbnails Section (Scrollable) */}
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-auto scrollbar-hide sm:max-h-[450px] w-full sm:w-[18.7%]">
            <div className="flex sm:flex-col gap-2 sm:gap-3">
              {video && (
                <div
                  onClick={() => setCurrentMedia("video")}
                  className="w-[30%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer max-w-[100px] sm:max-w-full"
                >
                  <video
                    className="w-full h-auto object-cover"
                    muted
                    playsInline
                    controlsList="nodownload"
                  >
                    <source src={`${video} `} type="video/mp4" />
                  </video>
                </div>
              )}
              {productData.img.map((item, index) => (
                <img
                  src={item}
                  key={index}
                  onClick={() => {
                    setImage(item);
                    setCurrentMedia("img");
                  }}
                  className="w-[30%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer max-w-[100px] sm:max-w-full"
                  alt=""
                />
              ))}
              {productData.variants.map((item) => (
                <img
                  src={item.img}
                  key={item.id}
                  onClick={() => {
                    setImage(item.img);
                    setCurrentMedia("img");
                  }}
                  className="w-[30%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer max-w-[100px] sm:max-w-full"
                  alt=""
                />
              ))}
            </div>
          </div>

          {/* Main Image Section */}
          <div className="w-full sm:w-[80%] flex justify-center items-center">
            {video && currentMedia === "video" ? (
              <video
                controls
                // autoPlay
                playsInline
                className="w-full max-w-[400px] sm:max-w-[500px] object-contain sm:max-h-[600px]"
              >
                <source src={`${video} `} type="video/mp4" />
              </video>
            ) : (
              <img
                className="w-full sm:max-h-[600px] max-w-[400px] sm:max-w-[500px] object-contain"
                src={image}
                alt=""
              />
            )}
          </div>
        </div>
        {/* --------- produt info------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <StarsRatingDisplay rating={productData.avgRating} />
            {productData.ratings > 0 && (
              <p className="pl-2">({productData.avgRating})</p>
            )}
          </div>
          <p className="mt-5 text-3xl font-medium">
            <PriceFormatter price={productData.price} />
          </p>

          <div className="flex flex-col gap-4 my-8">
            <p>Variants</p>
            <div className="flex gap-2">
              {productData.variants.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onClickVariant(item.id)}
                  className={`border py-2 px-4 bg-gray-100 ${
                    item.id === variants
                      ? "border-orange-500 text-orange-500"
                      : ""
                  } hover:border-orange-500 hover:text-orange-500`}
                >
                  {item.name}
                </button>
              ))}
              {/* {productData.variants.map((item) =>
                item.sizeStock.map((sizeStock, index) => (
                  <button
                    key={index}
                  
                    onClick={() => setSize(sizeStock.size)}
                    className={`border py-2 px-4 bg-gray-100 ${
                      sizeStock.size === size ? "border-orange-500" : ""
                    } ${sizeStock.stock === 0 ? "disabled" : ""}`}
                  >
                    {item}
                  </button>
                ))
              )} */}
            </div>
          </div>

          <div className="flex flex-col gap-4 my-8">
            <p>Select Size</p>
            <div className="flex gap-2">
              {variants
                ? sizeData.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (item.stock > 0) {
                          setSize(item.size);
                          setQuantity(0);
                        }
                      }}
                      disabled={item.stock === 0}
                      className={`border py-2 px-4  ${
                        item.size === size
                          ? "bg-gray-100 border-orange-500"
                          : ""
                      } ${
                        item.stock == 0 ? "bg-gray-400  cursor-not-allowed" : ""
                      }`}
                    >
                      {item.size}
                    </button>
                  ))
                : sizeTemplate.map((item1, index) => (
                    <button
                      key={index}
                      disabled={true}
                      className={`border py-2 px-4 bg-gray-400 opacity-50 cursor-not-allowed `}
                    >
                      {item1.size}
                    </button>
                  ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 my-8">
            <p>Quantity</p>
            <div className="flex gap-2">
              {variants && size ? (
                <div className="flex justify-center items-center">
                  <div
                    className="px-2 cursor-pointer"
                    onClick={() => quantityButton(-1)}
                  >
                    <FontAwesomeIcon icon={faCircleMinus} size="2xl" />
                  </div>
                  <div className="">
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => quantityChange(e.target.value)}
                      className="px-3 py-2 border border-gray-800"
                    />
                  </div>

                  <div
                    className="px-2 cursor-pointer"
                    onClick={() => quantityButton(+1)}
                  >
                    <FontAwesomeIcon icon={faCirclePlus} size="2xl" />
                  </div>
                </div>
              ) : (
                <input
                  type="number"
                  value=""
                  className="px-3 py-2 border border-gray-800"
                  disabled={true}
                />
              )}
            </div>
          </div>

          <button
            onClick={onAddToCart}
            className="bg-black text-white px-8 py-3 text-sm active:bg-gray-700 "
          >
            ADD TO CART
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
            <p>100% Original Product.</p>
          </div>
        </div>
      </div>
      {/* description and review section */}
      <div className="mt-20">
        <div className="flex">
          <button
            className={`border px-5 py-3 text-sm ${
              currentState === "desc"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setCurrentState("desc")}
          >
            Description
          </button>
          <button
            className={`border  px-5 py-3 text-sm ${
              currentState === "rate"
                ? "text-black border-b-2 border-black"
                : "text-gray-500"
            }`}
            onClick={() => setCurrentState("rate")}
          >
            <p> Reviews ({productData.ratings})</p>
          </button>
        </div>
        {currentState === "desc" && (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p>{productData.desc ? productData.desc : "No Description"}</p>
          </div>
        )}
        {currentState === "rate" && (
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500 max-h-80 overflow-y-auto">
            {productData.ratings === 0 ? (
              "No Review"
            ) : (
              <>
                {review.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="border-b last:border-b-0 px-4 grid grid-cols-3 items-center gap-2  py-4  text-center text-xs sm:text-base"
                    >
                      <div className="text-left">
                        <p className="text-sm font-medium">{item.userName}</p>
                        <p className="text-xs"> {item.date}</p>
                      </div>

                      <div>
                        <p className="font-medium underline ">{item.product}</p>
                        <p className=""> {item.review}</p>
                      </div>
                      <div className="flex items-center  relative">
                        <StarsRatingDisplay rating={item.rating} /> (
                        {item.rating})
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        )}
      </div>
      {/* display rolated product */}
      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
