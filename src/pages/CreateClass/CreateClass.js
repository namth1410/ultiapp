import { Button, Input, Spin, Switch } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { toast } from "react-toastify";
import { auth, firestore } from "../../firebase";
import styles from "./CreateClass.module.css";

function CreateClass() {
  const [isLoading, setIsLoading] = useState(false);

  const [nameClass, setNameClass] = useState("");
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState("");

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
            <span>Mã bảo vệ</span>
            <Switch
              onChange={(e) => {
                setHasPassword(e);
                if (!e) setPassword("");
              }}
            />
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
