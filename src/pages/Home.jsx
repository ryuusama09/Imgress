import React, { Fragment, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStore } from "../store";
import { Dialog, Listbox, Transition } from "@headlessui/react";
import { ToastContainer, toast } from "react-toastify";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { GoCopy } from "react-icons/go";
import { IoAddCircleOutline, IoTrashBin } from "react-icons/io5";
import { HiChevronUpDown, HiCheck } from "react-icons/hi2";
import { RiFolderUploadLine } from "react-icons/ri";
import { TbTrash } from "react-icons/tb";
import { LuPlay } from "react-icons/lu";
import { BsStack } from "react-icons/bs";
import logo from "../assets/logo.png";
import axios from "axios";
import Loading from "./Loading";
import "react-toastify/dist/ReactToastify.css";

const AddContainer = ({ isOpen, setIsOpen, getContainers, setLoading }) => {
  const user = useStore((state) => state.user);
  const [data, setData] = useState({
    name: "",
    properties: [],
  });
  const [property, setProperty] = useState({
    name: "",
    dataType: "text",
  });
  const create = async () => {
    setLoading(true);
    setIsOpen(false);
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

    fetch("https://lambda1.vercel.app/dev/create-instance", requestOptions)
      .then((response) => response.text())
      .then(async (result) => {
        toast.success("Container created", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log(result);

        const res = await axios.post("https://lambda3.vercel.app/dev/create", {
          name: JSON.parse(result).className,
          schema: data.properties,
        });
        console.log(res);
        getContainers();
      })
      .catch((error) => {
        console.log("error", error);
        toast.error("Error Creating Container");
      });

    setData({
      name: "",
      properties: [],
    });
    setProperty({
      name: "",
      dataType: "text",
    });
    setIsOpen(false);
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        onClose={() => setIsOpen(false)}
      >
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
              <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                            {["text", "int", "number", "boolean", "date"].map(
                              (person, personIdx) => (
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
                                          selected
                                            ? "font-medium"
                                            : "font-normal"
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
                              )
                            )}
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
                          dataType: "text",
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={() => create()}
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
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [containers, setContainers] = useState(null);
  const [select, setSelect] = useState(false);
  const [selectedContainers, setSelectedContainers] = useState([]);
  const SetContainerName = useStore((state) => state.setContainerName);
  const SetUrl = useStore((state) => state.setUrl);
  const user = useStore((state) => state.user);
  const logout = useStore((state) => state.logout);
  const getContainers = () => {
    setLoading(true);
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
    fetch("https://lambda1.vercel.app/dev/guireturn", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(result);
        const newData = JSON.parse(result).map((item) => {
          return {
            ...item,
            selected: false,
          };
        });
        console.log(newData);
        setContainers(newData);
        setLoading(false);
      })
      .catch((error) => console.log("error", error));
  };
  // const deleteContainer = async (id) => {
  //   let arr = [...id]
  //   console.log(arr)
  //   axios
  //     .all([
  //       axios.post("https://lambda1.vercel.app/dev/delete-instance", {
  //         engineID: arr,
  //       }),
  //     ])
  //     .then(axios.spread((data) => {}));
  // };
  const deleteSelectedContainer = async () => {
    console.log(selectedContainers);
    axios
      .all([
        axios.post("https://lambda1.vercel.app/dev/delete-instance", {
          engineID: selectedContainers,
        }),
        axios.post("https://lambda2.vercel.app/dev/deletetidbcont", {
          engineID: selectedContainers,
        }),
        axios.post("https://lambda2.vercel.app/dev/deletes3cont", {
          classname: selectedContainers,
        }),
      ])
      .then(
        axios.spread((...res) => {
          console.log(res);
          toast.success("Container Deleted", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          getContainers();
          setSelectedContainers([]);
          selectAll(false);
          setDeleteModal(false);
        })
      );
  };
  const selectContainer = (id) => {
    const newData = containers?.map((item) => {
      if (item.engineID === id) {
        if (item.selected) {
          setSelectedContainers(
            selectedContainers.filter((item) => item !== id)
          );
        } else {
          setSelectedContainers([...selectedContainers, id]);
        }
        return {
          ...item,
          selected: !item.selected,
        };
      } else {
        return item;
      }
    });
    setContainers(newData);
  };
  const selectAll = (data) => {
    if (!data) {
      setSelectedContainers([]);
    } else {
      setSelectedContainers(containers?.map((item) => item.engineID));
    }
    const newData = containers?.map((item) => {
      return {
        ...item,
        selected: data,
      };
    });
    setContainers(newData);
  };
  useEffect(() => {
    getContainers();
  }, []);
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);
  useEffect(() => {
    selectAll(select);
  }, [select]);
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col px-24 py-6 bg-gradient-to-r from-cyan-100 to-sky-300">
        <Loading />
      </div>
    );
  }
  return (
    <div className="min-h-screen px-24 py-6 bg-gradient-to-r from-cyan-100 to-sky-300">
      <ToastContainer />
      <AddContainer
        isOpen={modalIsOpen}
        setIsOpen={setIsOpen}
        getContainers={getContainers}
        setLoading={setLoading}
      />
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
      <Transition appear show={deleteModal} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setDeleteModal(false)}
        >
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
                    Delete Container
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this container?
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md mr-2 border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        deleteSelectedContainer();
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setSelectedContainers([]);
                        selectAll(false);
                        setDeleteModal(false);
                      }}
                    >
                      Nope
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <div className="w-full flex justify-between items-center">
        <div className="flex">
          <img src={logo} className="w-28 mr-3" />
        </div>
        <button
          className="bg-sky-500 text-white p-2 rounded-md"
          onClick={() => logout()}
        >
          Logout
        </button>
      </div>
      <div className="shadow-xl rounded-xl bg-gray-50 my-6 py-6 px-8">
        <div className="w-full flex justify-between items-center mt-2">
          <h1 className="text-3xl font-semibold">Containers</h1>
          <div className="flex gap-2">
            {selectedContainers.length ? (
              <button
                onClick={() => setDeleteModal(true)}
                className="inline-flex justify-center rounded-md mr-2 bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200"
              >
                Delete Selected
              </button>
            ) : null}
            <button
              onClick={() => setIsOpen(true)}
              className="bg-sky-500 text-sm font-medium text-white px-4 py-2 rounded-md"
            >
              Add
            </button>
          </div>
        </div>
        <div className=" mt-6 flex flex-col gap-2 col">
          <div className="grid grid-cols-12 font-medium gap-2 py-2 text-xl">
            <div className="w-full col-span-1 flex items-center border-r-2 border-gray-300">
              <input
                type="checkbox"
                className="w-5 h-5 mx-auto accent-sky-300"
                checked={select}
                onChange={() => setSelect(!select)}
              />
            </div>
            <BsStack className="col-span-1 mx-auto" />
            <div className="col-span-2">Name</div>
            <div className="col-span-6">Url</div>
            <div className="col-span-2 mx-auto">Actions</div>
          </div>
          {containers?.map((item, index) => (
            <div
              key={index}
              className={`grid grid-cols-12 items-center gap-2 py-2 rounded-md ${
                item.selected && "bg-sky-100"
              }`}
            >
              <div className="w-full col-span-1 py-1 flex items-center border-r-2 border-gray-300">
                <input
                  type="checkbox"
                  className="w-5 h-5 mx-auto accent-sky-300"
                  checked={item.selected}
                  onChange={() => selectContainer(item.engineID)}
                />
              </div>
              <BsStack className="col-span-1 mx-auto text-xl" />
              <div className="col-span-2">{item.name}</div>
              <div className="col-span-6 text-2xl flex">
                <h1 className="truncate text-base flex-grow">{item.apiURL}</h1>
                <CopyToClipboard
                  className="shrink-0 cursor-pointer"
                  text={item.apiURL}
                  onCopy={() => {
                    toast.success("Copied to clipboard", {
                      position: "bottom-right",
                      autoClose: 5000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                      theme: "light",
                    });
                  }}
                >
                  <GoCopy className="" />
                </CopyToClipboard>
              </div>
              <div className="col-span-2 text-2xl flex justify-evenly">
                <button
                  // to={"/test/" + item.engineID}
                  className="rounded-full p-2 hover:bg-gray-200 group relative"
                  onClick={() => {
                    console.log(item);
                    SetContainerName(item.name);
                    SetUrl(item.apiURL);
                    navigate(`/test/${item.class}`);
                  }}
                >
                  <LuPlay className="" />
                  <div class="opacity-0 bg-gray-300 text-black text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/4 mb-1 px-3 pointer-events-none">
                    Test
                  </div>
                </button>
                <Link
                  to={"/upload-files/" + item.engineID}
                  className="rounded-full p-2 hover:bg-gray-200 group relative"
                >
                  <RiFolderUploadLine className="" />
                  <div class="opacity-0 bg-gray-300 text-black text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/4 mb-1 px-3 pointer-events-none">
                    Manage
                  </div>
                </Link>
                <div
                  onClick={() => {
                    setSelectedContainers([item.engineID]);

                    setDeleteModal(true);
                  }}
                  className="rounded-full p-2 hover:bg-gray-200 group relative"
                >
                  <TbTrash className="cursor-pointer" />
                  <div class="opacity-0 bg-gray-300 text-black text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/4 mb-1 px-3 pointer-events-none">
                    Delete
                  </div>
                </div>
                {/* <Menu
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
                                  ? "bg-sky-500 text-white"
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
                                  ? "bg-sky-500 text-white"
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
                              onClick={() => {
                                setSelectedContainers([item.engineID]);
                                setDeleteModal(true);
                              }}
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
                </Menu> */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
