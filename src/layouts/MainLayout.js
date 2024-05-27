import { getDataClassById, getHomeworkOfClass } from "appdata/class/classSlice";
import { getNewsfeedOfClass } from "appdata/newsfeed/newsfeedSlice";
import Header from "components/Header/Header";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { io } from "socket.io-client";

function MainLayout() {
  const location = useLocation();
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
      if (data.getNewsfeedOfClass) {
        const classId = data.getNewsfeedOfClass;
        dispatch(getNewsfeedOfClass({ classId: classId }));
      }
      if (data.dataClass) {
        const classId = data.dataClass;
        dispatch(getDataClassById({ id: classId }));
      }

      if (data.homework) {
        const classId = data.homework;
        dispatch(getHomeworkOfClass({ id: classId }));
      }
    });

    fetch("https://api.gateway.mirabo.vn/vtg/dev2/api/v1/health", {
      credentials: "include",
    })
      .then((response) => {
        console.log(response);
        if (response.redirected) {
          window.location = response.url;
        }
        if (response.type === "opaqueredirect") {
          // window.location.href = `${window._env_.REACT_APP_API_URL}/vtg/dev2/api/v1/health`
        } else if (response.ok) {
          return response.json();
        } else {
          throw new Error("Request failed with status: " + response.status);
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
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
  }, [location.pathname]);

  useLayoutEffect(() => {
    console.log(headerRef);
    contentRef.current.style.height = `calc(100vh - ${headerRef?.current?.offsetHeight}px)`;
  }, [visibleHeader]);

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
          overflow: "auto",
          backgroundColor: "var(--body-background)",
        }}
      >
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
