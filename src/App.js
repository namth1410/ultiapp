import { TestProvider } from "contexts/test_context/TestContext";

import { AddHomeWorkProvider } from "contexts/add_homework_context/AddHomeWorkContext";
import ClassLayout from "layouts/ClassLayout";
import MainLayout from "layouts/MainLayout";
import ChatBox from "pages/ChatBox/ChatBox ";
import AddHomeWork from "pages/Class/HomeWork/AddHomeWork/AddHomeWork";
import HomeWork from "pages/Class/HomeWork/HomeWork";
import Member from "pages/Class/Member/Member";
import NewsFeed from "pages/Class/NewsFeed/NewsFeed";
import CreateClass from "pages/CreateClass/CreateClass";
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
import { HomeworkProvider } from "contexts/homework_context/HomeworkContext";
import TestHomework from "pages/Class/HomeWork/TestHomework/TestHomework";

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
            <Route path="/create-class" element={<CreateClass />} />
            <Route path="/edit-set/:quizz_id" element={<EditSet />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<ChatBox />} />

            <Route index path="/quizz/:quizz_id" element={<Quizz />} />

            <Route path="/class/*" element={<ClassLayout />}>
              <Route path=":class_id/newsfeed" element={<NewsFeed />} />
              <Route
                path=":class_id/homework"
                element={
                  <HomeworkProvider>
                    <HomeWork />
                  </HomeworkProvider>
                }
              />
              <Route path=":class_id/member" element={<Member />} />
              <Route
                path=":class_id/homework/add"
                element={
                  <AddHomeWorkProvider>
                    <AddHomeWork />
                  </AddHomeWorkProvider>
                }
              />
              <Route
                path=":class_id/homework/:homework_id/test"
                element={<TestHomework />}
              />
              <Route path=":class_id/*" element={<Navigate to="newsfeed" />} />
            </Route>

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
