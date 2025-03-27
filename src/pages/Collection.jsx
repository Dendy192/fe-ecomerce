import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "../components/Title";
import ProductItems from "../components/ProductItems";
import Loading from "../components/Loading";
import axios from "axios";
import { backendUrl } from "../App";

const Collection = () => {
  const url = backendUrl + "/v1/api/products";
  const { products, search, showSearch, getProduct } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState(null);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [subCategoryData, setSubCategoryData] = useState([]);
  const [sortType, setSortType] = useState("relavent");
  const [loading, setLoading] = useState(true);

  // const toggleCategory = (e) => {

  //   if (category.includes(e.target.value)) {
  //     setCategory((prev) => prev.filter((item) => item !== e.target.value));
  //   } else {
  //     setCategory((prev) => [...prev, e.target.value]);
  //   }

  // };
  const toggleCategory = (e) => {
    setLoading(true);
    const selectedCategory = e.target.value;

    setCategory((prev) =>
      prev.includes(selectedCategory)
        ? prev.filter((item) => item !== selectedCategory)
        : [...prev, selectedCategory]
    );
    setLoading(false);
  };

  const toggleSubCategory = (e) => {
    setLoading(true);
    const selectedSubCategory = e.target.value;

    setSubCategory((prev) =>
      prev.includes(selectedSubCategory)
        ? prev.filter((item) => item !== selectedSubCategory)
        : [...prev, selectedSubCategory]
    );
    setLoading(false);
  };

  const applyFilter = () => {
    setLoading(true);

    if (filterProducts != null) {
      let productsCopy = products.slice();

      if (showSearch && search) {
        productsCopy = productsCopy.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (category.length > 0) {
        productsCopy = productsCopy.filter((item) =>
          item.category.some((cat) => category.includes(cat.name))
        );
      }
      if (subCategory.length > 0) {
        productsCopy = productsCopy.filter((item) =>
          item.subCategory.some((sub) => subCategory.includes(sub.name))
        );
      }

      setFilterProducts(productsCopy);
    }
    setLoading(false);
  };

  const sortProduct = () => {
    setLoading(true);
    if (filterProducts != null) {
      let fpCopy = filterProducts.slice();
      switch (sortType) {
        case "low-high":
          setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
          break;

        case "high-low":
          setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
          break;

        default:
          applyFilter();
          break;
      }
    }
  };

  const getFilter = async () => {
    let response = await axios.get(url + "/filter");
    setCategoryData(response.data.data.categories);
    setSubCategoryData(response.data.data.subCategories);
  };
  useEffect(() => {
    if (products == null) {
      setLoading(true);
      getProduct();
    } else {
      getFilter();
      setFilterProducts(products);
    }
  }, [products, getProduct]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch]);

  useEffect(() => {
    sortProduct();
    setLoading(false);
  }, [sortType]);
  // useEffect(() => {
  //   applyFilter();
  // }, [filterProducts]);

  if (loading) return <Loading />;
  if (filterProducts == null) return <Loading />;
  return (
    <div className="flex flex-col mt-[80px] sm:flex-row gap-1 sm:gap-10 pt-10 border-t px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {/* filter options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2"
        >
          FILTERS
          <img
            className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        {/* category filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium ">CATEGORIES</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {categoryData.map((cat, index) => (
              <p className="flex gap-2" key={index}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={cat.name}
                  onChange={toggleCategory}
                />
                {cat.name}
              </p>
            ))}
          </div>
        </div>
        {/* subCategory */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? "" : "hidden"
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium ">TYPE</p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            {subCategoryData.map((sub, index) => (
              <p className="flex gap-2" key={index}>
                <input
                  className="w-3"
                  type="checkbox"
                  value={sub.name}
                  onChange={toggleSubCategory}
                />
                {sub.name}
              </p>
            ))}
          </div>
        </div>
      </div>
      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between text-base sm:text-2xl mb-4">
          <Title text1={"ALL"} text2={"COLLECTIONS"} />
          {/* product sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border-2 border-gray-300 text-sm px-2"
          >
            <option value="relavent">Sort By: Relavent</option>
            <option value="low-high">Sort By: Low to High</option>
            <option value="high-low">Sort By: High to Low</option>
          </select>
        </div>
        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-col-3 lg:grid-cols-4 gap-4 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItems
              key={index}
              name={item.name}
              id={item.id}
              price={item.price}
              image={item.img}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
