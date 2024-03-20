import {
  EditFilled,
  FileFilled,
  SnippetsFilled,
  WindowsFilled,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useClass } from "contexts/class_context/ClassContext";
import { useEffect, useState } from "react";
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
  const { dataClass } = useClass();

  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState([]);

  const items = [
    getItem("Bảng tin", "newsfeed", <WindowsFilled />),
    getItem("Lịch học", "1", <WindowsFilled />),
    getItem("Thành viên", "member", <WindowsFilled />),
    getItem("Bài tập", "homework", <WindowsFilled />),
    getItem("Bảng điểm", "score", <FileFilled />),
    getItem("Tài liệu", "6", <SnippetsFilled />),
    getItem("Chỉnh sửa", "class_edit", <EditFilled />),
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
    } else if (window.location.pathname.includes("/class_edit")) {
      setSelectedKeys(["class_edit"]);
    } else if (window.location.pathname.includes("/score")) {
      setSelectedKeys(["score"]);
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
