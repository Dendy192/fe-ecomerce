import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "../components/Button";
import { assets } from "../assets/assets";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import FloatingLabelInput from "../components/FloatingLabelInput";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

const Login = ({ setToken }) => {
  const site_key = import.meta.env.VITE_CAPTCHA_SITE_KEY;
  const url = backendUrl + "/v1/api";
  const { updateFormData } = useContext(UserContext);
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState("");
  const toastId = useRef(null);
  const toastIdError = useRef(null);

  const [captchaToken, setCaptchaToken] = useState("");

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token); // Store the token for verification
  };

  const [activeTab, setActiveTab] = useState(
    sessionStorage.getItem("activeTab")
  );
  const setSessions = () => {
    sessionStorage.setItem("activeTab", currentState);
  };
  const [errors, setErrors] = useState({ name: "", email: "", password: "" });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    // Minimum 8 characters, at least 1 uppercase, 1 number, and 1 special character
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (currentState === "Login") {
      if (!captchaToken) {
        if (!toast.isActive(toastIdError.current)) {
          toastIdError.current = toast.error("Please complete the CAPTCHA");
        }
      } else {
        let responseCaptcha = await axios.post(url + "/verification-captcha", {
          token: captchaToken,
        });
        if (responseCaptcha.data.success) {
          const emailError = !validateEmail(email)
            ? "Please enter a valid email address"
            : "";
          const passwordError =
            password === "" || password === null
              ? "Password must be filled"
              : "";
          if (!emailError && !passwordError) {
            let loginBody = {
              email: email,
              password: password,
            };
            let loginResponse = await axios.post(url + "/login", loginBody);
            if (loginResponse.data.success) {
              let token = loginResponse.data.data.token;
              setToken(token);
              navigate("/");
            } else {
              if (!toast.isActive(toastIdError.current)) {
                toastIdError.current = toast.error(
                  "Email / password incorrect. Please Try Again"
                );
              }
            }
          } else {
            setErrors({ email: emailError, password: passwordError });
          }
        } else {
          if (!toast.isActive(toastIdError.current)) {
            toastIdError.current = toast.error(
              "CAPTCHA verification failed. Please Try Again"
            );
          }
        }
      }
    } else {
      const emailError = !validateEmail(email)
        ? "Please enter a valid email address"
        : "";
      const passwordError = !validatePassword(password)
        ? "Password must be at least 8 characters long, include an uppercase letter, a number, and a special character"
        : "";

      const nameError =
        name === "" || name === null ? "Name must be filled" : "";

      if (!emailError && !passwordError && !nameError) {
        // check email first in already register or no
        let body = {
          email: email,
        };
        try {
          let response = await axios.post(url + "/generate", body);
          if (response.data.success) {
            updateFormData({ email, password, name });
            navigate("/verification");
          } else {
            console.log("di sini: ", response.data.data);
            if (!toast.isActive(toastId.current)) {
              toastId.current = toast.warn(response.data.data);
            }
          }
        } catch (error) {
          if (!toast.isActive(toastIdError.current)) {
            toastIdError.current = toast.error(error);
          }
        }
      } else {
        setErrors({
          name: nameError,
          email: emailError,
          password: passwordError,
        });
      }
    }
  };
  const [user, setUser] = useState([]);
  const [profile, setProfile] = useState([]);

  const login = useGoogleLogin({
    onSuccess: (codeResponse) => setUser(codeResponse),
    onError: (error) => console.log("Login Failed:", error),
  });
  const logOut = () => {
    googleLogout();
    setProfile(null);
  };

  useEffect(() => {
    if (activeTab === "Sign Up") {
      setActiveTab("Sign Up");
      setCurrentState("Sign Up");
    } else {
      setActiveTab("Login");
      setCurrentState("Login");
    }
  }, []);
  useEffect(() => {
    setSessions();
    setErrors({ name: "", email: "", password: "" });
  }, [currentState, activeTab]);

  useEffect(() => {}, [name, password, email]);

  useEffect(() => {}, [errors]);

  useEffect(() => {
    if (user) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`,
          {
            headers: {
              Authorization: `Bearer ${user.access_token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          setProfile(res.data);
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
    console.log(user);
  }, [user]);
  return (
    <form
      onSubmit={onSubmitHandler}
      className=" flex flex-col w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 mb-14 py-5"
    >
      <div className="inline-flex justify-center items-center gap-2 mb-2 mt-10">
        <p className="prata-regular  text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <FloatingLabelInput
          type={"text"}
          value={name}
          id={"name"}
          label={"Name"}
          onChange={(e) => setName(e.target.value)}
          error={errors.name}
        />
      )}
      <FloatingLabelInput
        type={"email"}
        value={email}
        id={"email"}
        label={"Email"}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />
      <FloatingLabelInput
        type={"password"}
        value={password}
        id={"password"}
        label={"Password"}
        onChange={(e) => setPassword(e.target.value)}
        error={errors.password}
      />

      {currentState === "Login" ? (
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password?</p>
        </div>
      ) : (
        ""
      )}
      <div className="flex justify-center items-center">
        <ReCAPTCHA
          sitekey={site_key} // Replace with your Google reCAPTCHA site key
          onChange={handleCaptchaChange}
        />
      </div>
      <Button
        className="py-2"
        size="lg"
        variant="dark"
        outline={true}
        type="submit"
      >
        {currentState === "Login" ? "Login" : "Sign Up"}
      </Button>

      {currentState === "Login" ? (
        <div>
          <p className="my-4">
            Don't have an account?
            <a
              onClick={() => setCurrentState("Sign Up")}
              className="font-semibold hover:text-blue-900 transition-colors duration-300 cursor-pointer"
            >
              Create account
            </a>
          </p>
          <div className="flex items-center my-4">
            <hr className="border-none h-[1px] w-8 bg-gray-500 flex-grow" />
            <span className="px-2 text-gray-500 text-sm">Or Login with</span>
            <hr className="border-none h-[1px] w-8 bg-gray-500 flex-grow" />
          </div>
        </div>
      ) : (
        <div>
          <p className="my-4">
            Already have an account?
            <a
              onClick={() => setCurrentState("Login")}
              className="font-semibold hover:text-blue-900 transition-colors duration-300 cursor-pointer"
            >
              Login here
            </a>
          </p>
          <div className="flex items-center my-4">
            <hr className="border-none h-[1px] w-8 bg-gray-500 flex-grow" />
            <span className="px-2 text-gray-500 text-sm">Or Sign up with</span>
            <hr className="border-none h-[1px] w-8 bg-gray-500 flex-grow" />
          </div>
        </div>
      )}
      <Button
        className="py-2"
        size="lg"
        variant="dark"
        outline={true}
        onClick={() => login()}
      >
        <div className="flex items-center space-x-3">
          <img src={assets.google_icon} className="w-5 h-5 mr-2" />
          {currentState === "Login" ? "Sign in" : "Sign Up"}
        </div>
      </Button>
    </form>
  );
};

export default Login;
