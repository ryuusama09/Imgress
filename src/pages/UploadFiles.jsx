import React, { useState } from "react";
import { MdArrowBack, MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const imageData = [
  {
    id: "2323",
    imageUrl:
      "https://contents.mediadecathlon.com/p2326305/b1c775bac058ef51e46a3978153bb972/p2326305.jpg",
  },
  {
    id: "2324",
    imageUrl:
      "https://contents.mediadecathlon.com/p2326305/b1c775bac058ef51e46a3978153bb972/p2326305.jpg",
  },
  {
    id: "2325",
    imageUrl:
      "https://contents.mediadecathlon.com/p2326305/b1c775bac058ef51e46a3978153bb972/p2326305.jpg",
  },
  {
    id: "2326",
    imageUrl:
      "https://contents.mediadecathlon.com/p2326305/b1c775bac058ef51e46a3978153bb972/p2326305.jpg",
  },
  {
    id: "2327",
    imageUrl:
      "https://contents.mediadecathlon.com/p2326305/b1c775bac058ef51e46a3978153bb972/p2326305.jpg",
  },
  {
    id: "2328",
    imageUrl:
      "https://contents.mediadecathlon.com/p2326305/b1c775bac058ef51e46a3978153bb972/p2326305.jpg",
  },
  {
    id: "2328",
    imageUrl:
      "https://contents.mediadecathlon.com/p2326305/b1c775bac058ef51e46a3978153bb972/p2326305.jpg",
  },
];
const UploadFiles = () => {
  const [folder, setFolder] = useState([]);
  const navigate = useNavigate();
  const uploadFiles = async () => {
    console.log(folder);
    var formData = new FormData();
    for (var i = 0; i < folder.length; i++) {
      console.log(folder[i]);
      formData.append(`files`, folder[i]);
    }
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    const response = await axios.post(
      "http://localhost:3004/dev/upload-images",
      formData,
      config
    );
    console.log(response);
  };
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
            {imageData.map((image) => (
              <div className="mt-4 relative" key={image.id}>
                <img src={image.imageUrl} width={200} height={200} />
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
