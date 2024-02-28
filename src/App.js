import { TestProvider } from "contexts/test_context/TestContext";
import MainLayout from "layouts/MainLayout";
import ChatBox from "pages/ChatBox/ChatBox ";
import CreateSet from "pages/CreateSet/CreateSet";
import EditSet from "pages/EditSet/EditSet";
import Home from "pages/Home/Home";
import Login from "pages/Login";
import Quizz from "pages/Quizz/Quizz";
import Signup from "pages/Signup";
import Test from "pages/Test/Test";
import { useEffect } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const navigate = useNavigate();
  const needLogin = !localStorage.getItem("ulti_auth");
  useEffect(() => {
    if (needLogin) {
      navigate("/login");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        {needLogin ? (
          <>
            <Route index path="/login" element={<Login />} />
            <Route index path="/*" element={<Login />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<Home />} />
            <Route path="/create-set" element={<CreateSet />} />
            <Route path="/edit-set/:quizz_id" element={<EditSet />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<ChatBox />} />

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
            <Route index element={<Navigate to="/home" />} />
            <Route index path="/*" element={<Navigate to="/home" />} />
          </>
        )}
      </Route>
    </Routes>
  );
}

export default App;
