import Header from "components/Header/Header";
import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const [visibleHeader, setVisibleHeader] = useState(true);

  useEffect(() => {
    if (window.location.pathname.includes("/quizz/test")) {
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
        }}
      >
        <Outlet />
      </div>
    </>
  );
}

export default MainLayout;
