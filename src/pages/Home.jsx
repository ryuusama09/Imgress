import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { GoContainer } from "react-icons/go";
import logo from "../assets/logo.png";
import Modal from "react-modal";
const Home = () => {
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);

  const [folder, setFolder] = useState([]);

  const ref = useRef();

  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);
  function closeModal() {
    setIsOpen(false);
  }
  function openModal() {
    setIsOpen(true);
  }
  useEffect(() => {
    if (ref.current === null) {
      ref.current.setAttribute("directory", true);
      ref.current.setAttribute("webkitdirectory", true);
    }
  }, [ref]);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  return (
    <div className="w-screen h-screen bg-[#E6EEFF]">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <form className="flex flex-col min-w-[300px] gap-4">
          <button
            onClick={closeModal}
            className="bg-red-500 text-white p-1 px-2 rounded-md text-sm self-end"
          >
            Close
          </button>
          <p className="text-gray-600 text-lg font-medium self-center">
            Enter container details!
          </p>
          <input
            type="text"
            placeholder="Enter container name"
            className="border border-gray-300 p-2  rounded-md text-sm w-full outline-none"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 rounded-md text-sm w-fit self-center px-6"
          >
            Submit
          </button>
        </form>
      </Modal>
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
      <div className="w-full flex justify-between items-center px-8 py-2 pt-6">
        <div className="flex">
          <img src={logo} className="max-w-[40px] mr-3" />
          <h1 className="text-3xl font-medium">Dashboard</h1>
        </div>
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <div className="m-6 pb-6 shadow rounded pt-2 bg-white">
        <div className="w-full flex justify-between items-center px-8 py-2 mt-4">
          <h1 className="text-2xl font-normal">Containers</h1>
          <button
            onClick={openModal}
            className="bg-blue-500 text-sm text-white p-1 px-2 rounded-md"
          >
            Add
          </button>
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
    </div>
  );
};

export default Home;
