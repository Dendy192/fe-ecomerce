import React, { useEffect, useState } from "react";
import Cards from "./Cards";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { OtpInput } from "reactjs-otp-input";

const OtpCustom = ({ email, name }) => {
  const [otp, setOtp] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Resend state
  const [timer, setTimer] = useState(30);
  const [hasError, setHaserror] = useState(false);

  const handleChange = () => {};
  const resendOtp = () => {};
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
  return (
    <div className=" flex items-center justify-center py-16 ">
      <div className="w-[90%] sm:max-w-96 ">
        {/* <div className="w-full"> */}
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
        {/* </div> */}
      </div>
    </div>
  );
};

export default OtpCustom;
