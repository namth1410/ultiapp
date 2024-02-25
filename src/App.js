import MainLayout from "layouts/MainLayout";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const authLocalStorage = localStorage.getItem("ulti_auth");
    if (!authLocalStorage) {
      navigate("/login");
    } else {
      navigate("/home");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route index path="/login" element={<Login />} />
      </Route>
    </Routes>
  );
}

export default App;
