import {
  EditFilled,
  FileFilled,
  LogoutOutlined,
  SnippetsFilled,
  WindowsFilled,
} from "@ant-design/icons";
import { Badge, Menu, Modal, ConfigProvider } from "antd";
import { useClass } from "contexts/class_context/ClassContext";
import { addDoc, collection, doc, runTransaction } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { firestore, useAuth } from "../../firebase";
import styles from "./MenuClass.module.scss";

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
  const location = useLocation();
  const currentUser = useAuth();
  const { dataClass, requestJoinClass, classId } = useClass();

  const navigate = useNavigate();

  const [selectedKeys, setSelectedKeys] = useState([]);
  const [isOwnClass, setIsOwnClass] = useState(false);
  const [preventStudentExitClass, setPreventStudentExitClass] = useState(false);
  const [isExitClassModal, setIsExitClassModal] = useState(false);

  const [items, setItems] = useState([
    getItem("Bảng tin", "newsfeed", <WindowsFilled />),
    getItem(
      isOwnClass ? (
        <Badge
          className={styles.member_item}
          count={requestJoinClass?.length}
          offset={[15, 7]}
        >
          <span className={styles.member_item}>Thành viên</span>
        </Badge>
      ) : (
        <span className={styles.member_item}>Thành viên</span>
      ),
      "member",
      <WindowsFilled />
    ),
    getItem("Bài tập", "homework", <WindowsFilled />),
    getItem("Bảng điểm", "score", <FileFilled />),
    getItem("Tài liệu", "document", <SnippetsFilled />),
    getItem("Chỉnh sửa", "class_edit", <EditFilled />),
  ]);

  const removeMemberFromClass = async (classId, memberId) => {
    try {
      const classRef = doc(firestore, "classes", classId);

      await runTransaction(firestore, async (transaction) => {
        const classDoc = await transaction.get(classRef);
        if (!classDoc.exists()) {
          throw new Error("Class document does not exist.");
        }

        const members = classDoc.data().members || [];

        const updatedMembers = members.filter((id) => id !== memberId);

        transaction.update(classRef, { members: updatedMembers });
      });
      const dataToAdd = {
        dateCreate: new Date().toISOString(),
        uidCreator: currentUser?.uid,
        nameCreator: currentUser?.displayName,
        photoURL: currentUser?.photoURL,
        class: classId,
        content: `${currentUser?.displayName} đã rời khỏi lớp ${dataClass.nameClass} của bạn`,
        type: "normal",
        receiver: [`${dataClass.uidCreator}$unread`],
      };
      await addDoc(collection(firestore, "notifications"), dataToAdd);
      setIsExitClassModal(false);
      toast.success("Đã rời khỏi lớp", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      navigate("/class");
    } catch (error) {
      console.error("Lỗi khi rời khỏi lớp:", error);
    }
  };

  useEffect(() => {
    if (!currentUser || !dataClass) return;
    setIsOwnClass(currentUser.uid === dataClass.uidCreator);
    setPreventStudentExitClass(dataClass.config.preventStudentExitClass);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, dataClass]);

  useEffect(() => {
    const updateItems = () => {
      let updatedItems = [
        getItem("Bảng tin", "newsfeed", <WindowsFilled />),
        getItem(
          isOwnClass ? (
            <Badge
              className={styles.member_item}
              count={requestJoinClass?.length}
              offset={[15, 7]}
            >
              <span className={styles.member_item}>Thành viên</span>
            </Badge>
          ) : (
            <span className={styles.member_item}>Thành viên</span>
          ),
          "member",
          <WindowsFilled />
        ),
        getItem("Bài tập", "homework", <WindowsFilled />),
        getItem("Bảng điểm", "score", <FileFilled />),
        getItem("Tài liệu", "document", <SnippetsFilled />),
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
    } else if (window.location.pathname.includes("/document")) {
      setSelectedKeys(["document"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  return (
    <div className={styles.wrapper}>
      <span>{dataClass?.nameClass}</span>
      <span
        style={{ fontWeight: "500", marginTop: "5px" }}
      >{`Mã lớp: ${dataClass?.id}`}</span>
      <ConfigProvider
        theme={{
          token: {
            colorBgContainer: "var(--body-background)",
          },
          components: {
            Menu: {
              colorText: "#000",
              itemActiveBg: "var(--primary-color)",
              itemSelectedBg: "var(--button-background)",
              itemColor: "var(--text-color-primary)",
              itemHoverColor: "var(--primary-color)",
              lineWidth: 0
            },
          },
        }}
      >
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
      </ConfigProvider>
      {!preventStudentExitClass && !isOwnClass && (
        <button
          style={{
            marginTop: "auto",
            borderTop: "1px solid rgb(216, 220, 240)",
            display: "flex",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "10px",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "16px",
          }}
          onClick={() => {
            setIsExitClassModal(true);
          }}
        >
          <LogoutOutlined
            style={{
              fontSize: "30px",
              marginRight: "10px",
              color: "#ff4949",
            }}
          />
          <div style={{ verticalAlign: "middle", color: "#ff4949" }}>
            Rời khỏi lớp
          </div>
        </button>
      )}

      <Modal
        title="Xóa thành viên"
        open={isExitClassModal}
        onOk={() => {
          removeMemberFromClass(classId, currentUser?.uid);
        }}
        onCancel={() => {
          setIsExitClassModal(false);
        }}
      >
        <p>Bạn chắc chắn muốn rời khỏi lớp?</p>
      </Modal>
    </div>
  );
}

export default MenuClass;
