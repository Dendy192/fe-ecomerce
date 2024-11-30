import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = ({ token }) => {
  const { productId } = useParams();
  const { products, addToCart, getProduct, navigate } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [variants, setVariants] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item.id === productId) {
        setProductData(item);
        setImage(item.img[0]);
        return null;
      }
    });
  };
  useEffect(() => {
    // Fetch products only if not already loaded
    if (products.length === 0) {
      getProduct();
    }
  }, [products, getProduct]); // Only trigger if `products` is empty

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);
  useEffect(() => {}, [productData, image, variants]);
  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/* product data */}
      <div className="flex gap-12 sm:gap12 flex-col sm:flex-row">
        {/* product images */}
        <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
          <div className="flex sm:flex-col scrollbar-hide overflow-hidden sm:overflow-y-auto justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {/* <div className="flex sm:flex-col scrollbar-hide overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full"> */}
            {productData.img.map((item, index) => (
              <img
                src={item}
                key={index}
                onClick={() => setImage(item)}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[80%]">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>
        {/* --------- produt info------- */}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
          <div className="flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2">(122)</p>
          </div>
          <p className="mt-5 text-3xl font-medium">{productData.price}</p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>
          <div className="flex flex-col gap-4 my-8">
            <p>Variants</p>
            <div className="flex gap-2">
              {productData.variants.map((item) => (
                <button
                  key={item.kode}
                  onClick={() =>
                    setVariants((prev) => (prev === item.name ? "" : item.name))
                  }
                  className={`border py-2 px-4 bg-gray-100 ${
                    item.name === variants
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
              {/* {productData.variants.map((item) =>
                item.sizeStock.map((sizeStock, index) => (
                  <button
                    key={index}
                    variant="dark"
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
          {variants && size ? (
            <div className="flex flex-col gap-4 my-8">
              <p>kuantitas</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  className="px-3 py-2 border border-gray-800"
                />
              </div>
            </div>
          ) : (
            ""
          )}

          <button
            onClick={() => {
              if (token) addToCart(productData.id, variants, size);
              else navigate("/login");
            }}
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
          <b className="border px-5 py-3 text-sm"> Description</b>
          <p className="border px-5 py-3 text-sm"> Reviews (122)</p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sed porro,
            enim quidem impedit id earum quos excepturi itaque ad quia unde
            perspiciatis facilis accusamus debitis magni, hic, accusantium
            molestiae odit.
          </p>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Velit
            dolorum laboriosam facilis, libero distinctio dolores modi expedita
            consectetur magnam. Cumque praesentium voluptates vero cupiditate
            quia modi commodi impedit hic suscipit! Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Consequuntur porro illum quas illo
            totam exercitationem laboriosam dignissimos perspiciatis neque
            necessitatibus, fugiat commodi alias ea consectetur numquam
            recusandae ipsum magnam assumenda.
          </p>
        </div>
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
