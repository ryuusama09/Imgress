import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [folder, setFolder] = useState([]);
  const ref = useRef();
  useEffect(() => {
    if (ref.current === null) {
      ref.current.setAttribute("directory", true);
      ref.current.setAttribute("webkitdirectory", true);
    }
  }, [ref]);
  return (
    <div className="bg-red-100">
      <h1>Hello</h1>
      <input
        type="file"
        webkitdirectory="true"
        ref={ref}
        onChange={(e) => {
          setFolder(e.target.files);
        }}
      />
      <ul id="listing"></ul>
    </div>
  );
}

export default App;
