import React, { useEffect, useState } from "react";
import { MdArrowBack, MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { v4 } from "uuid";

const UploadFiles = () => {
  const { engineId } = useParams();
  const [container, setContainer] = useState(null);
  const [folder, setFolder] = useState([]);
  const [images, setImages] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    getImages();
  }, []);

  const getImages = async () => {
    const data = { engineID: engineId };
    const response = await axios.post(
      "http://localhost:3003/dev/imglist",
      data
    );
    console.log(response.data);
    setImages(response.data);
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
        setContainer(newData);
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
    formData.append("className", container[0].class);
    console.log(ids, engineId, container[0].class);

    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(
      "http://localhost:3004/dev/upload",
      formData,
      config
    );
    console.log(response);

    const response2 = await axios.post(
      "http://localhost:3005/dev/upload",
      formData,
      config
    );
    console.log(response2);
    getImages();
  };
  useEffect(() => {
    getContainer();
  }, [engineId]);

  return (
    <div className="p-8 min-w-screen min-h-screen bg-[#E6EEFF]">
      <MdArrowBack
        className="cursor-pointer"
        onClick={() => navigate(-1)}
        size={28}
      />
      <div className="mt-6">
        <h1 className="text-gray-600 text-2xl font-medium">Container 1</h1>
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
        <div className="mt-4">
          <h1 className="text-black text-lg">Current Images</h1>
          <div className="flex flex-wrap justify-center gap-4">
            {images?.map((image) => (
              <div className="mt-4 relative" key={image.id}>
                <img src={image.image} width={200} height={200} />
                <div className="absolute top-2 right-2 bg-red-500 p-1 rounded-full cursor-pointer">
                  <MdDelete color="white" size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
