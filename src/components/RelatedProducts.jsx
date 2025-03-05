import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItems from "./ProductItems";

const RelatedProducts = ({ category, subCategory }) => {
  const { products } = useContext(ShopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      productsCopy = productsCopy.filter(
        (item) => item.category.id === category.id
      );
      productsCopy = productsCopy.filter(
        (item) => item.subCategory.id === subCategory.id
      );

      setRelated(productsCopy.slice(0, 5));
    }
    // if (products.length > 0 && category?.id && subCategory?.id) {
    //   const filteredProducts = products
    //     .filter(
    //       (item) =>
    //         item.category?.id === category.id &&
    //         item.subCategory?.id === subCategory.id
    //     )
    //     .map((product) => ({
    //       ...product,
    //       img: product.img.map((imgPath) => `${backendUrl}/images/${imgPath}`),
    //     }));

    //   setRelated(filteredProducts.slice(0, 5));
    // }
  }, [products]);

  return (
    <div className="my-24 ">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          <ProductItems
            key={index}
            id={item.id}
            name={item.name}
            image={item.img}
            price={item.price}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
