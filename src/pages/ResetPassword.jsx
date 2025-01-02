import React, { useEffect, useState } from "react";
import Cards from "../components/Cards";
import { OtpInput } from "reactjs-otp-input";
import FloatingLabelInput from "../components/FloatingLabelInput";
import Button from "../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../components/Loading";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [isResendDisabled, setIsResendDisabled] = useState(true); // Resend state
  const [timer, setTimer] = useState(30); // Countdown timer in seconds
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasError, setHaserror] = useState(false);
  const [otp, setOtp] = useState("");
  const handleChange = (otp) => setOtp(otp);
  const [tab, setTab] = useState("reset");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [errors, setErrors] = useState({ password: "", confirmPassword: "" });
  //   const maskEmail = (email) => {
  //     const emailParts = email.split("@");
  //     const localPart = emailParts[0];
  //     const domainPart = emailParts[1];

  //     // Mask the local part: first 2 characters preserved, the rest replaced by 'x'
  //     const maskedLocalPart =
  //       localPart.slice(0, 2) +
  //       "xx" +
  //       "x".repeat(Math.max(localPart.length - 4, 0));

  //     // Mask the domain part: keep the first part of domain, replace the middle with 'x', and keep the last character
  //     const maskedDomainPart =
  //       domainPart.slice(0, domainPart.length - 1).replace(/[^@]/g, "x") +
  //       domainPart.slice(-1);

  //     // Reconstruct the masked email
  //     const maskedEmail = `${maskedLocalPart}@${maskedDomainPart}`;

  //     return maskedEmail;
  //   };
  const resendOtp = async () => {
    setLoading(true);
    try {
      let body = {
        email: email,
        name: "",
      };
      let response = await axios.post(url + "/v1/api/generate", body);
      if (response.data.success) toast.success("OTP Resend successfully");
      else toast.error("Please Try Again");
    } catch (error) {
      toast.error(error);
    }
    setLoading(false);
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least 1 uppercase, 1 number, and 1 special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
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

  useEffect(() => {
    if (otp.length === 6) setTab("verif");
  }, [otp]);

  useEffect(() => {
    let passwordError = "";
    let confirmError = "";
    if (password) {
      passwordError = !validatePassword(password)
        ? "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character"
        : "";
    }
    if (cPassword) {
      confirmError =
        cPassword === password ? "" : "Confirm Password must be same";
    }

    setErrors({ password: passwordError, confirmPassword: confirmError });
  }, [cPassword, password]);

  const submitBe = async () => {
    if (!password || !cPassword) {
      toast.error("Must input password and confirm Password");
    } else if (
      !errors.password &&
      !errors.confirmPassword &&
      password &&
      cPassword
    ) {
      toast.success("test success");
    } else {
      toast.error(errors.password + " " + errors.confirmPassword);
    }
  };
  if (loading) return <Loading />;
  return (
    <>
      {tab === "reset" && (
        <div className="min-h-[calc(100vh-350px)] flex  justify-center py-16 ">
          <div className="w-[90%] sm:max-w-96 ">
            {/* <div className="w-full"> */}
            <Cards header={"Reset Password"}>
              <div className="flex mb-4 mt-4">
                <p>
                  Enter the registered email. We will send you a verification
                  code to reset your password.
                </p>
              </div>
              <div className="flex   mb-4">
                <FloatingLabelInput
                  className="w-full"
                  type={"email"}
                  id={"email"}
                  label={"Email"}
                />
              </div>
              <div className="flex flex-col items-center mb-4">
                <Button
                  className="py-2"
                  size="lg"
                  variant="dark"
                  outline={true}
                  onClick={() => setTab("otp")}
                  type="button"
                >
                  Next
                </Button>
              </div>
            </Cards>
            {/* </div> */}
          </div>
        </div>
      )}
      {tab === "otp" && (
        <div className="min-h-[calc(100vh-350px)] flex items-center justify-center py-16 ">
          <div className="w-[90%] sm:max-w-96 ">
            <Cards>
              <div className="flex justify-center items-center mb-4">
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
              </div>
              <div className="flex justify-center items-center text-center mb-4">
                <p>
                  We Already send an OTP to your email &nbsp;
                  {/* {maskEmail(email)} */}
                </p>
              </div>
              <div className="flex justify-center items-center mb-4">
                <OtpInput
                  value={otp}
                  onChange={handleChange}
                  numInputs={6}
                  isInputNum={true}
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
                    {isResendDisabled
                      ? `Resend OTP in ${timer}s`
                      : "Resend OTP"}
                  </span>
                </p>
              </div>
            </Cards>
          </div>
        </div>
      )}
      {tab === "verif" && (
        <div className="min-h-[calc(100vh-350px)] flex  justify-center py-16 ">
          <div className="w-[90%] sm:max-w-96 ">
            {/* <div className="w-full"> */}
            <Cards header={"Reset Password"}>
              <div className="flex mb-4 mt-4">
                <p>Enter the new Password for the account .</p>
              </div>
              <div className="flex flex-col mb-4">
                <div className="mb-4">
                  <FloatingLabelInput
                    className="w-full "
                    type={"password"}
                    id={"password"}
                    label={"Password"}
                    error={errors.password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="mb-4">
                  <FloatingLabelInput
                    className="w-full"
                    type={"password"}
                    error={errors.confirmPassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    id={"confirmPassword"}
                    label={"Confirm Password"}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center mb-4">
                <Button
                  className="py-2"
                  size="lg"
                  variant="dark"
                  outline={true}
                  onClick={submitBe}
                  type="button"
                >
                  Submit
                </Button>
              </div>
            </Cards>
            {/* </div> */}
          </div>
        </div>
      )}
    </>
  );
};

export default ResetPassword;
