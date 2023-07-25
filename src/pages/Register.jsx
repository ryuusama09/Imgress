import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { MdEmail, MdPassword, MdPerson } from "react-icons/md";
import wallpaper from "../assets/wallpaper.png";
const Register = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const register = async (e) => {
    e.preventDefault();
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(data);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };
    fetch("http://localhost:3003/dev/signup", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        navigate("/login");
      })
      .catch((error) => console.log("error", error));
  };

  return (
    <div className="w-screen h-screen flex justify-between p-8  bg-gradient-to-r from-cyan-100 to-teal-400">
      <div>
        <div className="flex items-center">
          <img src={logo} className="max-w-[40px] self-start" />
          <h1 className="ml-2 text-sky-700 font-semibold">Imgress</h1>
          <h1 className="ml-24 text-gray-800 font-medium">About</h1>
          <h1 className="ml-24 text-gray-800 font-medium">Contact</h1>
        </div>
        <div className="mt-32 ml-24 max-w-[400px]">
          <h1 className="text-4xl font-medium">Sign up to</h1>
          <h1 className="text-5xl leading-tight font-semibold mt-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-500">
            Imgress
          </h1>
          <h1 className="mt-4 text-2xl font-normal ">
            Your one stop platform to create, manage and orchestrate your image
            search engine instances
          </h1>
        </div>
      </div>
      <img src={wallpaper} className="ml-8 max-w-[250px] self-end" />
      <div className="p-8 min-w-[500px] min-h-[300px] px-24">
        <form
          className="flex flex-col justify-center gap-6"
          onSubmit={(e) => register(e)}
        >
          <h1 className="text-gray-800 text-3xl font-semibold">Sign Up!</h1>
          <p className="text-gray-600 text-md font-medium">
            Start your journey of creating engines!
          </p>
          <div className="border bg-white shadow border-gray-300 p-2 flex items-center rounded-md">
            <MdEmail className="text-blue-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Enter your email"
              className="p-1 w-full text-sm outline-none"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div className="border bg-white shadow border-gray-300 p-2 flex items-center rounded-md">
            <MdPerson className="text-blue-500 mr-2" size={18} />
            <input
              type="text"
              placeholder="Enter your username"
              className="p-1 text-sm w-full outline-none"
              value={data.username}
              onChange={(e) => setData({ ...data, username: e.target.value })}
            />
          </div>
          <div className="border bg-white shadow border-gray-300 p-2 flex items-center rounded-md">
            <MdPassword className="text-blue-500 mr-2" size={18} />
            <input
              type="password"
              placeholder="Enter your password"
              className="p-1 text-sm w-full outline-none"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <div className="border bg-white shadow border-gray-300 p-2 flex items-center rounded-md">
            <MdPassword className="text-blue-500 mr-2" size={18} />
            <input
              type="password"
              placeholder="Confirm your password"
              className="p-1 text-sm w-full outline-none"
              // value={data.password}
              // onChange={(e) => setData({ ...data, password: e.target.value })}
            />
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white p-2 rounded-md text-sm"
          >
            Register
          </button>
          <Link to="/login" className="text-blue-600 mt-4 font-medium">
            Already have an account? Sign in
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
