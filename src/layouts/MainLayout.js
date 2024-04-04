import { getDataClassById } from "appdata/class/classSlice";
import { getNewsfeedOfClass } from "appdata/newsfeed/newsfeedSlice";
import Header from "components/Header/Header";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";

function MainLayout() {
  const socket = io(process.env.REACT_APP_API_URL);

  const dispatch = useDispatch();
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const [visibleHeader, setVisibleHeader] = useState(true);

  const pathDisableHeader = [
    "/quizz/test",
    "/homework/add",
    "/test",
    "/edit",
    "/game",
    "/exam",
  ];

  useEffect(() => {
    sendMessage();

    socket.on("message", (data) => {
      console.log(data);
    });

    socket.on("reload", (data) => {
      console.log(data);
      if (data.getNewsfeedOfClass) {
        const classId = data.getNewsfeedOfClass;
        dispatch(getNewsfeedOfClass({ classId: classId }));
      }
      if (data.dataClass) {
        const classId = data.dataClass;
        dispatch(getDataClassById({ id: classId }));
      }
    });

    return () => socket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = () => {
    socket.emit("message", "hello");
  };

  useEffect(() => {
    if (
      pathDisableHeader.some((path) => window.location.pathname.includes(path))
    ) {
      setVisibleHeader(false);
    } else {
      setVisibleHeader(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <>
      {visibleHeader && (
        <div ref={headerRef}>
          <Header />
        </div>
      )}
      <div
        ref={contentRef}
        style={{
          width: "100%",
          height: visibleHeader ? "calc(100vh - 89px)" : "100vh",
          overflow: "auto",
        }}
      >
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
