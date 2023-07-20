import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-6">
      <h1 className="text-gray-800 text-3xl font-semibold">Register</h1>
      <form className="flex flex-col gap-4" onSubmit={(e) => register(e)}>
        <input
          type="text"
          placeholder="Email"
          className="border border-gray-300 p-2 rounded-md"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Username"
          className="border border-gray-300 p-2 rounded-md"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-2 rounded-md"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
          Register
        </button>
      </form>
      <Link to="/login" className="text-blue-500">
        Login
      </Link>
    </div>
  );
};

export default Register;
