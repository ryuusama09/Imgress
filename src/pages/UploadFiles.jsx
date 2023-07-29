import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { v4 } from "uuid";
import Loading from "./Loading";
import { LuPlay, LuRefreshCcw } from "react-icons/lu";
import { TbTrash } from "react-icons/tb";
import { RiFolderUploadLine } from "react-icons/ri";
import { AiFillLock, AiOutlineOrderedList } from "react-icons/ai";
import { MdRemoveCircleOutline } from "react-icons/md";
import { Tab } from "@headlessui/react";
import { useStore } from "../store";
import Modal from "react-modal";
import "react-toastify/dist/ReactToastify.css";
const Card = ({ image, container, setLoading, getImages }) => {
  // console.log(image, container)
  const [properties, setProperties] = useState([]);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [modalIsOpen2, setIsOpen2] = React.useState(false);
  const [getProper, setGetProper] = useState({});
  const [data, setData] = useState({});

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function openModal2() {
    setIsOpen2(true);
  }

  function closeModal2() {
    setIsOpen2(false);
  }

  const deleteImage = async () => {
    setLoading(true);
    let data = JSON.stringify({
      uniqueEngineID: container.engineID,
      imageId: [image.imageID],
    });
    // console.log(data);
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://lambda2.vercel.app/dev/deletetidbimg",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        let data = JSON.stringify({
          className: container.class,
          imageIds: [image.imageID],
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://lambda2.vercel.app/dev/deletes3img",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            console.log(JSON.stringify(response.data));
            getImages();
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const updateProperties = async () => {
    openModal();
    var data = JSON.stringify({
      imageID: image.imageID,
      className: container.class,
    });

    var config = {
      method: "post",
      url: "https://lambda3.vercel.app/dev/schema",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response));
        response.data.properties.map((p) => {
          console.log(p.name);
        });

        console.log(response.data.properties);
        setProperties(response.data.properties);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleInput = (inputEv, name) => {
    const value = inputEv.target.value;
    data[name] = value;
    setData(data);
  };
  const updateProperties2 = async () => {
    console.log(data);
    let newData = Object.keys(data)
      .filter((k) => data[k] != null)
      .reduce((a, k) => ({ ...a, [k]: data[k] }), {});
    console.log(newData);
    console.log(image);
    var data2 = JSON.stringify({
      imgId: image.imageID,
      className: image.className,
      engineID: image.engineId,
      properties: newData,
    });

    var config = {
      method: "post",
      url: "https://lambda3.vercel.app/dev/update",
      headers: {
        "Content-Type": "application/json",
      },
      data: data2,
    };

    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        closeModal();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const getProp = async () => {
    openModal2();
    var data = JSON.stringify({
      imageID: image.imageID,
      className: container.class,
    });

    var config = {
      method: "post",
      url: "https://lambda3.vercel.app/dev/properties",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data.properties);
        setGetProper(response.data.properties);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  return (
    <div key={image.id} className="block rounded-lg bg-white shadow-lg">
      <Modal
        isOpen={modalIsOpen2}
        onRequestClose={closeModal2}
        contentLabel="Example Modal"
        className="max-w-[400px] m-auto mt-32"
      >
        <div className="bg-gradient-to-r from-cyan-100 to-sky-200 shadow p-8">
          <h1 className="text-lg font-semibold">Properties</h1>
          {Object.keys(getProper).length !== 0 ? (
            Object.keys(getProper).map((k, i) => (
              <h1 className="mt-2">
                <span className="font-semibold">{k}</span> : {getProper[k]}
              </h1>
            ))
          ) : (
            <h1>No Properties</h1>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="max-w-[400px] m-auto mt-32"
      >
        <div className="bg-gradient-to-r from-cyan-100 to-sky-200 shadow p-8">
          <h1 className="text-lg font-semibold">Properties</h1>
          {properties?.map((p) => {
            if (
              p.name === "image" ||
              p.name === "engineID" ||
              p.name === "imageID"
            ) {
              return null;
            } else {
              return (
                <div className="flex justify-between w-full mt-2">
                  <h1>{p.name}</h1>
                  <input
                    className="ml-2 border border-gray-200 border-2"
                    type="text"
                    onChange={(e) => handleInput(e, p.name)}
                  />
                </div>
              );
            }
          })}
          <button
            onClick={() => updateProperties2()}
            className="self-center mt-2 inline-flex h-fit justify-center items-center gap-1 rounded-md mr-4 border border-transparent bg-sky-300 px-4 py-3 text-sm font-medium text-sky-900 hover:bg-sky-400"
          >
            <RiFolderUploadLine className="" />
            Update
          </button>
        </div>
      </Modal>
      <img
        className="rounded-t-lg w-full h-[200px] object-contain"
        src={image.image}
        alt=""
      />
      <div class="p-6 flex gap-2 flex-wrap">
        <button
          type="button"
          class="inline-flex flex-grow justify-center items-center gap-1 rounded-md border border-transparent bg-green-100 px-4 py-3 text-sm font-medium text-green-900 hover:bg-green-200 relative group"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={() => updateProperties()}
        >
          <RiFolderUploadLine />
          <div class="opacity-0 bg-gray-300 text-black text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full mb-1 px-3 pointer-events-none">
            Update
          </div>
        </button>
        <button
          type="button"
          class="inline-flex flex-grow justify-center items-center gap-1 rounded-md border border-transparent bg-sky-300 px-4 py-2 text-sm font-medium text-sky-900 hover:bg-sky-400 relative group"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={() => getProp()}
        >
          <AiOutlineOrderedList />
          <div class="opacity-0 bg-gray-300 text-black text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full mb-1 px-3 pointer-events-none">
            Properties
          </div>
        </button>
        <button
          type="button"
          class="inline-flex flex-grow justify-center items-center gap-1 rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 relative group"
          data-te-ripple-init
          data-te-ripple-color="light"
          onClick={() => deleteImage()}
        >
          <TbTrash />
          <div class="opacity-0 bg-gray-300 text-black text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full mb-1 px-3 pointer-events-none">
            Delete
          </div>
        </button>
      </div>
    </div>
  );
};
const UploadFiles = () => {
  const user = useStore((state) => state.user);
  const { engineId } = useParams();
  const [container, setContainer] = useState(null);
  const [deleteModal, setDeleteModal] = useState(false)
  const [access, setAccess] = useState(null);
  // const [schema, setSchema] = useState(null);
  const [folder, setFolder] = useState([]);
  const [logs, setLogs] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  useEffect(() => {
    if (user === null) {
      navigate("/login");
    }
  }, [user]);
  const [email, setEmail] = useState("");
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  // const getSchema = async (classname) => {
  //   let data = JSON.stringify({
  //     className: classname,
  //   });

  //   let config = {
  //     method: "post",
  //     maxBodyLength: Infinity,
  //     url: "https://lambda3.vercel.app/dev/schema",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     data: data,
  //   };

  //   axios
  //     .request(config)
  //     .then((response) => {
  //       setSchema(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };
  const takeAccess = async (email) => {
    let data = JSON.stringify({
      owner: container?.userID,
      engineID: engineId,
      email: email,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://lambda1.vercel.app/dev/takeaccess",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success("Access Taken", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        getAccessList(container);
        getLogs()
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getAccessList = async (container) => {
    let data = JSON.stringify({
      owner: container?.userID,
      engineID: engineId,
    });
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://lambda1.vercel.app/dev/getaccesslist",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setAccess(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getLogs = async () => {
    let data = JSON.stringify({
      engineID: engineId,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://lambda1.vercel.app/dev/getlogs",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        console.log(response.data);
        setLogs(response.data.reverse());
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const getImages = async () => {
    const data = { engineID: engineId };
    const response = await axios.post(
      "https://lambda1.vercel.app/dev/imglist",
      data
    );
    console.log(response.data);
    setImages(response.data);
    getLogs();
  };
  const deleteContainer = async () => {
    // console.log(selectedContainers);
    axios
      .all([
        axios.post("https://lambda1.vercel.app/dev/delete-instance", {
          engineID: [container.engineID],
        }),
        axios.post("https://lambda2.vercel.app/dev/deletetidbcont", {
          engineID: [container.engineID],
        }),
        axios.post("https://lambda2.vercel.app/dev/deletes3cont", {
          classname: [container.engineID],
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
          setDeleteModal(false);
          navigate("/");
        })
      );
  };
  const getContainer = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      engineID: engineId,
      userID: user?.UserID,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("https://lambda1.vercel.app/dev/get-engine", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const newData = JSON.parse(result);
        console.log(newData);
        setContainer(newData[0]);
        getImages();
        getAccessList(newData[0]);
        // getSchema(newData[0].class);
      })
      .catch((error) => console.log("error", error));
  };
  const uploadFiles = async () => {
    console.log(folder);
    var formData = new FormData();
    let ids = [];
    for (var i = 0; i < folder.length; i++) {
      console.log(folder[i]);
      ids.push(v4());
      formData.append("files", folder[i]);
    }
    for (var pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1].name);
    }
    formData.append("imageIds", ids);
    formData.append("engineId", engineId);
    formData.append("className", container.class);
    console.log(ids, engineId, container.class);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    await axios
      .post("https://lambda3.vercel.app/dev/upload", formData, config)
      .then(async (res) => {
        const response = await axios.post(
          "https://lambda2.vercel.app/dev/upload",
          formData,
          config
        );
        toast.success("Images Uploaded", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setFolder([]);
        getLogs();
        console.log(response);
      });

    getImages();
  };
  useEffect(() => {
    getContainer();
  }, [engineId]);
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col px-24 py-6 bg-gradient-to-r from-cyan-100 to-sky-300">
        <Loading />
      </div>
    );
  }
  const giveAccess = async () => {
    let data = JSON.stringify({
      owner: container.userID,
      email: email,
      engineID: engineId,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://lambda1.vercel.app/dev/giveaccess",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
        toast.success("Access Given", {
          position: "bottom-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        getAccessList(container);
        getLogs()
        setEmail("");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // function padTo2Digits(num) {
  //   return num.toString().padStart(2, "0");
  // }

  // function formatDate(date) {
  //   return (
  //     [
  //       date.getFullYear(),
  //       padTo2Digits(date.getMonth() + 1),
  //       padTo2Digits(date.getDate()),
  //     ].join("-") +
  //     " " +
  //     [
  //       padTo2Digits(date.getHours()),
  //       padTo2Digits(date.getMinutes()),
  //       padTo2Digits(date.getSeconds()),
  //     ].join(":")
  //   );
  // }
  return (
    <div className="min-h-screen px-24 py-6 bg-gradient-to-r from-cyan-100 to-sky-300">
      <ToastContainer />
      <MdArrowBack
        className="cursor-pointer"
        onClick={() => navigate("/")}
        size={28}
      />
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
                        deleteContainer();
                      }}
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-sky-100 px-4 py-2 text-sm font-medium text-sky-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                      onClick={() => {
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
      <Transition appear show={modalIsOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => closeModal()}>
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
                    Access List
                  </Dialog.Title>
                  <div className="flex flex-col gap-4">
                    <div className="mt-4">
                      {access?.map((item) => (
                        <div className="flex justify-between">
                          <h1>{item}</h1>
                          <button
                            // to={"/test/" + item.engineID}
                            className="rounded-full p-2 hover:bg-gray-200 group relative"
                            onClick={() => takeAccess(item)}
                          >
                            <MdRemoveCircleOutline className="" />
                            <div class="opacity-0 bg-gray-300 text-black text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/4 mb-1 px-3 pointer-events-none">
                              Revoke
                            </div>
                          </button>
                        </div>
                      ))}
                    </div>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="p-2 border-gray-300 border-2 rounded-lg"
                      placeholder="Enter Email"
                    />
                    <button
                      onClick={giveAccess}
                      className="inline-flex justify-center items-center gap-1 ml-2 rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200"
                    >
                      <AiFillLock />
                      Give Access
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <div className="mt-6">
        <h1 className="text-gray-600 text-3xl font-medium">
          {container?.name}
        </h1>
        <h1 className="text-gray-600 font-medium mb-4">{container?.apiURL}</h1>

        <div className="bg-white p-4 shadow-lg mt-4 rounded-xl flex justify-between items-center">
          <h1 className="text-black text-lg">Choose a folder to upload!</h1>
          <input
            type="file"
            webkitdirectory="true"
            onChange={(e) => {
              setFolder(e.target.files);
            }}
          />
          <button onClick={() => uploadFiles()} className="inline-flex h-fit justify-center items-center gap-1 rounded-md mr-4 border border-transparent bg-sky-300 px-4 py-3 text-sm font-medium text-sky-900 hover:bg-sky-400">
            <RiFolderUploadLine className="" />
            Upload
          </button>
        </div>
        <Tab.Group>
          <div className="flex justify-between items-center mt-6 mb-4">
            <Tab.List className="flex w-fit space-x-1 rounded-xl bg-blue-900/20 p-1 mr-4">
              <Tab
                key="Images"
                className={({ selected }) =>
                  `rounded-lg w-36 py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                    selected
                      ? "bg-white shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }`
                }
              >
                Images
              </Tab>
              <Tab
                key="Log"
                className={({ selected }) =>
                  `rounded-lg w-36 py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2 ${
                    selected
                      ? "bg-white shadow"
                      : "text-blue-100 hover:bg-white/[0.12] hover:text-white"
                  }`
                }
              >
                Log
              </Tab>
            </Tab.List>
            <div className="">
              <button
                onClick={() => {
                  navigate(`/test/${container.class}`);
                }}
                className="inline-flex h-fit justify-center items-center gap-1 rounded-md mr-4 border border-transparent bg-violet-300 px-4 py-3 text-sm font-medium text-violet-900 hover:bg-violet-400"
              >
                <LuPlay className="" />
                Test
              </button>
              {/* <button className="inline-flex h-fit justify-center items-center gap-1 rounded-md mr-4 border border-transparent bg-sky-300 px-4 py-3 text-sm font-medium text-sky-900 hover:bg-sky-400">
                <RiFolderUploadLine className="" />
                Upload
              </button> */}
              <button
                onClick={openModal}
                className="inline-flex h-fit justify-center items-center gap-1 mr-4 rounded-md border border-transparent bg-green-100 px-4 py-3 text-sm font-medium text-green-900 hover:bg-green-200"
              >
                <AiFillLock />
                Access
              </button>
              <button
                onClick={() => setDeleteModal(true)}
                className="inline-flex h-fit justify-center items-center gap-1 rounded-md border border-transparent bg-red-100 px-4 py-3 text-sm font-medium text-red-900 hover:bg-red-200"
              >
                <TbTrash className="" />
                Delete
              </button>
            </div>
          </div>
          <Tab.Panels className="mt-2">
            <Tab.Panel key="Images" className="rounded-xl bg-white py-6 px-12">
              <div className="">
                <h1 className="text-black text-2xl mb-4">Current Images</h1>
                <div className="grid grid-cols-4 gap-6">
                  {images?.map((image) => (
                    <Card
                      image={image}
                      container={container}
                      setLoading={setLoading}
                      getImages={getImages}
                    />
                  ))}
                </div>
                {images?.length === 0 && (
                  <h1 className="text-gray-500 text-xl mb-4">
                    No Images Uploaded
                  </h1>
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel key="Log" className="rounded-xl bg-white py-6 px-12">
              <div className="flex gap-4 mb-4">
                <h1 className="text-black text-2xl">Logs</h1>
                <button
                  // to={"/test/" + item.engineID}
                  className="rounded-full p-2 hover:bg-gray-200 group relative"
                  onClick={() => getLogs()}
                >
                  <LuRefreshCcw className="" />
                  <div class="opacity-0 bg-gray-300 text-black text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/4 mb-1 px-3 pointer-events-none">
                    Refresh
                  </div>
                </button>
              </div>
              <div className="bg-sky-100 px-4 py-3 rounded-xl">
                {logs?.map((log) => (
                  <div className="flex items-center gap-4 text-sm">
                    <h1 className="text-black font-mono">
                      {new Date(log.logtime)
                        .toISOString()
                        .replace("T", " ")
                        .substring(0, 19)}
                    </h1>
                    <h1 className="text-black font-mono">{log.entry}</h1>
                  </div>
                ))}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default UploadFiles;
