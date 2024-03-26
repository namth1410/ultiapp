import { BellFilled, UserOutlined } from "@ant-design/icons";
import { Badge, Button, Divider, Dropdown, Space } from "antd";
import Logo from "assets/img/logo.svg";
import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "ultis/api";
import { convertISOToCustomFormat } from "ultis/time";
import { auth, firestore, useAuth } from "../../firebase";
import styles from "./Header.module.css";

const provider = new GoogleAuthProvider();

function Header() {
  const navigate = useNavigate();
  const currentUser = useAuth();

  const needLogin = !localStorage.getItem("ulti_auth");
  const infoUser = JSON.parse(localStorage.getItem("ulti_user"));
  const [menuItem, setMenuItem] = useState("");
  const [notificationsUnRead, setNotificationsUnRead] = useState(null);
  const [notificationsRead, setNotificationsRead] = useState(null);

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

      const apiUrl = `/sessionLogin`;
      const idToken = user.stsTokenManager.accessToken;

      axiosInstance
        .post(apiUrl, { idToken })
        .then((response) => {
          const cookies = response.headers["Set-Cookie"];
          console.log("Cookies:", cookies);
          navigate("/class");
        })
        .catch((error) => {
          console.error("Error:", error.response.data);
        });
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
        axiosInstance
          .post(`/sessionLogout`)
          .then((response) => {})
          .catch((error) => {
            console.error("Error:", error);
          });
      })
      .catch((error) => {
        // An error happened.
      });
  };

  useEffect(() => {
    if (currentUser == null) {
      return;
    }
    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "notifications"),
        where("receiver", "array-contains", `${currentUser.uid}$unread`),
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
        where("receiver", "array-contains", `${currentUser.uid}`),
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
                      console.log(e);
                      console.log(notificationsUnRead);
                      notificationsUnRead.forEach((noti) => {
                        const classRef = doc(
                          firestore,
                          "notifications",
                          noti.id
                        );
                        let dataToAdd = { ...noti };

                        const index = dataToAdd.receiver.findIndex(
                          (el) => el === `${currentUser.uid}$unread`
                        );

                        dataToAdd.receiver[index] = `${currentUser.uid}`;
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
                          backgroundColor: "#f4f9fe",
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
                        backgroundColor: "#f0f2f5",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <BellFilled />
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
            </>
          ) : (
            <>
              <Button
                size="large"
                type="primary"
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
                style={{
                  background: "#ffcd1f",
                  fontFamily: "Gilroy",
                  display: "none",
                }}
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

const NotificationItem = ({ notification, navigate }) => {
  return (
    <div
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
        className="text"
        style={{
          padding: "6px 8px",
        }}
      >
        <p>{notification.content}</p>
        <p style={{ color: "#65697b", fontSize: "12px" }}>
          {convertISOToCustomFormat(notification.dateCreate)}
        </p>
      </div>
    </div>
  );
};
export default Header;
