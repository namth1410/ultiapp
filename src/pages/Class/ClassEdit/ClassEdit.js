import { Button, Input, Modal, Spin, Switch } from "antd";
import { useClass } from "contexts/class_context/ClassContext";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, firestore } from "../../../firebase";
import styles from "./ClassEdit.module.css";

function ClassEdit() {
  const navigate = useNavigate();
  const { dataClass, classId } = useClass();

  const [isLoading, setIsLoading] = useState(false);

  const [originDataClass, setOriginDataClass] = useState(null);
  const [draftDataClass, setDraftDataClass] = useState(null);

  const [nameClass, setNameClass] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [approveStudent, setApproveStudent] = useState(false);
  const [preventStudentExitClass, setPreventStudentExitClass] = useState(false);
  const [offNewsFeed, setOffNewsFeed] = useState(false);

  const [isDeleteClassModal, setIsDeleteClassModal] = useState(false);
  const [isDataClassChanged, setIsDataClassChanged] = useState(false);

  const validateFrom = () => {
    return !(nameClass.length === 0 || (hasPassword && password.length === 0));
  };

  const onSubmit = async () => {
    if (!validateFrom()) {
      toast.warn("Không được để trống!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    setIsLoading(true);
    const dataToAdd = {
      config: {
        approveStudent: approveStudent,
        preventStudentExitClass: preventStudentExitClass,
        offNewsFeed: offNewsFeed,
      },
      nameClass: nameClass,
      password: password,
      dateCreate: new Date().toISOString(),
      uidCreator: auth.currentUser.uid,
      nameCreator: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
    };

    const classRef = doc(firestore, "classes", classId);
    await updateDoc(classRef, dataToAdd);
    setIsLoading(false);
    toast.success("Tạo lớp mới thành công!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    window.location.href = `/class/${classId}/newsfeed`;
  };

  const onDelete = async () => {
    try {
      await deleteDoc(doc(firestore, "classes", classId));

      setIsDeleteClassModal(false);
      toast.success("Đã xóa", {
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
      console.error("Error removing member from class:", error);
    }
  };

  function checkDataClassChanged(originData, draftData) {
    if (originData.nameClass !== draftData.nameClass) {
      return true;
    }

    if (originData.password !== draftData.password) {
      return true;
    }

    return (
      originData.config.approveStudent !== draftData.config.approveStudent ||
      originData.config.preventStudentExitClass !==
        draftData.config.preventStudentExitClass ||
      originData.config.offNewsFeed !== draftData.config.offNewsFeed
    );
  }

  useEffect(() => {
    if (!draftDataClass) return;
    setIsDataClassChanged(
      checkDataClassChanged(originDataClass, draftDataClass)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftDataClass]);

  useEffect(() => {
    if (!originDataClass) return;
    setDraftDataClass({
      nameClass: nameClass,
      password: password,
      config: {
        approveStudent: approveStudent || false,
        preventStudentExitClass: preventStudentExitClass || false,
        offNewsFeed: offNewsFeed || false,
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nameClass,
    password,
    approveStudent,
    preventStudentExitClass,
    offNewsFeed,
  ]);

  useEffect(() => {
    if (!dataClass) return;
    setNameClass(dataClass.nameClass);
    setHasPassword(dataClass.password !== "");
    setPassword(dataClass.password);
    setApproveStudent(dataClass.config?.approveStudent || false);
    setPreventStudentExitClass(
      dataClass.config?.preventStudentExitClass || false
    );
    setOffNewsFeed(dataClass.config?.offNewsFeed || false);

    setOriginDataClass({
      nameClass: dataClass.nameClass,
      password: dataClass.password,
      config: {
        approveStudent: dataClass.config?.approveStudent || false,
        preventStudentExitClass:
          dataClass.config?.preventStudentExitClass || false,
        offNewsFeed: dataClass.config?.offNewsFeed || false,
      },
    });
    setDraftDataClass({
      nameClass: dataClass.nameClass,
      password: dataClass.password,
      config: {
        approveStudent: dataClass.config?.approveStudent || false,
        preventStudentExitClass:
          dataClass.config?.preventStudentExitClass || false,
        offNewsFeed: dataClass.config?.offNewsFeed || false,
      },
    });
  }, [dataClass]);
  return (
    <div className={styles.wrapper}>
      <div className={styles.left_box}>
        <div className={styles.name_class}>
          <div>Tên lớp học</div>
          <Input
            size="large"
            placeholder="Nhập tên lớp"
            onChange={(e) => {
              setNameClass(e.target.value);
            }}
            value={nameClass}
          />
        </div>

        <div className={styles.options}>
          <div className={styles.option}>
            <div className={styles.a1}>
              <span>Mã bảo vệ</span>
              <Switch
                onChange={(e) => {
                  setHasPassword(e);
                  if (!e) setPassword("");
                }}
              />
            </div>
          </div>

          {hasPassword && (
            <div className={styles.password}>
              <Input.Password
                placeholder="Nhập mã bảo vệ"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                size="large"
                value={password}
              />
            </div>
          )}

          <div className={styles.option}>
            <div className={styles.a1}>
              <span>Phê duyệt học sinh</span>
              <Switch
                onChange={(e) => {
                  setApproveStudent(e);
                }}
                value={approveStudent}
              />
            </div>
            <p>
              Phê duyệt học sinh tránh tình trạng người lạ vào lớp học mà không
              có sự cho phép của bạn
            </p>
          </div>

          <div className={styles.option}>
            <div className={styles.a1}>
              <span>Chặn học sinh tự rời lớp học</span>
              <Switch
                onChange={(e) => {
                  setPreventStudentExitClass(e);
                }}
                value={preventStudentExitClass}
              />
            </div>
            <p>
              Tính năng này giúp giáo viên quản lý số lượng thành viên trong lớp
              tốt hơn tránh tình trạng học sinh tự ý thoát khỏi lớp
            </p>
          </div>

          <div className={styles.option}>
            <div className={styles.a1}>
              <span>Tắt hoạt động bảng tin</span>
              <Switch
                onChange={(e) => {
                  setOffNewsFeed(e);
                }}
                value={offNewsFeed}
              />
            </div>
            <p>Học sinh không thể đăng bài, bình luận</p>
          </div>
        </div>
      </div>

      <div className={styles.right_box}>
        <Button
          style={{
            width: "100%",
            backgroundColor: isDataClassChanged ? "#1e88e5" : "#ccc",
            padding: "15px 20px",
            height: "auto",
            fontFamily: "Gilroy",
            color: "#fff",
            fontSize: "20px",
          }}
          onClick={onSubmit}
          disabled={!isDataClassChanged}
        >
          Lưu thay đổi
        </Button>
        <Button
          style={{
            width: "100%",
            backgroundColor: "#fff",
            padding: "15px 20px",
            height: "auto",
            fontFamily: "Gilroy",
            color: "rgb(255, 99, 99)",
            fontSize: "20px",
            border: "1px solid rgb(255, 99, 99)",
          }}
          onClick={() => {
            setIsDeleteClassModal(true);
          }}
        >
          Xóa lớp
        </Button>
      </div>

      <Modal
        title="Xóa lớp học"
        open={isDeleteClassModal}
        onOk={() => {
          onDelete();
        }}
        onCancel={() => {
          setIsDeleteClassModal(false);
        }}
      >
        <p>Bạn chắc chắn muốn xóa lớp học này?</p>
      </Modal>

      {isLoading && (
        <>
          <div className={styles.overlay}></div>
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              translate: "-50% -20%",
              zIndex: 3000,
              width: "200px",
              height: "200px",
            }}
          >
            <Spin size="large">
              <div className="content" />
            </Spin>
          </div>
        </>
      )}
    </div>
  );
}

export default ClassEdit;
