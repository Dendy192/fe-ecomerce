import React, { useContext, useEffect, useState } from "react";
import { OtpInput } from "reactjs-otp-input";
import Cards from "../components/Cards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { backendUrl } from "../App";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../components/Loading";

const Otp = ({ setToken }) => {
  const url = backendUrl;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Resend state
  const [timer, setTimer] = useState(30); // Countdown timer in seconds
  // const { email, password, name } = location.state || {};
  const { formData } = useContext(UserContext);
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(formData.email);
  const [hasError, setHaserror] = useState(false);
  const handleChange = (otp) => setOtp(otp);
  const maskEmail = (email) => {
    const emailParts = email.split("@");
    const localPart = emailParts[0];
    const domainPart = emailParts[1];

    // Mask the local part: first 2 characters preserved, the rest replaced by 'x'
    const maskedLocalPart =
      localPart.slice(0, 2) +
      "xx" +
      "x".repeat(Math.max(localPart.length - 4, 0));

    // Mask the domain part: keep the first part of domain, replace the middle with 'x', and keep the last character
    const maskedDomainPart =
      domainPart.slice(0, domainPart.length - 1).replace(/[^@]/g, "x") +
      domainPart.slice(-1);

    // Reconstruct the masked email
    const maskedEmail = `${maskedLocalPart}@${maskedDomainPart}`;

    return maskedEmail;
  };
  const resendOtp = async () => {
    setLoading(true);
    try {
      let body = {
        email: email,
        name: formData.name,
      };
      let response = await axios.post(url + "/v1/api/generate", body);
      if (response.data.success) toast.success("OTP Resend successfully");
      else toast.error("Please Try Again");
    } catch (error) {
      toast.error(error);
    }
    setLoading(false);
  };

  const checkOtp = async () => {
    if (otp.length === 6) {
      setLoading(true);
      let body = {
        email: formData.email,
        name: formData.name,
        password: formData.password,
        code: otp,
      };
      try {
        let response = await axios.post(url + "/v1/api/verification", body);
        console.log(JSON.stringify(response));
        if (response.data.success) {
          console.log("masuk if");
          let token = response.data.data.mini_sessions;
          // localStorage.setItem("token", token);
          setToken(token);
          console.log("Token set successfully:", token);
          navigate("/");
          console.log("Navigating to home...");
        } else {
          toast.error("Please Try Again ");
          setHaserror(true);
        }
      } catch (error) {
        console.log(error);
        toast.error(error);
      }
    } else {
      setHaserror(false);
    }
    setLoading(false);
  };
  useEffect(() => {
    checkOtp();
  }, [otp]);

  useEffect(() => {
    if (!formData.email && !formData.name && !formData.password) {
      navigate("/login");
    }
  }, [formData]);
  useEffect(() => {
    // Countdown logic
    let interval;
    if (isResendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            clearInterval(interval);
            setIsResendDisabled(false); // Enable the resend action
            return 0;
          }
          return prevTimer - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval); // Clean up the interval
  }, [isResendDisabled]);
  useEffect(() => {
    sessionStorage.removeItem("activeTab");
    if (!email) navigate("/login");
    setLoading(false);
  }, [formData]);

  useEffect(() => {}, [email]);
  if (loading) return <Loading />;
  return (
    <div className="min-h-[calc(100vh-350px)] flex items-center justify-center py-16 ">
      <div className="w-[90%] sm:max-w-96 ">
        {/* <div className="w-full"> */}
        <Cards>
          <div className="flex justify-center items-center mb-4">
            <FontAwesomeIcon icon={faEnvelope} size="2x" />
          </div>
          <div className="flex justify-center items-center text-center mb-4">
            <p>
              We Already send an OTP to your email &nbsp;
              {maskEmail(email)}
            </p>
          </div>
          <div className="flex justify-center items-center mb-4">
            <OtpInput
              value={otp}
              onChange={handleChange}
              numInputs={6}
              isInputNum={true}
              // shouldAutoFocus={true}
              hasErrored={hasError}
              errorStyle={{ outline: "1px solid red" }}
              separator={
                <span
                  style={{
                    fontSize: "7px",
                    marginLeft: "5px",
                    marginRight: "5px",
                  }}
                >
                  -
                </span>
              }
              inputStyle={{
                width: "40px",
                height: "40px",

                backgroundColor: "transparent",
                outline: "1px solid gray",
              }}
            />
          </div>
          <div className="flex flex-col items-center mb-4">
            <p>
              You don't recive any OTP?&nbsp;
              <span
                onClick={isResendDisabled ? null : resendOtp}
                className={`text-blue-500 underline ${
                  isResendDisabled
                    ? "cursor-not-allowed text-gray-500"
                    : "cursor-pointer"
                }`}
              >
                {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
              </span>
            </p>
          </div>
        </Cards>
        {/* </div> */}
      </div>
    </div>
  );
};

export default Otp;
