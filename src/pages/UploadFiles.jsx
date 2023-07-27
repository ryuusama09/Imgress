import React, { useEffect, useState } from "react";
import { MdArrowBack, MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { v4 } from "uuid";
import Loading from "./Loading";
import { LuPlay } from "react-icons/lu";
import { TbTrash } from "react-icons/tb";
import { RiFolderUploadLine } from "react-icons/ri";
import { AiFillLock } from "react-icons/ai";
import { Tab } from "@headlessui/react";
import Modal from "react-modal";
const Card = ({ image }) => {
  return (
    <div
      key={image.id}
      className="block rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
    >
      <a href="#!">
        <img
          className="rounded-t-lg min-w-[300px] max-w-[400px] max-h-[400px]"
          src={image.image}
          alt=""
        />
      </a>
      <div class="p-6">
        <h5 class="mb-2 text-xl font-medium leading-tight text-neutral-800">
          Card title
        </h5>
        <p class="mb-4 text-base text-neutral-600 ">
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </p>
        <button
          type="button"
          class="inline-flex justify-center items-center gap-1 rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200"
          data-te-ripple-init
          data-te-ripple-color="light"
        >
          Button
        </button>
      </div>
    </div>
  );
};
const UploadFiles = () => {
  const { engineId } = useParams();
  const [container, setContainer] = useState(null);
  const [folder, setFolder] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const [email, setEmail] = useState("");
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  const getImages = async () => {
    const data = { engineID: engineId };
    const response = await axios.post(
      "http://localhost:3003/dev/imglist",
      data
    );
    console.log(response.data);
    setImages(response.data);
    setLoading(false);
  };
  const getContainer = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var raw = JSON.stringify({
      engineID: engineId,
    });
    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };
    fetch("http://localhost:3003/dev/get-engine", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        const newData = JSON.parse(result);
        console.log(newData);
        setContainer(newData[0]);
        getImages();
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
    // formData.append("imageIds", ids);
    formData.append("engineId", engineId);
    formData.append("className", container.class);
    console.log(ids, engineId, container.class);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    await axios
      .post("http://localhost:3005/dev/upload", formData, config)
      .then(async (res) => {
        formData.append("imageIds", res.data.ids);
        const response = await axios.post(
          "http://localhost:3004/dev/upload",
          formData,
          config
        );
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
      url: "http://localhost:3003/dev/giveaccess",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };
    axios
      .request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="min-h-screen px-24 py-6 bg-gradient-to-r from-cyan-100 to-sky-300">
      <MdArrowBack
        className="cursor-pointer"
        onClick={() => navigate(-1)}
        size={28}
      />
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Example Modal"
        className="bg-white p-6  w-[400px] shadow-lg min-h-[200px] m-auto flex flex-col justify-between mt-32"
      >
        <div className="flex flex-col gap-4">
          <h1 className="text-lg font-medium">Give Access</h1>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 border-gray-300 border-2 rounded-lg"
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
      </Modal>

      <div className="mt-6">
        <h1 className="text-gray-600 text-3xl font-medium">
          {container?.name}
        </h1>
        <h1 className="text-gray-600 font-medium mb-4">{container?.apiURL}</h1>
        <button className="inline-flex justify-center items-center gap-1 rounded-md mr-2 border border-transparent bg-sky-300 px-4 py-2 text-sm font-medium text-sky-900 hover:bg-sky-400">
          <LuPlay className="" />
          Test
        </button>
        <button className="inline-flex justify-center items-center gap-1 rounded-md mr-2 border border-transparent bg-sky-300 px-4 py-2 text-sm font-medium text-sky-900 hover:bg-sky-400">
          <RiFolderUploadLine className="" />
          Upload
        </button>
        <button className="inline-flex justify-center items-center gap-1 rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200">
          <TbTrash className="" />
          Delete
        </button>
        <button
          onClick={openModal}
          className="inline-flex justify-center items-center gap-1 ml-2 rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200"
        >
          <AiFillLock />
          Access
        </button>

        <div className="bg-white p-4 shadow-lg mt-4 rounded flex justify-between">
          <h1 className="text-black text-lg">Choose a folder to upload!</h1>
          <input
            type="file"
            webkitdirectory="true"
            onChange={(e) => {
              setFolder(e.target.files);
            }}
          />
          <button
            className="bg-blue-500 p-2 text-white rounded-lg  "
            onClick={() => uploadFiles()}
          >
            Upload
          </button>
        </div>
        <Tab.Group>
          <Tab.List className="flex w-fit space-x-1 rounded-xl bg-blue-900/20 p-1 mt-8">
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
          <Tab.Panels className="mt-2">
            <Tab.Panel key="Images" className="rounded-xl bg-white p-3">
              <div className="mt-4">
                <h1 className="text-black text-lg">Current Images</h1>
                <div className="grid grid-cols-3 gap-4">
                  {images?.map((image) => (
                    <Card image={image} />
                  ))}
                </div>
              </div>
            </Tab.Panel>
            <Tab.Panel key="Log" className="rounded-xl bg-white p-3">
              Log
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </div>
  );
};

export default UploadFiles;
