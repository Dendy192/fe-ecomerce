import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Loading from "../components/Loading";
import { backendUrl } from "../App";
import axios from "axios";

const OrderStatus = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const url = backendUrl + "/v1/api/order/check";
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const transactionId1 = searchParams.get("transaction_id");
  const header = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("sessions")}`,
    },
  };
  const getTransaction = async (transactionId) => {
    try {
      let response = await axios.get(url + "/" + transactionId, header);
      setTransaction(transactionId);

      if (response.data.success) {
        navigate("/list/order");
      } else {
        navigate("/");
      }
    } catch (error) {
      navigate("/");
    }
  };
  useEffect(() => {
    const transactionId = searchParams.get("transaction_id");
    console.log(searchParams, searchParams.get("transaction_id"));
    if (transactionId) {
      // getTransactionDetail(transactionId);

      getTransaction(transactionId);
      setLoading(false);
    } else {
      navigate("/");
    }
  }, [searchParams, transaction]);

  useEffect(() => {
    if (transaction != null) {
      setLoading(false);
    }
  }, [transaction]);
  if (loading) return <Loading />;
  return (
    <div className="bg-gray-200 min-h-screen py-8 mt-[70px]">
      <div>Order Status</div>
      <div>id transaction {transactionId1}</div>
    </div>
  );
};

export default OrderStatus;
