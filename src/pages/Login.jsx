import React, { useEffect, useState } from "react";
import Button from "../components/Button";
import { assets } from "../assets/assets";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const onSubmitHandler = async (event) => {
    event.preventDefault();
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
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800 mb-14 "
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Login" ? (
        ""
      ) : (
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-800"
          placeholder="Name"
          required
        />
      )}
      <input
        type="email"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Email"
        required
      />
      <input
        type="password"
        className="w-full px-3 py-2 border border-gray-800"
        placeholder="Password"
        required
      />
      {currentState === "Login" ? (
        <div className="w-full flex justify-between text-sm mt-[-8px]">
          <p className="cursor-pointer">Forgot your password?</p>
        </div>
      ) : (
        ""
      )}

      <Button className="py-2" size="lg" variant="dark" outline={true}>
        {currentState === "Login" ? "Sign in" : "Sign Up"}
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
