import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../store";
import { Dialog, Listbox, Menu, Transition } from "@headlessui/react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GoContainer, GoCopy } from "react-icons/go";
import { IoAddCircleOutline, IoTrashBin } from "react-icons/io5";
import { HiChevronUpDown, HiCheck } from "react-icons/hi2";
import { HiDotsVertical, HiOutlineDocumentDuplicate } from "react-icons/hi";
import { RiFolderUploadLine } from "react-icons/ri";
import { LuFolderEdit } from "react-icons/lu";
import logo from "../assets/logo.png";

const AddContainer = ({ isOpen, setIsOpen }) => {
  const user = useStore((state) => state.user);
  const [data, setData] = useState({
    name: "",
    properties: [],
  });
  const [property, setProperty] = useState({
    name: "",
    dataType: "String",
  });
  const closeModal = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    let schema = data;
    var raw = JSON.stringify({
      userId: user.UserID,
      name: schema.name,
      schema: schema.properties.map((item) => {
        const arr = [];
        arr.push(item.dataType);
        item.dataType = arr;
        return item;
      }),
    });
    console.log(raw);
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("http://localhost:3003/dev/create-instance", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
    setData({
      name: "",
      properties: [],
    });
    setProperty({
      name: "",
      dataType: "String",
    });
    setIsOpen(false);
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Add Container
                </Dialog.Title>
                <div className="mt-2">
                  <h1>Container Name</h1>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md p-2 mt-2"
                    placeholder="Container Name"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                  <h1 className="my-2">Engine Properties</h1>
                  <div className="grid grid-cols-12 gap-x-1 gap-y-3">
                    <h1 className="col-span-5">Name</h1>
                    <h1 className="col-span-5">Type</h1>
                    <h1 className="col-span-2">Action</h1>
                    {data.properties?.map((item, index) => (
                      <>
                        <h1 key={index + item.name} className="col-span-5">
                          {item.name}
                        </h1>
                        <h1 key={index + item.dataType} className="col-span-5">
                          {item.dataType}
                        </h1>
                        <IoTrashBin
                          key={index}
                          className="col-span-2 text-2xl text-red-700 mx-auto my-auto"
                          onClick={() => {
                            const newData = data.properties.filter(
                              (item, i) => i !== index
                            );
                            setData({ ...data, properties: newData });
                          }}
                        />
                      </>
                    ))}
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full border border-gray-300 rounded-md p-2 col-span-5"
                      value={property.name}
                      onChange={(e) =>
                        setProperty({
                          ...property,
                          name: e.target.value,
                        })
                      }
                    />
                    <Listbox
                      value={property.dataType}
                      onChange={(e) => {
                        setProperty({
                          ...property,
                          dataType: e,
                        });
                      }}
                      className="col-span-5"
                    >
                      <div className="relative">
                        <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300">
                          <span className="block truncate">
                            {property.dataType}
                          </span>
                          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                            <HiChevronUpDown
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </span>
                        </Listbox.Button>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {["String", "Integer"].map((person, personIdx) => (
                              <Listbox.Option
                                key={personIdx}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active
                                      ? "bg-amber-100 text-amber-900"
                                      : "text-gray-900"
                                  }`
                                }
                                value={person}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {person}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600">
                                        <HiCheck
                                          className="h-5 w-5"
                                          aria-hidden="true"
                                        />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </Listbox>
                    <IoAddCircleOutline
                      className="col-span-2 text-2xl text-blue-700 mx-auto my-auto"
                      onClick={() => {
                        setData({
                          ...data,
                          properties: [...data.properties, property],
                        });
                        setProperty({
                          name: "",
                          dataType: "String",
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Submit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

const Home = () => {
  const links = [
    { href: "/account-settings", label: "Settings" },
    { href: "/support", label: "Support" },
    { href: "/license", label: "License" },
    { href: "/sign-out", label: "Sign out" },
  ];
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [containers, setContainers] = useState(null);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const getContainers = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      userID: user?.UserID,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("http://localhost:3003/dev/guireturn", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        setContainers(JSON.parse(result));
      })
      .catch((error) => console.log("error", error));
  }
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);
  useEffect(() => {
    getContainers();
  }, [modalIsOpen]);
  return (
    <div className="w-screen h-screen bg-[#E6EEFF]">
      <AddContainer isOpen={modalIsOpen} setIsOpen={setIsOpen} />
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
        <div className="w-full flex justify-between items-center px-8 py-2 mt-2">
          <h1 className="text-2xl font-normal">Containers</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="bg-blue-500 text-sm text-white p-1 px-2 rounded-md"
          >
            Add
          </button>
        </div>
        <div className="px-12 mt-4 flex flex-col gap-2">
          <div className="grid grid-cols-12 font-medium gap-2">
            <div className="col-span-1 flex items-center justify-center text-xl">
              <GoContainer />
            </div>
            <div className="col-span-2">Name</div>
            <div className="col-span-7">Url</div>
            <div className="col-span-1">Upload</div>
            <div className="col-span-1"></div>
          </div>
          {containers?.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-12 items-center text-sm gap-2"
            >
              <div className="col-span-1 flex items-center justify-center text-xl">
                <GoContainer />
              </div>
              <div className="col-span-2">{item.name}</div>
              <div className="col-span-7 flex justify-between items-center">
                <h1 className="">{item.apiURL}</h1>
                <CopyToClipboard
                  className="text-2xl cursor-pointer"
                  text={item.apiURL}
                >
                  <GoCopy />
                </CopyToClipboard>
              </div>
              <Link
                to={"/upload-files/" + item.engineID}
                className="col-span-1 mx-auto"
              >
                <RiFolderUploadLine className="text-2xl" />
              </Link>
              <div className="col-span-1">
                <Menu
                  as="div"
                  className="w-full relative inline-block text-left"
                >
                  <div className="flex justify-end">
                    <Menu.Button className="rounded-full p-2 text-sm font-medium text-white hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      <HiDotsVertical
                        className="h-5 w-5 text-gray-800"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-36 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <LuFolderEdit className="mr-2" />
                              Edit
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-blue-500 text-white"
                                  : "text-gray-900"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <HiOutlineDocumentDuplicate className="mr-2" />
                              Duplicate
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                      <div className="px-1 py-1">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active
                                  ? "bg-red-500 text-white"
                                  : "text-red-700"
                              } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                            >
                              <IoTrashBin className="mr-2" />
                              Delete
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
