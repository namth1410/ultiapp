import { RightOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import CardClass from "components/CardClass/CardClass";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import styles from "./ClassHome.module.css";

import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { auth, firestore } from "../../../firebase";
import { useNavigate } from "react-router-dom";

function ClassHome() {
  const navigate = useNavigate();

  const [userCreatedClasses, setUserCreatedClasses] = useState(null);
  const [userJoinedClasses, setUserJoinedClasses] = useState(null);

  useEffect(() => {
    const getUserCreatedClasses = async (uid) => {
      const quizzsRef = collection(firestore, "classes");
      const querySnapshot = await getDocs(
        query(
          quizzsRef,
          where("uidCreator", "==", uid),
          orderBy("dateCreate", "desc")
        )
      );
      if (querySnapshot.empty) {
        setUserCreatedClasses(null);
      } else {
        const _userCreatedClasses = [];
        querySnapshot.forEach((doc) => {
          _userCreatedClasses.push({ ...doc.data(), id: doc.id });
        });
        console.log(_userCreatedClasses);
        setUserCreatedClasses(_userCreatedClasses);
      }
    };

    const getUserJoinedClasses = async (uid) => {
      const quizzsRef = collection(firestore, "classes");
      const querySnapshot = await getDocs(
        query(
          quizzsRef,
          where("members", "array-contains", uid),
          orderBy("dateCreate", "desc")
        )
      );
      if (querySnapshot.empty) {
        setUserJoinedClasses(null);
      } else {
        const _userJoinedClasses = [];
        querySnapshot.forEach((doc) => {
          _userJoinedClasses.push({ ...doc.data(), id: doc.id });
        });
        setUserJoinedClasses(_userJoinedClasses);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        getUserCreatedClasses(user.uid);
        getUserJoinedClasses(user.uid);
      } else {
        console.log("User is signed out");
      }
    });

    return () => unsubscribe;
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tools}>
        <Input
          style={{
            height: "100%",
          }}
          placeholder="Tìm kiếm"
        />
        <Select
          defaultValue="lucy"
          style={{
            width: 160,
            height: "100%",
          }}
          allowClear
          options={[
            {
              value: "lucy",
              label: "Lucy",
            },
          ]}
        />
        <Button
          size="large"
          type="primary"
          style={{
            background: "#1e88e5",
            fontFamily: "Gilroy",
            width: "fit-content",
            height: "100%",
          }}
          onClick={() => {
            navigate("/class/create-class");
          }}
        >
          + Tạo lớp học
        </Button>
      </div>
      <div className={styles.list_wrapper}>
        {userCreatedClasses && (
          <div className={styles.a1_wrapper}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h2>Lớp bạn tạo</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    color: "var(--primary-color)",
                  }}
                >
                  Xem thêm
                </span>
                <RightOutlined style={{ color: "var(--primary-color)" }} />
              </div>
            </div>
            <div className={styles.quizzs}>
              {userCreatedClasses.map((item, index) => {
                return index < 3 ? (
                  <div key={item.id}>
                    <CardClass props={item}></CardClass>
                  </div>
                ) : (
                  <></>
                );
              })}
            </div>
          </div>
        )}

        {userJoinedClasses && (
          <div className={styles.a1_wrapper}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h2>Lớp bạn tham gia</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <span
                  style={{
                    color: "var(--primary-color)",
                  }}
                >
                  Xem thêm
                </span>
                <RightOutlined style={{ color: "var(--primary-color)" }} />
              </div>
            </div>
            <div className={styles.quizzs}>
              {userJoinedClasses.map((item, index) => {
                return index < 3 ? (
                  <div key={item.id}>
                    <CardClass props={item}></CardClass>
                  </div>
                ) : (
                  <></>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassHome;
