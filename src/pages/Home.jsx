import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { GoContainer } from "react-icons/go";

const Home = () => {
  const navigate = useNavigate();

  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const [folder, setFolder] = useState([]);

  const ref = useRef();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);

  useEffect(() => {
    if (ref.current === null) {
      ref.current.setAttribute("directory", true);
      ref.current.setAttribute("webkitdirectory", true);
    }
  }, [ref]);

  return (
    <div className="w-screen h-screen">
      {/* <h1>Hello</h1>
      <input
        type="file"
        webkitdirectory="true"
        ref={ref}
        onChange={(e) => {
          setFolder(e.target.files);
        }}
      />
      <ul id="listing"></ul> */}
      <div className="w-full flex justify-between items-center px-12 py-2 bg-gray-100">
        <h1>Hello</h1>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <div className="w-full flex justify-between items-center px-12 py-2 mt-4">
        <h1 className="text-2xl font-semibold">Containers</h1>
        <button className="bg-blue-500 text-white p-2 rounded-md">Add</button>
      </div>
      <div className="px-12 mt-4 flex flex-col gap-2">
        <div className="grid grid-cols-12 text-sm font-medium gap-2">
          <div className="col-span-1 flex items-center justify-center">
            <GoContainer />
          </div>
          <div className="col-span-3">Name</div>
          <div className="col-span-5">Url</div>
          <div className="col-span-1">Size</div>
          <div className="col-span-1">Upload</div>
          <div className="col-span-1">Delete</div>
        </div>
        <div className="grid grid-cols-12 text-sm gap-2">
          <div className="col-span-1 flex items-center justify-center">
            <GoContainer />
          </div>
          <div className="col-span-3">Name</div>
          <div className="col-span-5">Url</div>
          <div className="col-span-1">Size</div>
          <div className="col-span-1">Upload</div>
          <div className="col-span-1">Delete</div>
        </div>
      </div>
    </div>
  );
};

export default Home;
