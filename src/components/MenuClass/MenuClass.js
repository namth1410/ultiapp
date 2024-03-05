import { FileFilled, SnippetsFilled, WindowsFilled } from "@ant-design/icons";
import { Menu } from "antd";
import { useClass } from "contexts/class_context/ClassContext";
import { useNavigate } from "react-router-dom";
import styles from "./MenuClass.module.css";
import { useEffect, useState } from "react";

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
  const { dataClass } = useClass();

  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState([]);

  const items = [
    getItem("Bảng tin", "newsfeed", <WindowsFilled />),
    getItem("Lịch học", "1", <WindowsFilled />),
    getItem("Thành viên", "member", <WindowsFilled />),
    getItem("Vai trò lớp", "3", <WindowsFilled />),
    getItem("Bài tập", "homework", <WindowsFilled />),
    getItem("Bảng điểm", "5", <FileFilled />),
    getItem("Tài liệu", "6", <SnippetsFilled />),
  ];

  useEffect(() => {
    if (window.location.pathname.includes("homework")) {
      setSelectedKeys(["homework"]);
    } else if (window.location.pathname.includes("newsfeed")) {
      setSelectedKeys(["newsfeed"]);
    } else if (window.location.pathname.includes("/1")) {
      setSelectedKeys(["1"]);
    } else if (window.location.pathname.includes("/member")) {
      setSelectedKeys(["member"]);
    } else if (window.location.pathname.includes("/3")) {
      setSelectedKeys(["3"]);
    } else if (window.location.pathname.includes("/5")) {
      setSelectedKeys(["5"]);
    } else {
      setSelectedKeys(["6"]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <div className={styles.wrapper}>
      <span style={{ color: "#202227" }}>{dataClass?.nameClass}</span>
      <span
        style={{ color: "#202227", fontWeight: "500", marginTop: "5px" }}
      >{`Mã lớp: ${dataClass?.id}`}</span>
      <Menu
        style={{
          width: 256,
        }}
        onClick={(e) => {
          console.log(e);
          const parts = window.location.pathname.split("/");
          parts[parts.length - 1] = e.key;
          const newPath = parts.join("/");
          navigate(newPath);
        }}
        selectedKeys={selectedKeys}
        defaultSelectedKeys={["newsfeed"]}
        mode="inline"
        items={items}
      />
    </div>
  );
}

export default MenuClass;
