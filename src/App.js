import { TestProvider } from "contexts/test_context/TestContext";
import MainLayout from "layouts/MainLayout";
import CreateSet from "pages/CreateSet/CreateSet";
import Home from "pages/Home/Home";
import Login from "pages/Login";
import Quizz from "pages/Quizz/Quizz";
import Signup from "pages/Signup";
import Test from "pages/Test/Test";
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import ChatBox from "pages/ChatBox/ChatBox ";

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    const authLocalStorage = localStorage.getItem("ulti_auth");
    if (!authLocalStorage) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/home" element={<Home />} />
        <Route path="/create-set" element={<CreateSet />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat" element={<ChatBox />} />
        <Route index path="/login" element={<Login />} />
        <Route index path="/quizz/:quizz_id" element={<Quizz />} />
        <Route
          index
          path="/quizz/test/:quizz_id"
          element={
            <TestProvider>
              <Test />
            </TestProvider>
          }
        />
        <Route index path="/*" element={<Navigate to="/home" />} />
      </Route>
    </Routes>
  );
}

export default App;
