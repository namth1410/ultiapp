import { Button } from "antd";
import Logo from "assets/img/logo.svg";
import { signInWithGoogle } from "../../firebase";
import styles from "./Header.module.css";

function Header() {
  const onLogin = () => {
    signInWithGoogle().then((result) => {
      console.log(result);
    });
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
