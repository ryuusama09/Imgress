import React, { useEffect, useState } from "react";
import { useStore } from "../store";
import { useNavigate, useParams } from "react-router-dom";
import { MdArrowBack, MdDelete } from "react-icons/md";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
const Test = () => {
  const { classname } = useParams();
  const navigate = useNavigate();
  const name = useStore((state) => state.containerName);
  const url = useStore((state) => state.url);
  const [file, setFile] = useState();
  const [schema, setSchema] = useState(null);
  const [images, setImages] = useState(null);
  const [limit, setLimit] = useState(1);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    console.log(name);
    console.log(url);
  }, [name, url]);
  useEffect(() => {
    getSchema();
  }, [classname]);
  const getImages = async () => {
    setImages(null)
    setLoad(true);
    console.log(url);
    const formData = new FormData();
    formData.append("files", file);
    formData.append("limit", limit);
    formData.append("schema", JSON.stringify(schema));
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
  const getSchema = async () => {
    let data = JSON.stringify({
      className: classname,
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://lambda3.vercel.app/dev/schema",
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios
      .request(config)
      .then((response) => {
        setSchema(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="px-24 py-6 min-w-screen min-h-screen bg-gradient-to-r from-cyan-100 to-sky-300 relative">
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
          colors={["#052d4e", "#052d4e", "#052d4e", "#052d4e", "#052d4e"]}
        />
      </div>
      <div className="mt-6">
        <h1 className="text-gray-800 text-3xl font-semibold">{name}</h1>
        <h1 className="text-gray-600 text-2xl font-medium">Test your engine</h1>
        <div className="bg-white py-4 px-8 shadow-lg mt-4 rounded-xl flex justify-between items-center">
          <div className="">
            <h1 className="text-black text-lg mb-2">
              Choose a file to upload!
            </h1>
            <input
              type="file"
              onChange={(e) => {
                setFile(e.target.files[0]);
              }}
            />
          </div>
          <div className="">
            <h1 className="text-black text-lg mb-2">Result limit</h1>
            <input
              type="number"
              placeholder="Enter Limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="border-gray-300 border-2 rounded pl-2 py-1"
            />
          </div>
          <button
            className="bg-blue-500 p-2 text-white rounded-lg h-fit"
            onClick={() => getImages()}
          >
            Search
          </button>
        </div>
        <div className="mt-6">
          {images && (
            <div className="rounded-xl bg-white p-8 mt-6">
              <h1 className="text-gray-600 text-2xl font-medium text-center mb-4">
                Results
              </h1>
              <div className="grid grid-cols-2 gap-12 ">
                {images?.map((image, index) => (
                  <div className="relative flex bg-white rounded-lg break-words shadow">
                    <div className="absolute flex items-center justify-center bg-sky-100 w-8 h-8 -top-3 -left-3 rounded-full shadow text-xl">
                      <h1>{index + 1}</h1>
                    </div>
                    <img
                      src={image.url}
                      width={250}
                      height={250}
                      className="w-1/2 h-[200px] object-contain bg-sky-100"
                    />
                    <div className="flex flex-col gap-1 px-6 py-4">
                      {Object.keys(image.properties).map((prop) => (
                        <h1 className="">
                          <span className="font-semibold">{prop}:</span>{" "}
                          {image.properties[prop]}
                        </h1>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test;
