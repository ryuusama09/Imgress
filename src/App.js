import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UploadFiles from "./pages/UploadFiles";
import Test from "./pages/Test";
import ProtectedRoute from "./pages/ProtectedRoute";
import { useStore } from "./store";

function App() {
  const user = useStore((state) => state.user);
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/upload-files/:engineId"
        element={
          <ProtectedRoute user={user}>
            <UploadFiles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test/:classname"
        element={
          <ProtectedRoute user={user}>
            <Test />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
