import { faFileLines, faMoneyBill1 } from "@fortawesome/free-regular-svg-icons";
import {
  faArrowLeft,
  faBoxOpen,
  faFloppyDisk,
  faStar,
  faTruckFast,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import Cards from "../components/Cards";
import Button from "../components/Button";
import { useNavigate, useParams } from "react-router-dom";
import PriceFormatter from "../components/PriceFormatter";
import Title from "../components/Title";
import { backendUrl } from "../App";
import axios from "axios";
import Loading from "../components/Loading";
import Modal from "../components/Modal";
import StarRating from "../components/StarRating";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import TextArea from "../components/TextArea";
import Row from "../components/Row";
import Col from "../components/Col";
import { toast } from "react-toastify";
const OrderDetail = ({ token }) => {
  const url = backendUrl + "/v1/api/order";
  const [activeStep, setActiveStep] = useState(0);
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [activeStep1, setActiveStep1] = useState(0);
  const [mainData, setMainData] = useState([]);
  const [steps, setSteps] = useState([]);
  const [modal, setModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(-1);
  const [review, setReview] = useState("");

  const openModal = () => {
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };
  const steps1Tmp = [
    {
      time: "23-03-2025 12:37",
      status: "Delivered",
      description:
        "Pesanan tiba di alamat tujuan. Diterima oleh Anggota keluarga.",
    },
    {
      time: "23-03-2025 07:17",
      status: "In transit",
      description: "Pesanan dalam proses pengantaran.",
    },
    {
      time: "23-03-2025 03:04",
      status: "Processing",
      description:
        "Pesanan diproses di lokasi transit KOTA JAKARTA SELATAN, Pancoran 2 Hub.",
    },
    {
      time: "22-03-2025 21:27",
      status: "Preparing to ship",
      description: "Kurir ditugaskan untuk menjemput pesanan.",
    },
    {
      time: "21-03-2025 04:52",
      status: "Order placed",
      description: "Order is placed.",
    },
  ];
  const [steps1, setSteps1] = useState([]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date
      .toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };
  const header = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const stepsTmp = [
    {
      id: "pay",
      label: "Order Placed",
      date: "27-03-2025 02:26",
      icon: <FontAwesomeIcon icon={faFileLines} />,
    },
    {
      id: "ship",
      label: "Order Paid",
      date: "",
      icon: <FontAwesomeIcon icon={faMoneyBill1} />,
    },
    {
      id: "shipOut",
      label: "Order Shipped Out",
      date: "",
      icon: <FontAwesomeIcon icon={faTruckFast} />,
    },
    {
      id: "receive",
      label: "Order Received",
      date: "",
      icon: <FontAwesomeIcon icon={faBoxOpen} />,
    },
    {
      id: "complete",
      label: "Order Rated",
      date: "",
      icon: <FontAwesomeIcon icon={faStar} />,
    },
  ];
  const onSubmitReview = async () => {
    setLoading(true);
    try {
      if (rating == 0 || rating == null) {
        toast.warning("Please Add Review");
      } else {
        console.log(rating);
        let tmp = [];
        mainData.items.map((item, index) => {
          const productData = item.product;
          let tmp1 = {
            productId: productData.id,
            rating: rating,
            review: review,
          };
          tmp.push(tmp1);
        });
        let body = {
          orderId: orderId,
          ratings: tmp,
        };
        let response = await axios.post(url + "/rating", body, header);
        if (response.data.success) {
          fetchOrder();
          toast.success(response.data.data);
          closeModal();
        } else {
          toast.error(response.data.data);
        }
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  const generateInvoice = async () => {
    try {
      let body = {
        id: orderId,
      };
      await axios.post(url + "/generate", body, header);
    } catch (error) {
      console.error(error.message);
    }
  };
  const fetchOrder = async () => {
    setLoading(true);
    try {
      let response = await axios.get(url + "/" + orderId, header);

      if (response.data.success) {
        let data = response.data.data;

        setMainData(data);

        let history = data.history;
        let sortedDate = [...history].sort(
          (a, b) => new Date(a.updateDate) - new Date(b.updateDate)
        );
        const sortedOrders = [...history].sort(
          (a, b) => new Date(b.updateDate) - new Date(a.updateDate)
        );
        let mappingData = [];
        sortedDate.forEach((data2) => {
          // Check if ID already exists in mappingData
          if (!mappingData.some((item) => item.status === data2.status)) {
            mappingData.push(data2);
          }
        });

        let updateSteps = stepsTmp.map((step) => {
          const match = mappingData.find((data) => data.status === step.id);
          return match ? { ...step, date: formatDate(match.updateDate) } : step;
        });
        const index = stepsTmp.findIndex((step) => step.id === data.status);
        let historyData = [];

        sortedOrders.forEach((data2) => {
          if (
            data2.status != "pay" ||
            data2.messages != "Waiting for Payment"
          ) {
            if (data2.status != "ship" || data2.messages != "Being packed") {
              let body = {
                time: formatDate(data2.updateDate),
                status:
                  data2.status == "pay" && data2.messages == "Payment Receive"
                    ? "Order Created"
                    : data2.status,
                description:
                  data2.status == "pay" && data2.messages == "Payment Receive"
                    ? "Order is Created"
                    : data2.messages,
              };

              historyData.push(body);
            }

            setSteps1(historyData);
          }
          // let body {

          // }
        });
        setSteps(updateSteps);
        setActiveStep(index);
      } else {
        navigate("/list/order");
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchOrder();
  }, []);
  if (loading) return <Loading />;
  return (
    <div className="flex flex-col mt-[60px] gap-1 sm:gap-10 pt-10 border-t px-4">
      <Cards>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-col">
            <Button
              variant="secondary"
              className="text-[8px] md:text-xs lg:text-sm"
              onClick={() => (window.location.href = "/list/order")}
            >
              <p>
                <FontAwesomeIcon icon={faArrowLeft} /> Back
              </p>
            </Button>
          </div>
          <div>
            <p className="text-[8px] md:text-xs lg:text-sm">
              Order Id: {orderId} &nbsp; | &nbsp;
              <span className="text-blue-500">{mainData.message}</span>
            </p>
          </div>
          <div className="flex flex-row justify-end items-center gap-2">
            {mainData.status == "receive" && (
              <Button
                variant="warning"
                className="text-[8px] md:text-xs lg:text-sm"
                onClick={() => openModal()}
              >
                Review
              </Button>
            )}

            <Button
              variant="dark"
              className="text-[8px] md:text-xs lg:text-sm"
              onClick={() => generateInvoice()}
            >
              View Invoice
            </Button>
          </div>
        </div>
      </Cards>
      <div className="w-full px-4 md:px-24 py-4 ">
        <div className="flex flex-col items-center w-full max-w-3xl mx-auto">
          <div className="flex items-center justify-around w-full relative">
            {steps.map((step, index) => (
              <div
                key={index}
                className="relative  flex flex-col items-center w-full "
              >
                <div
                  className={`flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition-all ${
                    activeStep >= index
                      ? "border-blue-500 bg-blue-100"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {step.icon}
                </div>

                {/* <div className="absolute -bottom-12 md:-bottom-16 text-center w-max">
                 
                    <div className="flex flex-col gap-3 md:flex-row items-center md:gap-1 font-semibold text-[8px] md:text-sm">
                      <p
                        className={`  ${
                          activeStep === index
                            ? "text-blue-600"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                    </div>

                    
                    <p className="text-[8px] md:text-sm text-gray-400">
                      {step.date}
                    </p>
                  </div> */}
                <div className="absolute -bottom-12 md:-bottom-16 text-center w-max">
                  <p
                    className={`font-semibold text-[8px] md:text-xs lg:text-sm ${
                      activeStep === index ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </p>

                  <p className="text-[8px] md:text-xs lg:text-sm text-gray-400">
                    {step.date}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`absolute top-4 md:top-5 left-1/2 w-full h-0.5 -z-10 ${
                      activeStep >= index + 1 ? "bg-blue-500" : "bg-gray-600"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <br />

      <Cards>
        <div className="flex flex-row  justify-between w-full mt-6 text-[8px] md:text-xs lg:text-sm">
          <div className="flex flex-col">
            <div>
              <b>Delivery Address</b>
              <p>
                {mainData.address.name} {mainData.address.name}
              </p>
              <p>{mainData.address.address}</p>
            </div>
            <br />
            {mainData.trackingNumber && (
              <div className="flex justify-between ">
                <p className="flex-1 text-start">No Resi</p>
                <p className=" text-center px-1 py-0">:</p>
                <p className="flex-1 text-start">{mainData.trackingNumber}</p>
              </div>
            )}

            <div className="flex justify-between ">
              <p className="flex-1 text-start">Courier</p>
              <p className=" text-center px-1 py-0">:</p>
              <p className="flex-1 text-start">{mainData.courier}</p>
            </div>
          </div>
          <div>
            <div className="">
              <h2 className="text-lg font-semibold mb-4">Order Tracking</h2>
              <div className="relative border-l-2 border-gray-300 pl-6">
                {steps1.map((step, index) => (
                  <div key={index} className="mb-6 relative flex items-start">
                    {/* Indicator */}
                    <div className="absolute -left-3 top-1 h-6 w-6 flex items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                      {index === 0 ? (
                        <span className="block h-4 w-4 bg-green-500 rounded-full"></span>
                      ) : (
                        <span className="block h-3 w-3 bg-gray-400 rounded-full"></span>
                      )}
                    </div>
                    {/* Content */}
                    <div className="ml-6">
                      <p className="text-sm font-semibold text-gray-700">
                        {step.time}
                      </p>
                      <p
                        className={`text-sm font-bold ${
                          index === 0 ? "text-green-600" : "text-gray-700"
                        }`}
                      >
                        {step.description}
                      </p>
                      {/* <p className="text-sm text-gray-500">
                        {step.description}
                      </p> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Cards>
      <Cards>
        <div>
          {/* ini masukin buat product list */}
          {mainData.items.map((item, index) => {
            const productData = item.product;
            const variant = productData.variants.find(
              (variant1) => variant1.id == item.variantId
            );

            return (
              <div
                key={index}
                className="grid grid-cols-5 font-medium text-center text-base border-y"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`${backendUrl}/api/image/${productData.img[0]}`}
                    alt="test"
                    className="w-16 sm:w-20 rounded object-cover"
                  />
                  <p className="text-sm sm:text-base font-medium">
                    {productData.name}
                  </p>
                </div>
                <p className="flex items-center">{variant.name}</p>
                <p className="flex items-center">{item.size}</p>
                <p className="flex items-center">x{item.quantity}</p>
                <p className="flex items-center">
                  <PriceFormatter price={item.price} />
                </p>
              </div>
            );
          })}

          <div className="flex justify-end my-10">
            <div className="w-full sm:w-[450px]">
              <div className="flex flex-col gap-2 mt-2 text-sm">
                <div className="flex justify-between ">
                  <p className="flex-1 text-end">Payment Method</p>
                  <p className=" text-center px-1 py-0">:</p>
                  <p className="flex-1 text-end">{mainData.payment}</p>
                </div>
                <div className="flex justify-between ">
                  <p className="flex-1 text-end">SubTotal</p>
                  <p className=" text-center px-1 py-0">:</p>
                  <p className="flex-1 text-end">
                    <PriceFormatter price={mainData.oldPrice} />
                  </p>
                </div>
                <div className="flex justify-between ">
                  <p className="flex-1 text-end">Shipping Fee</p>
                  <p className=" text-center px-1 py-0">:</p>
                  <p className="flex-1 text-end">
                    <PriceFormatter price={mainData.fee} />
                  </p>
                </div>
                <div className="flex justify-between ">
                  <p className="flex-1 text-end">Discount</p>
                  <p className=" text-center px-1 py-0">:</p>
                  <p className="flex-1 text-end">
                    - <PriceFormatter price={mainData.promoTotal} />
                  </p>
                </div>
                <hr />
                <div className="flex justify-between ">
                  <p className="flex-1 text-end">Total</p>
                  <p className=" text-center px-1 py-0">:</p>
                  <b className="flex-1 text-end">
                    <PriceFormatter price={mainData.price} />
                  </b>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Cards>
      <Modal
        isOpen={modal}
        onClose={closeModal}
        closeOnOutsideClick={false}
        header="Add Review"
      >
        <div className="pt-8">
          {mainData.items.map((item, index) => {
            const productData = item.product;
            const variant = productData.variants.find(
              (variant1) => variant1.id == item.variantId
            );

            return (
              <div
                key={index}
                className="grid grid-cols-2 font-medium text-center text-base border-y"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`${backendUrl}/api/image/${productData.img[0]}`}
                    alt="test"
                    className="w-16 sm:w-20 rounded object-cover"
                  />
                  <p className="text-sm sm:text-base font-medium">
                    {productData.name}
                  </p>
                </div>
                <p className="flex items-center pt-4">{variant.name}</p>
                <p className="flex items-center pt-4">Rating</p>
                <div className="flex items-center  pt-4">
                  <Rating
                    name="hover-feedback"
                    value={rating}
                    precision={1}
                    size="large"
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                    onChangeActive={(event, newHover) => {
                      setHover(newHover);
                    }}
                    emptyIcon={
                      <StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />
                    }
                  />
                </div>
                <p className="flex items-center pt-4">Review</p>
                <p className="flex items-center pt-4 pr-12">
                  <TextArea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                  />
                </p>
              </div>
            );
          })}
          <Row className="items-end justify-end pt-7">
            <Col>
              <Button size="lg" variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
            </Col>
            <Col>
              <Button size="lg" onClick={onSubmitReview}>
                <FontAwesomeIcon icon={faFloppyDisk} /> Save
              </Button>
            </Col>
          </Row>
        </div>
      </Modal>
    </div>
  );
};

export default OrderDetail;
