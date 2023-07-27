import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdDelete } from "react-icons/md";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
const Test = () => {
  const navigate = useNavigate();
  const name = useStore((state) => state?.containerName);
  const url = useStore((state) => state?.url);
  const [file, setFile] = useState();
  const [images, setImages] = useState(null);
  const [limit, setLimit] = useState();
  const [load, setLoad] = useState(false);
  useEffect(() => {
    console.log(name);
    console.log(url);
  }, [name, url]);

  const getImages = async () => {
    setLoad(true);
    console.log(url);
    const formData = new FormData();
    formData.append("files", file);
    formData.append("limit", limit);
    var myHeaders = new Headers();
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(url, formData, config);
    console.log(response.data);
    setImages(response.data.images);
    setLoad(false);
  };
  return (
    <div className="p-8 min-w-screen min-h-screen bg-[#E6EEFF] relative">
      <MdArrowBack
        className="cursor-pointer"
        onClick={() => navigate(-1)}
        size={28}
      />
      <div className="absolute top-1/2 left-1/2">
        <ColorRing
          visible={load}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={["#3BA4FC", "#3BA4FC", "#3BA4FC", "#3BA4FC", "#3BA4FC"]}
        />
      </div>
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
          <input
            type="number"
            placeholder="Enter Limit"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="border border-gray-300 border-2 rounded pl-2"
          />
          <button
            className="bg-blue-500 p-2 text-white rounded-lg  "
            onClick={() => getImages()}
          >
            Upload
          </button>
        </div>
        <div className="mt-6">
          <h1 className="text-black text-lg font-bold">Resultant Images</h1>
          <div className="flex flex-wrap gap-4">
            {images?.map((image) => (
              <div className="mt-4 relative bg-white max-w-[200px]">
                <img
                  src={image}
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <div className="flex mt-4 p-2">
                  <h1>
                    <span className="font-semibold">Description:</span> This is
                    a beautiful flower
                  </h1>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Test;
