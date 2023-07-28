import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../store";
import { ToastContainer, toast } from "react-toastify";
import { MdEmail, MdPassword } from "react-icons/md";
import logo from "../assets/logo.png";
import wallpaper from "../assets/wallpaper2.png";
import { SiCreatereactapp, SiVercel } from "react-icons/si";
import { BsCloudyFill } from "react-icons/bs";
import { AiOutlineFileAdd } from "react-icons/ai";
import { TbHierarchy, TbDatabaseSearch } from "react-icons/tb";
import { SiVitest, SiCoronaengine } from "react-icons/si";
import "react-toastify/dist/ReactToastify.css";
const Login = () => {
  const ref = useRef(null);
  const contactRef = useRef(null);
  const navigate = useNavigate();
  const Login = useStore((state) => state.login);
  const [logging, setLogging] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const login = async (e) => {
    e.preventDefault();
    if (data.email === "" || data.password === "") {
      toast.error("Please fill all the fields");
      return;
    } else {
      setLogging(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(data);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch("https://lambda1.vercel.app/dev/login", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          const data = JSON.parse(result);
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data.result[0]));
          Login(data.result[0]);
          setLogging(false);
          navigate("/");
        })
        .catch((error) => {
          toast.error("Invalid Credentials");
          setLogging(false);
          console.log("error", error);
        });
    }
  };
  const descData = [
    {
      id: 5,
      name: "Image Search Engine",
      desc: "You can create your custom reverse image search engine: you upload photos, we provide you with the API link",
      Icon: () => <SiCoronaengine size={65} color="blue" />,
    },
    {
      id: 1,
      name: "Create Container",
      desc: "We can create a container where you can upload images inside the container!",
      Icon: () => <SiCreatereactapp size={70} color="blue" />,
    },
    {
      id: 2,
      name: "Add Properties",
      desc: "You can give properties to different images you uploaded on your container",
      Icon: () => <AiOutlineFileAdd size={70} color="blue" />,
    },
    {
      id: 3,
      name: "Share Containers",
      desc: "You can grant and revoke access to different users for a container",
      Icon: () => <TbHierarchy size={70} color="blue" />,
    },
    {
      id: 4,
      name: "Test API",
      desc: "You get a specified page for testing your reverse-search-engine api before you deploy it to your codebase",
      Icon: () => <SiVitest size={70} color="blue" />,
    },
    {
      id: 5,
      name: "Go Serverless",
      desc: "Powered by Vercel, we provide you with a serverless experience for reduced latency and increased scalability",
      Icon: () => <SiVercel size={70} color="blue" />,
    },
    {
      id: 6,
      name: "Cloud Storage",
      desc: "Inbuilt cloud storage for your images to maximize data redundancy and availability",
      Icon: () => <BsCloudyFill size={70} color="blue" />,
    },
    {
      id: 6,
      name: "Accurate Results",
      desc: "Powered by Weaviate, we provide you with the most accurate results for your reverse image search queries",
      Icon: () => <TbDatabaseSearch size={70} color="blue" />,
    },
  ];
  return (
    <div>
      <ToastContainer />
      <div className="w-full h-screen flex">
        <div className="flex flex-col px-36 py-6 flex-grow max-w-[60vw]">
          <div className="flex items-center text-xl">
            <img src={logo} className="w-28 self-start" />
            <h1
              onClick={() => {
                ref.current.scrollIntoView();
              }}
              className="ml-24 text-gray-800 font-medium cursor-pointer"
            >
              About
            </h1>
            <h1
              onClick={() => {
                contactRef.current.scrollIntoView();
              }}
              className="ml-24 text-gray-800 font-medium cursor-pointer"
            >
              Contact
            </h1>
          </div>
          <div className="mt-40 max-w-[600px]">
            <h1 className="text-4xl font-medium">Login to</h1>
            <h1 className="text-5xl leading-tight font-semibold mt-4 text-transparent bg-clip-text bg-gradient-to-r to-sky-600 from-sky-400">
              Imgress
            </h1>
            <h1 className="mt-4 text-2xl font-normal ">
              Your one stop platform to create, manage and orchestrate your
              image search engine instances
            </h1>
          </div>
          <img src={wallpaper} className="max-w-[250px] self-end" />
        </div>
        <div className="flex justify-between flex-grow bg-[#02203c] text-sky-300">
          <div className="p-8 w-full min-h-[300px] px-24 self-center">
            <form
              className="flex flex-col justify-center gap-6"
              onSubmit={(e) => login(e)}
            >
              <h1 className="text-3xl font-semibold">Login!</h1>
              <p className="text-md font-medium">
                Enter your creds to create new engines!
              </p>
              <div className="bg-sky-900 shadow p-2 flex items-center rounded-md">
                <MdEmail className="text-sky-500 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Enter your email"
                  className="p-1 w-full text-sm outline-none bg-inherit"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>

              <div className="bg-sky-900 shadow p-2 flex items-center rounded-md">
                <MdPassword className="text-sky-500 mr-2" size={18} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="p-1 text-sm w-full outline-none bg-inherit"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                className="bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md"
              >
                {logging ? "Logging in..." : "Login"}
              </button>
              <Link to="/register" className="text-sky-600 mt-4 font-medium">
                Do not have an account? Sign Up
              </Link>
            </form>
          </div>
        </div>
      </div>
      <div
        ref={ref}
        className="px-36 py-8 bg-gradient-to-r from-cyan-100 to-sky-300 min-h-screen"
      >
        <div>
          <h1 className="text-center leading-tight mt-4 text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-sky-800 from-sky-900">
            What is Imgress?
          </h1>
          <div className="grid grid-cols-3 gap-6 mt-12">
            {descData.map((desc) => (
              <div
                key={desc.id}
                className="cursor-pointer w-full px-8 py-6 bg-white shadow-xl hover:shadow-2xl rounded flex flex-col items-center justify-center"
              >
                <desc.Icon />
                <h1 className="text-2xl font-medium mt-4">{desc.name}</h1>
                <h1 className="mt-2 text-lg text-center">{desc.desc}</h1>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        ref={contactRef}
        className="flex flex-col items-center px-36 py-12 bg-gradient-to-r from-[#02203c] to-[#001528] text-sky-300"
      >
        <div className="w-[400px] flex flex-col gap-4">
          <h1 className="text-center leading-tight text-4xl font-semibold bg-clip-text">
            Contact Us
          </h1>
          <input
            type="email"
            className="p-2 rounded-lg bg-sky-900 outline-none"
            placeholder="Enter you Email"
          />
          <textarea
            rows={7}
            className="p-2 rounded-lg bg-sky-900 outline-none"
            placeholder="Enter your message or query.."
          />
          <button className="bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md">
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
