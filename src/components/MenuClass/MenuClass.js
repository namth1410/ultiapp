import {
  EditFilled,
  FileFilled,
  SnippetsFilled,
  WindowsFilled,
} from "@ant-design/icons";
import { Badge, Menu } from "antd";
import { useClass } from "contexts/class_context/ClassContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../firebase";
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
  const currentUser = useAuth();
  const { dataClass, requestJoinClass } = useClass();

  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isOwnClass, setIsOwnClass] = useState(false);

  const [items, setItems] = useState([
    getItem("Bảng tin", "newsfeed", <WindowsFilled />),
    getItem(
      isOwnClass ? (
        <Badge count={requestJoinClass?.length} offset={[15, 7]}>
          <span>Thành viên</span>
        </Badge>
      ) : (
        <span>Thành viên</span>
      ),
      "member",
      <WindowsFilled />
    ),
    getItem("Bài tập", "homework", <WindowsFilled />),
    getItem("Bảng điểm", "score", <FileFilled />),
    getItem("Tài liệu", "6", <SnippetsFilled />),
    getItem("Chỉnh sửa", "class_edit", <EditFilled />),
  ]);

  useEffect(() => {
    if (!currentUser || !dataClass) return;
    setIsOwnClass(currentUser.uid === dataClass.uidCreator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, dataClass]);

  useEffect(() => {
    const updateItems = () => {
      let updatedItems = [
        getItem("Bảng tin", "newsfeed", <WindowsFilled />),
        getItem(
          isOwnClass ? (
            <Badge count={requestJoinClass?.length} offset={[15, 7]}>
              <span>Thành viên</span>
            </Badge>
          ) : (
            <span>Thành viên</span>
          ),
          "member",
          <WindowsFilled />
        ),
        getItem("Bài tập", "homework", <WindowsFilled />),
        getItem("Bảng điểm", "score", <FileFilled />),
        getItem("Tài liệu", "6", <SnippetsFilled />),
        getItem("Chỉnh sửa", "class_edit", <EditFilled />),
      ];
      if (!isOwnClass) {
        updatedItems = updatedItems.slice(0, -1);
      }
      setItems(updatedItems);
    };

    updateItems();
  }, [requestJoinClass, isOwnClass]);

  useEffect(() => {
    if (window.location.pathname.includes("homework")) {
      setSelectedKeys(["homework"]);
    } else if (window.location.pathname.includes("newsfeed")) {
      setSelectedKeys(["newsfeed"]);
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
