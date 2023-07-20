import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";

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
        console.log(result);
        Login(result.userID);
        navigate("/");
      })
      .catch((error) => console.log("error", error));
  };
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-gray-800 text-3xl font-semibold">Login</h1>
      <form className="flex flex-col gap-4" onSubmit={(e) => login(e)}>
        <input
          type="text"
          placeholder="Email"
          className="border border-gray-300 p-2 rounded-md"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 rounded-md"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Login
        </button>
      </form>
      <Link to="/register" className="text-blue-500">
        Register
      </Link>
    </div>
  );
};

export default Login;
