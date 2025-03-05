import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "./Title";
import PriceFormatter from "./PriceFormatter";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, cartItems } =
    useContext(ShopContext);

  const [totalPrice, setTotalPrice] = useState(0);

  const getSubTotal = async () => {
    let total = await getCartAmount();
    setTotalPrice(total);
  };
  useEffect(() => {
    getSubTotal();
  }, [cartItems]);

  useEffect(() => {}, [totalPrice]);
  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>
      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <PriceFormatter price={totalPrice} />
        </div>
        <hr />
        {/* {!delivery_fee ? (
          <div className="flex justify-between">
            <p>Shipping fee</p>
            <p>
              {currency}
              {delivery_fee}.000
            </p>
          </div>
        ) : (
          ""
        )} */}

        {/* <hr /> */}
        {/* <div className="flex justify-between">
          <b>Total (estimate)</b>
          <b>
            {currency}
            {getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee}.000
          </b>
        </div> */}
      </div>
    </div>
  );
};

export default CartTotal;
