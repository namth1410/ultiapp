import { TestProvider } from "contexts/test_context/TestContext";

import { AddHomeWorkProvider } from "contexts/add_homework_context/AddHomeWorkContext";
import { HomeworkProvider } from "contexts/homework_context/HomeworkContext";
import CardContainer from "games/memory/CardContainer";
import { MemoryProvider } from "games/memory/MemoryContext";
import SearchWordGame from "games/word_search/SearchWordGame";
import ClassLayout from "layouts/ClassLayout";
import MainLayout from "layouts/MainLayout";
import ChatBox from "pages/ChatBox/ChatBox ";
import ClassHome from "pages/Class/ClassHome/ClassHome";
import AddHomeWork from "pages/Class/HomeWork/AddHomeWork/AddHomeWork";
import DetailHomeWork from "pages/Class/HomeWork/DetailHomeWork/DetailHomeWork";
import DetailRecordHomework from "pages/Class/HomeWork/DetailRecordHomework/DetailRecordHomework";
import EditHomework from "pages/Class/HomeWork/EditHomework/EditHomework";
import HomeWork from "pages/Class/HomeWork/HomeWork";
import TestHomework from "pages/Class/HomeWork/TestHomework/TestHomework";
import Member from "pages/Class/Member/Member";
import NewsFeed from "pages/Class/NewsFeed/NewsFeed";
import Score from "pages/Class/Score/Score";
import CreateClass from "pages/CreateClass/CreateClass";
import CreateSet from "pages/CreateSet/CreateSet";
import EditSet from "pages/EditSet/EditSet";
import Home from "pages/Home/Home";
import Login from "pages/Login";
import MenuGame from "pages/MenuGame/MenuGame";
import Quizz from "pages/Quizz/Quizz";
import Signup from "pages/Signup";
import PracticeSpeaking from "pages/Speaking/PracticeSpeaking/PracticeSpeaking";
import Speaking from "pages/Speaking/Speaking";
import Test from "pages/Test/Test";
import TestOnline from "pages/TestOnline/TestOnline";
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
            <Route path="/signup" element={<Signup />} />
            <Route path="/chat" element={<ChatBox />} />

            <Route path="/class" element={<ClassHome />} />
            <Route path="/class/*" element={<ClassLayout />}>
              <Route path="create-class" element={<CreateClass />} />
              <Route path=":class_id/newsfeed" element={<NewsFeed />} />
              <Route
                path=":class_id/homework"
                element={
                  <HomeworkProvider>
                    <HomeWork />
                  </HomeworkProvider>
                }
              />
              <Route
                path=":class_id/homework/:homework_id/detail/:record_id"
                element={<DetailRecordHomework />}
              />
              <Route
                path=":class_id/homework/:homework_id/edit"
                element={
                  <AddHomeWorkProvider>
                    <EditHomework />
                  </AddHomeWorkProvider>
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
                path=":class_id/homework/:homework_id/detail"
                element={<DetailHomeWork />}
              />
              <Route
                path=":class_id/homework/:homework_id/test"
                element={<TestHomework />}
              />
              <Route path=":class_id/score" element={<Score />} />
              <Route path=":class_id/*" element={<Navigate to="newsfeed" />} />
            </Route>

            <Route path="/quizz" element={<Home />} />
            <Route path="/quizz/:quizz_id" element={<Quizz />} />
            <Route path="/quizz/create-set" element={<CreateSet />} />
            <Route path="/quizz/edit-set/:quizz_id" element={<EditSet />} />

            <Route
              path="/quizz/test/:quizz_id"
              element={
                <TestProvider>
                  <Test />
                </TestProvider>
              }
            />

            <Route path="game/:quizz_id" element={<MenuGame />} />

            <Route
              path="game/memory/:quizz_id"
              element={
                <MemoryProvider>
                  <CardContainer />
                </MemoryProvider>
              }
            />

            <Route
              path="game/searchword/:quizz_id"
              element={<SearchWordGame />}
            />

            <Route path="speaking" element={<Speaking />} />
            <Route
              path="speaking/practice/:topic_id"
              element={<PracticeSpeaking />}
            />

            <Route path="online" element={<TestOnline />} />

            <Route path="/*" element={<Navigate to="/class" />} />

            <Route index element={<Navigate to="/class" />} />
          </>
        )}
      </Route>
    </Routes>
  );
}

export default App;
