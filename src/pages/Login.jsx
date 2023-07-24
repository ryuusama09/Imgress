import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { MdEmail, MdPassword } from "react-icons/md";
import logo from "../assets/logo.png";
const Login = () => {
  const navigate = useNavigate();
  const Login = useStore((state) => state.login);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const login = async (e) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

    fetch("http://localhost:3003/dev/login", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const data = JSON.parse(result);
        console.log(data.result[0]);
        Login(data.result[0]);
        navigate("/");
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center bg-[#E6EEFF]">
      <div className="bg-white p-8 shadow-md rounded min-w-[380px]">
        <form
          className="flex flex-col justify-center gap-6"
          onSubmit={(e) => login(e)}
        >
          <img src={logo} className="max-w-[60px] self-center" />
          <h1 className="text-gray-800 text-3xl font-medium self-center">
            Welcome Back
          </h1>
          <p className="text-gray-600 text-md font-normal self-center">
            Enter your credentials to access your engines!
          </p>
          <div className="border border-gray-300 p-2 flex items-center rounded-md">
            <MdEmail className="text-blue-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Enter your email"
              className="p-1 w-full text-sm outline-none"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div className="border border-gray-300 p-2 flex items-center rounded-md">
            <MdPassword className="text-blue-500 mr-2" size={18} />
            <input
              type="password"
              placeholder="Enter your password"
              className="p-1 text-sm w-full outline-none"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded-md text-sm"
          >
            Login
          </button>
        </form>
      </div>
      <Link to="/register" className="text-blue-500 mt-4 text-center">
        Don't have an account? Register!
      </Link>
    </div>
  );
};

export default Login;
