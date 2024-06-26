import { BarsOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import { Badge, Button, Divider, Dropdown, Space, Switch } from "antd";
import Logo from "assets/img/logo.png";
import { useTheme } from "contexts/theme_context/ThemeContext";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import axiosInstance from "ultis/api";
import { convertISOToCustomFormat } from "ultis/time";
import { auth, firestore, useAuth } from "../../firebase";
import styles from "./Header.module.scss";

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account",
});

function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useAuth();
  const { themeMode, setThemeMode } = useTheme();

  const needLogin = !localStorage.getItem("ulti_auth");

  const infoUser = JSON.parse(localStorage.getItem("ulti_user"));
  const [menuItem, setMenuItem] = useState("");
  const [notificationsUnRead, setNotificationsUnRead] = useState(null);
  const [notificationsRead, setNotificationsRead] = useState(null);

  const items = [
    {
      key: "1",
      label: (
        <div
          style={{
            display: "flex",
            gap: "10px",
            color: "var(--text-color-primary)",
          }}
        >
          <UserOutlined style={{ fontSize: "20px" }} />
          <span>Hồ sơ</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <>
          <span
            style={{ marginRight: "10px", color: "var(--text-color-primary)" }}
          >
            Chế độ tối
          </span>
          <Switch
            value={themeMode === "dark"}
            onChange={(e) => {
              setThemeMode(e ? "dark" : "light");
            }}
          />
        </>
      ),
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
    backgroundColor: "var(--body-background)",
    borderRadius: "10px",
    boxShadow: "0 1.25rem 2rem 0 #00000029",
    border: "1px solid var(--text-color-primary)",
  };
  const menuStyle = {
    boxShadow: "none",
    backgroundColor: "var(--body-background)",
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

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
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          profilePic: user.photoURL,
        })
      );

      const apiUrl = `/login`;

      await axiosInstance
        .post(apiUrl)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error("Error:", error.response.data);
        });

      window.location.href = `${process.env.REACT_APP_HOST}/class`;
    } catch (error) {
      console.error("Đã xảy ra lỗi khi đăng nhập:", error);
    }
  };

  const handleClickMenu = (e) => {
    if (needLogin) {
      e.preventDefault();
      const MySwal = withReactContent(Swal);
      MySwal.fire({
        background: "#000",
        color: "#fff",
        title: "Chào bạn!",
        text: `Bạn cần đăng nhập để truy cập phần này!`,
        icon: "info",
        confirmButtonText: "Đăng nhập",
        allowOutsideClick: true,
        allowEscapeKey: false,
        allowEnterKey: false,
        preConfirm: () => {
          signInWithGoogle();
        },
      });
    }
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      axiosInstance
        .post(`/logout`)
        .then((response) => {
          localStorage.removeItem("ulti_auth");
          localStorage.removeItem("ulti_user");
          window.location.href = `${process.env.REACT_APP_HOST}/login`;
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  };

  useEffect(() => {
    if (currentUser == null) {
      return;
    }
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "notifications"),
        where("receiver", "array-contains", `${currentUser?.uid}$unread`),
        orderBy("dateCreate", "desc")
      ),
      (snapshot) => {
        const _notifications = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setNotificationsUnRead(_notifications);
      }
    );

    const unsubscribe1 = onSnapshot(
      query(
        collection(firestore, "notifications"),
        where("receiver", "array-contains", `${currentUser?.uid}`),
        orderBy("dateCreate", "desc")
      ),
      (snapshot) => {
        const _notifications = snapshot.docs.map((doc) => doc.data());
        setNotificationsRead(_notifications);
      }
    );

    // Return a function to unsubscribe when component unmounts
    return () => {
      unsubscribe();
      unsubscribe1();
    };
  }, [currentUser]);

  useEffect(() => {
    setMenuItem(location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const contentLeft = document.querySelector(`.${styles.content_left}`);
      const isClickedOutside = !contentLeft.contains(event.target);
      if (isClickedOutside) {
        document.getElementById("check").checked = false;
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.wrapper_header}>
      <div className={styles.header}>
        <div className={styles.content_left}>
          <div className={styles.menu_mb_btn}>
            <input type="checkbox" id="check" />
            <label htmlFor="check">
              <BarsOutlined className={styles.bars_btn} />
              <CloseOutlined className={styles.close_btn} />
            </label>
            <div className={styles.menu_item_box}>
              <Button
                type="link"
                onClick={() => {
                  navigate("/class");
                }}
                style={{
                  height: "auto",
                }}
              >
                <img className={styles.logo} src={Logo} alt="Logo Icon" />
              </Button>
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
        </div>

        <div className={styles.content_right}>
          {!needLogin ? (
            <>
              <div className={styles.profile_dropdown_wrapper}>
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottomRight"
                  arrow={{ pointAtCenter: true }}
                  onOpenChange={async (e) => {
                    if (e && notificationsUnRead) {
                      notificationsUnRead.forEach((noti) => {
                        const classRef = doc(
                          firestore,
                          "notifications",
                          noti.id
                        );
                        let dataToAdd = { ...noti };

                        const index = dataToAdd.receiver.findIndex(
                          (el) => el === `${currentUser?.uid}$unread`
                        );

                        dataToAdd.receiver[index] = `${currentUser?.uid}`;
                        updateDoc(classRef, dataToAdd);
                      });
                    }
                  }}
                  trigger={["click"]}
                  dropdownRender={(menu) => (
                    <div style={contentStyle}>
                      <Space
                        style={{
                          padding: 8,
                          borderRadius: "8px",
                          maxWidth: "400px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            maxHeight: "400px",
                            overflowY: "auto",
                          }}
                        >
                          {notificationsUnRead?.map((el) => {
                            return (
                              <NotificationItem
                                key={el}
                                notification={el}
                                navigate={navigate}
                              />
                            );
                          })}
                          {notificationsRead?.map((el) => {
                            return (
                              <NotificationItem
                                key={el}
                                notification={el}
                                navigate={navigate}
                              />
                            );
                          })}
                        </div>
                      </Space>
                    </div>
                  )}
                >
                  <Badge count={notificationsUnRead?.length} offset={[-35, 5]}>
                    <div
                      style={{
                        width: "60%",
                        position: "relative",
                        padding: "0px",
                        borderRadius: "100px",
                        aspectRatio: "1",
                        cursor: "pointer",
                        border: "1px solid var(--button-background)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <i
                        className="bi bi-bell-fill"
                        style={{ color: "var(--text-color-primary)" }}
                      ></i>
                    </div>
                  </Badge>
                </Dropdown>
              </div>
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
                          color: "var(--text-color-primary)",
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
                      userSelect: "none",
                    }}
                    className={styles.avatar_wrapper}
                  >
                    <img
                      style={{
                        objectFit: "cover",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        translate: "-50% -50%",
                        borderRadius: "50%",
                        width: "40px",
                      }}
                      src={infoUser.profilePic}
                      alt="Notification Icon"
                    />
                  </div>
                </Dropdown>
              </div>
            </>
          ) : (
            <Button
              size="large"
              type="primary"
              style={{
                fontFamily: "Gilroy",
                border: "none",
                boxShadow: "none",
              }}
              className={styles.login_btn}
              onClick={signInWithGoogle}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

const NotificationItem = ({ notification, navigate }) => {
  return (
    <button
      style={{
        display: "flex",
        width: "100%",
        padding: "7px 14px",
        alignItems: "center",
        borderBottom: "1px solid rgba(0, 0, 0, 0.063)",
        boxSizing: "border-box",
      }}
      onClick={() => {
        if (notification.content.includes("Bạn đã được thêm vào lớp")) {
          navigate(`/class/${notification.class}/newsfeed`);
        }
      }}
    >
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          overflow: "hidden",
          userSelect: "none",
          marginRight: "8px",
          flexShrink: 0,
        }}
        className={styles.img_wrapper}
      >
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt="img"
          src="https://shub-storage.sgp1.cdn.digitaloceanspaces.com/profile_images/AvatarDefaultPng.png"
        />
      </div>
      <div
        style={{
          padding: "6px 8px",
          fontWeight: "bold",
          textAlign: "start",
          lineHeight: "1.57",
        }}
      >
        <p style={{ color: "var(--text-color-primary)" }}>
          {notification.content}
        </p>
        <p style={{ color: "#65697b", fontSize: "12px" }}>
          {convertISOToCustomFormat(notification.dateCreate)}
        </p>
      </div>
    </button>
  );
};
export default Header;
