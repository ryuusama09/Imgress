import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import { useNavigate, useParams } from "react-router-dom";

import { MdArrowBack, MdDelete } from "react-icons/md";
import axios from "axios";
const Test = () => {
  const navigate = useNavigate();
  const name = useStore((state) => state?.containerName);
  const url = useStore((state) => state?.url);
  const [file, setFile] = useState();
  const [images, setImages] = useState(null);
  useEffect(() => {
    console.log(name);
    console.log(url);
  }, [name, url]);
  const { engineId } = useParams();
  const getImages = async () => {
    // const url = `http://localhost:3005/dev/fetch/${name + engineId}`;
    console.log(url);
    const formData = new FormData();
    formData.append("files", file);
    formData.append("limit", 2);
    var myHeaders = new Headers();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(url, formData, config);
    console.log(response.data);
    setImages(response.data.images);
  };
  return (
    <div className="p-8 min-w-screen min-h-screen bg-[#E6EEFF]">
      <MdArrowBack
        className="cursor-pointer"
        onClick={() => navigate(-1)}
        size={28}
      />
      <div className="mt-6">
        <h1 className="text-gray-600 text-2xl font-medium">{name}</h1>
        <div className="bg-white p-4 shadow-lg mt-4 rounded flex justify-between">
          <h1 className="text-black text-lg">Choose a file to upload!</h1>
          <input
            type="file"
            onChange={(e) => {
              setFile(e.target.files[0]);
            }}
          />
          <button
            className="bg-blue-500 p-2 text-white rounded-lg  "
            onClick={() => getImages()}
          >
            Upload
          </button>
        </div>
        <div className="mt-4">
          <h1 className="text-black text-lg">Resultant Images</h1>
          <div className="flex flex-wrap justify-center gap-4">
            {images?.map((image) => (
              <div className="mt-4 relative">
                <img src={image} width={200} height={200} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
