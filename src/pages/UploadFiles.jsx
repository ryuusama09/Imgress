import React, { useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
        <input
          type="file"
          webkitdirectory="true"
          onChange={(e) => {
            setFolder(e.target.files);
          }}
        />
        <button onClick={() => uploadFiles()}>Upload</button>
      </div>
    </div>
  );
};

export default UploadFiles;
