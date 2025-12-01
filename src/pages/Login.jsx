import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../contexts/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [currentState, setCurrentState] = useState("Sign Up");
  const { token, navigate, backendUrl, setToken } = useContext(ShopContext);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const onSumbitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsLoading(true); // Start loading
      if (currentState === "Sign Up") {
        const response = await axios.post(backendUrl + "/api/user/register", {
          name,
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Registration successful!"); // Success toast for signup
          navigate(-1); // Navigate to home after signup
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem("token", response.data.token);
          toast.success("Login successful!"); // Success toast for login
          navigate("/");
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, []);

  return (
    <form
      onSubmit={onSumbitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>
      {currentState === "Sign Up" && (
        <input
          className="w-full px-3 py-2 border border-gray-800"
          type="text"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
          required
        />
      )}
      <input
        className="w-full px-3 py-2 border border-gray-800"
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        required
      />
      <input
        className="w-full px-3 py-2 border border-gray-800"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        required
      />
      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer">Forgot Password?</p>
        {currentState === "Sign Up" ? (
          <p
            onClick={() => setCurrentState("Login")}
            className="cursor-pointer"
          >
            Login Here
          </p>
        ) : (
          <p
            onClick={() => setCurrentState("Sign Up")}
            className="cursor-pointer"
          >
            Create an account
          </p>
        )}
      </div>
      <button
        className="bg-black text-white font-light px-8 py-2 mt-4 disabled:bg-gray-500 flex items-center justify-center gap-2"
        type="submit"
        disabled={isLoading}
      >
        {isLoading && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        )}
        {currentState}
      </button>
    </form>
  );
};

export default Login;
