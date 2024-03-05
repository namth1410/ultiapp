import { ClassProvider } from "contexts/class_context/ClassContext";
import { Outlet } from "react-router-dom";
import MenuClass from "components/MenuClass/MenuClass";

function ClassLayout() {
  return (
    <ClassProvider>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex"
        }}
      >
        <MenuClass />
        <Outlet />
      </div>
    </ClassProvider>
  );
}

export default ClassLayout;
