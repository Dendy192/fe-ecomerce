import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";

const Payment = ({ token }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {
    const order_id = searchParams.get("order_id");

    if (order_id) {
      // getTransactionDetail(transactionId);
      navigate(`/order-status/?transaction_id=${order_id}`);
    } else {
      navigate("/");
    }
  }, [searchParams]);
  if (loading) return <Loading />;
  return <div>Payment</div>;
};

export default Payment;
