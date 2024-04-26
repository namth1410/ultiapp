import { Button, Input, Spin, Switch } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, firestore } from "../../firebase";
import styles from "./CreateClass.module.scss";

function CreateClass() {
  const [isLoading, setIsLoading] = useState(false);

  const [nameClass, setNameClass] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [approveStudent, setApproveStudent] = useState(false);
  const [preventStudentExitClass, setPreventStudentExitClass] = useState(false);
  const [offNewsFeed, setOffNewsFeed] = useState(false);

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

    const docRef = await addDoc(collection(firestore, "classes"), dataToAdd);
    console.log(docRef);
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
    window.location.href = `/class/${docRef.id}/newsfeed`;
  };

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
            backgroundColor: "#1e88e5",
            padding: "15px 20px",
            height: "auto",
            fontFamily: "Gilroy",
            color: "#fff",
            fontSize: "20px",
          }}
          onClick={onSubmit}
        >
          Tạo lớp
        </Button>
      </div>

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

export default CreateClass;
