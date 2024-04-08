import MenuClass from "components/MenuClass/MenuClass";
import { ClassProvider } from "contexts/class_context/ClassContext";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ClassLayout() {
  const location = useLocation();
  const [visibleMenu, setVisibleMenu] = useState(true);

  const pathDisableMenu = [
    "/homework/add",
    "/test",
    "/detail/",
    "/edit",
    "/create-class",
  ];

  useEffect(() => {
    console.log("window pathname thay doi");
    if (pathDisableMenu.some((path) => location.pathname.includes(path))) {
      setVisibleMenu(false);
    } else {
      setVisibleMenu(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <ClassProvider>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
        }}
      >
        {visibleMenu && <MenuClass />}
        <Outlet />
      </div>
    </ClassProvider>
  );
}

export default ClassLayout;
