import { UserOutlined } from "@ant-design/icons";
import { Button, Divider, Dropdown, Space } from "antd";
import Logo from "assets/img/logo.svg";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import styles from "./Header.module.css";

const provider = new GoogleAuthProvider();

function Header() {
  const navigate = useNavigate();

  const needLogin = !localStorage.getItem("ulti_auth");
  const infoUser = JSON.parse(localStorage.getItem("ulti_user"));
  const [menuItem, setMenuItem] = useState("");

  const items = [
    {
      key: "1",
      label: (
        <div style={{ display: "flex", gap: "10px" }}>
          <UserOutlined style={{ fontSize: "20px" }} />
          <span>Hồ sơ</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item (disabled)
        </a>
      ),
      disabled: true,
    },
  ];
  const contentStyle = {
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 1.25rem 2rem 0 #00000029",
    border: "1px solid #ccc",
  };
  const menuStyle = {
    boxShadow: "none",
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const usersRef = collection(firestore, "users");
      const querySnapshot = await getDocs(
        query(usersRef, where("uid", "==", user.uid))
      );

      if (!querySnapshot.empty) {
        const docId = querySnapshot.docs[0].id;
        await updateDoc(doc(usersRef, docId), {
          displayName: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
        });
      } else {
        await addDoc(usersRef, {
          uid: user.uid,
          displayName: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
        });
      }

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

      navigate("/class");
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng nhập:", error);
    }
  };

  const handleClickMenu = (e) => {
    if (needLogin) {
      e.preventDefault();
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        localStorage.clear();
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  useEffect(() => {
    setMenuItem(window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <div className={styles.wrapper_header}>
      <div className={styles.header}>
        <div className={styles.content_left}>
          <Button
            type="link"
            onClick={() => {
              navigate("/class");
            }}
            style={{
              height: "auto",
            }}
          >
            <img
              style={{ height: "60px" }}
              src={Logo}
              alt="Notifications Icon"
            />
          </Button>

          <div className={styles.menu_item_box}>
            <Link
              to="/class"
              className={`${styles.menu_item} ${
                menuItem.includes("/class") ? styles.active : ""
              }`}
              onClick={handleClickMenu}
            >
              <div>Lớp học</div>
            </Link>
            <Link
              to="/quizz"
              className={`${styles.menu_item} ${
                menuItem.includes("/quizz") ? styles.active : ""
              }`}
              onClick={handleClickMenu}
            >
              <div>Quizz</div>
            </Link>
            <Link
              to="/speaking"
              className={`${styles.menu_item} ${
                menuItem.includes("/speaking") ? styles.active : ""
              }`}
              onClick={handleClickMenu}
            >
              <div>Luyện nói</div>
            </Link>
            <Link
              to="/online"
              className={`${styles.menu_item} ${
                menuItem.includes("/online") ? styles.active : ""
              }`}
              onClick={handleClickMenu}
            >
              <div>Luyện đề</div>
            </Link>
          </div>
        </div>

        <div className={styles.content_right}>
          {!needLogin ? (
            <div className={styles.profile_dropdown_wrapper}>
              <Dropdown
                menu={{
                  items,
                }}
                placement="bottomRight"
                arrow={{ pointAtCenter: true }}
                trigger={["click"]}
                dropdownRender={(menu) => (
                  <div style={contentStyle}>
                    <Space
                      style={{
                        padding: 8,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          style={{
                            objectFit: "cover",
                            scale: "0.4",
                            borderRadius: "50%",
                          }}
                          src={infoUser.profilePic}
                          alt="Notification Icon"
                        />
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          <span>{infoUser.name}</span>
                          <span
                            style={{
                              fontWeight: "500",
                              width: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {infoUser.email}
                          </span>
                        </div>
                      </div>
                    </Space>
                    <Divider
                      style={{
                        margin: 0,
                      }}
                    />
                    {React.cloneElement(menu, {
                      style: menuStyle,
                    })}
                    <Divider
                      style={{
                        margin: 0,
                      }}
                    />
                    <Space
                      style={{
                        padding: 8,
                        justifyContent: "center",
                        width: "100%",
                      }}
                    >
                      <Button
                        type="primary"
                        style={{ fontFamily: "Gilroy" }}
                        onClick={handleLogout}
                      >
                        Đăng xuất
                      </Button>
                    </Space>
                  </div>
                )}
              >
                <div
                  style={{
                    width: "70%",
                    position: "relative",
                    padding: "0px",
                    borderRadius: "100px",
                    aspectRatio: "1",
                    cursor: "pointer",
                  }}
                >
                  <img
                    style={{
                      objectFit: "cover",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      translate: "-50% -50%",
                      scale: "0.4",
                      borderRadius: "50%",
                    }}
                    src={
                      JSON.parse(localStorage.getItem("ulti_user")).profilePic
                    }
                    alt="Notification Icon"
                  />
                </div>
              </Dropdown>
            </div>
          ) : (
            <>
              <Button
                size="large"
                type="text"
                style={{
                  fontFamily: "Gilroy",
                  border: "none",
                  boxShadow: "none",
                }}
                onClick={signInWithGoogle}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Header;
