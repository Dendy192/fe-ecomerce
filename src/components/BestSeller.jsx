import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItems from "./ProductItems";
import Loading from "./Loading";

const BestSeller = () => {
  const { products, getProduct } = useContext(ShopContext);
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    // Fetch products only if not already loaded
    if (products.length === 0) {
      getProduct();
    }
  }, [products, getProduct]); // Only trigger if `products` is empty

  useEffect(() => {
    const tmpProducts = structuredClone(products);
    const sortedResponse = tmpProducts.sort(
      (a, b) => new Date(b.create_dt) - new Date(a.create_dt)
    );

    const bestProduct = sortedResponse.filter((item) => item.best);

    setBestSeller(bestProduct.slice(0, 5));
  }, [products]);

  return (
    <div className="my-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="text-center text-3xl py-8">
        <Title text1={"BEST"} text2={"SELLERS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequuntur
          odio, quos sapiente hic aperiam repellendus adipisci veritatis
          dolores, perferendis dolore, nemo alias corporis earum modi laborum
          natus doloremque doloribus minus.
        </p>
      </div>
      <div className="grid gdir-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {bestSeller.map((item, index) => (
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

export default BestSeller;
