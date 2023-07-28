import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { MdEmail, MdPassword, MdPerson } from "react-icons/md";
import wallpaper from "../assets/wallpaper2.png";
import { ToastContainer, toast } from "react-toastify";
import { SiCreatereactapp } from "react-icons/si";
import { AiOutlineFileAdd } from "react-icons/ai";
import { TbHierarchy } from "react-icons/tb";
import { SiVitest, SiCoronaengine } from "react-icons/si";
import "react-toastify/dist/ReactToastify.css";
const Register = () => {
  const ref = useRef(null);
  const contactRef = useRef(null);
  const [registering, setRegistering] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
    username: "",
    password: "",
  });

  const register = async (e) => {
    e.preventDefault();
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (data.email === "" || data.username === "" || data.password === "") {
      toast.error("Please fill all the fields");
      return;
    } else if (!regex.test(data.email)) {
      toast.error("Please enter a valid email");
      return;
    } else if (data.password.length < 8) {
      toast.error("Password must be atleast 8 characters long");
      return;
    } else if (data.username.length < 4) {
      toast.error("Username must be atleast 4 characters long");
      return;
    } else if (data.username.length > 20) {
      toast.error("Username must be less than 20 characters long");
      return;
    } else if (data.password.length > 20) {
      toast.error("Password must be less than 20 characters long");
      return;
    } else if (data.username.includes(" ")) {
      toast.error("Username must not contain spaces");
      return;
    } else if (data.password.includes(" ")) {
      toast.error("Password must not contain spaces");
      return;
    } else {
      setRegistering(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(data);
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
      };
      fetch("https://lambda1.vercel.app/dev/signup", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log(result);
          setRegistering(false);
          navigate("/login");
        })
        .catch((error) => {
          console.log("error", error);
          toast.error("Username or email already exists");
          setRegistering(false);
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
            <h1 className="text-4xl font-medium">Sign in to</h1>
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
              onSubmit={(e) => register(e)}
            >
              <h1 className="text-3xl font-semibold">Sign in!</h1>
              <p className="text-md font-medium">
                Start your journey of creating engines!
              </p>
              <div className="bg-sky-900 shadow p-2 flex items-center rounded-md">
                <MdEmail className="text-sky-500 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Enter email"
                  className="p-1 w-full text-sm outline-none bg-inherit"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                />
              </div>
              <div className="bg-sky-900 shadow p-2 flex items-center rounded-md">
                <MdPerson className="text-sky-500 mr-2" size={18} />
                <input
                  type="text"
                  placeholder="Enter username"
                  className="p-1 w-full text-sm outline-none bg-inherit"
                  value={data.username}
                  onChange={(e) =>
                    setData({ ...data, username: e.target.value })
                  }
                />
              </div>
              <div className="bg-sky-900 shadow p-2 flex items-center rounded-md">
                <MdPassword className="text-sky-500 mr-2" size={18} />
                <input
                  type="password"
                  placeholder="Enter password"
                  className="p-1 text-sm w-full outline-none bg-inherit"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                />
              </div>

              <button
                type="submit"
                disabled={registering}
                className="bg-gradient-to-bl from-sky-600 to-sky-300 bg-[position:_0%_0%] hover:bg-[position:_100%_100%] bg-[size:_200%] transition-all duration-500 text-[#02203c] p-3 rounded-md"
              >
                {registering ? "Registering..." : "Register"}
              </button>
              <Link to="/login" className="text-sky-600 mt-4 font-medium">
                Already have an account? Login
              </Link>
            </form>
          </div>
        </div>
      </div>
      <div
        ref={ref}
        className="px-36 py-6 bg-gradient-to-r from-cyan-100 to-sky-300 h-screen"
      >
        <div>
          <h1 className="text-center leading-tight mt-6 text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r to-sky-800 from-sky-900">
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

export default Register;
