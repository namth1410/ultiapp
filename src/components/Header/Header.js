import { Button } from "antd";
import Logo from "assets/img/logo.svg";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import styles from "./Header.module.css";
import { firestore } from "../../firebase";

const provider = new GoogleAuthProvider();

function Header() {
  const navigate = useNavigate();
  
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Lưu thông tin người dùng vào Firestore
      await addDoc(collection(firestore, "users"), {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        profilePic: user.photoURL,
        //Thêm thông tin khác nếu cần
      });

      // Lưu thông tin đăng nhập vào localStorage
      localStorage.setItem(
        "ulti_auth",
        JSON.stringify({
          accessToken: user.stsTokenManager.accessToken,
          refreshToken: user.stsTokenManager.refreshToken,
        })
      );
      localStorage.setItem(
        "ulti_user",
        JSON.stringify({
          name: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
        })
      );

      navigate("/home"); // Điều hướng sau khi đăng nhập thành công
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng nhập:", error);
    }
  };
  const onLogin = () => {
    signInWithGoogle();
  };
  return (
    <div className={styles.wrapper_header}>
      <div className={styles.header}>
        <div className={styles.content_left}>
          <Button type="link">
            <img
              style={{ height: "60px" }}
              src={Logo}
              alt="Notifications Icon"
            />
          </Button>
        </div>

        <div className={styles.content_right}>
          <Button
            size="large"
            type="text"
            style={{ fontFamily: "Gilroy", border: "none", boxShadow: "none" }}
            onClick={onLogin}
          >
            Đăng nhập
          </Button>
          <Button
            size="large"
            type="primary"
            style={{ background: "#ffcd1f", fontFamily: "Gilroy" }}
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Header;
