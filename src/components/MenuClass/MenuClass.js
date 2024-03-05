import { FileFilled, SnippetsFilled, WindowsFilled } from "@ant-design/icons";
import { Menu } from "antd";
import { useClass } from "contexts/class_context/ClassContext";
import { useNavigate } from "react-router-dom";
import styles from "./MenuClass.module.css";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

function MenuClass() {
  const { classId, nameClass } = useClass();

  const navigate = useNavigate();

  const items = [
    getItem("Bảng tin", "newsfeed", <WindowsFilled />),
    getItem("Lịch học", "1", <WindowsFilled />),
    getItem("Thành viên", "2", <WindowsFilled />),
    getItem("Vai trò lớp", "3", <WindowsFilled />),
    getItem("Bài tập", "homework", <WindowsFilled />),
    getItem("Bảng điểm", "5", <FileFilled />),
    getItem("Tài liệu", "6", <SnippetsFilled />),
  ];

  return (
    <div className={styles.wrapper}>
      <span style={{ color: "#202227" }}>{nameClass}</span>
      <span
        style={{ color: "#202227", fontWeight: "500", marginTop: "5px" }}
      >{`Mã lớp: ${classId}`}</span>
      <Menu
        style={{
          width: 256,
        }}
        onClick={(e) => {
          const parts = window.location.pathname.split("/");
          parts[parts.length - 1] = e.key;
          const newPath = parts.join("/");
          navigate(newPath);
        }}
        defaultSelectedKeys={["newsfeed"]}
        defaultOpenKeys={["sub1"]}
        mode="inline"
        items={items}
      />
    </div>
  );
}

export default MenuClass;
