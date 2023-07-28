import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadFiles from "./pages/UploadFiles";
import Test from "./pages/Test";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/upload-files/:engineId" element={<UploadFiles />} />
      <Route path="/test/:classname" element={<Test />} />
    </Routes>
  );
}

export default App;
