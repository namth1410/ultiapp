import { RightOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import CardClass from "components/CardClass/CardClass";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import styles from "./ClassHome.module.css";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../../firebase";
const { Search } = Input;

function ClassHome() {
  const navigate = useNavigate();

  const filters = [
    {
      value: "asc",
      label: "A-Z",
    },
    {
      value: "desc",
      label: "Z-A",
    },
    {
      value: "time_asc",
      label: "Cũ nhất",
    },
    {
      value: "time_desc",
      label: "Mới nhất",
    },
  ];

  const [userCreatedClasses, setUserCreatedClasses] = useState(null);
  const [userJoinedClasses, setUserJoinedClasses] = useState(null);
  const [filter, setFilter] = useState("time_desc");

  const [searchClass, setSearchClass] = useState(null);

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

  function sortArrayByFilter(array, filter) {
    let sortedArray = [...array];

    if (filter === "asc" || filter === "desc") {
      sortedArray.sort((a, b) => {
        const nameA = a.nameClass.toUpperCase();
        const nameB = b.nameClass.toUpperCase();
        if (filter === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    } else if (filter === "time_asc" || filter === "time_desc") {
      sortedArray.sort((a, b) => {
        const dateA = new Date(a.dateCreate);
        const dateB = new Date(b.dateCreate);
        if (filter === "time_asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }

    return sortedArray;
  }

  const onSearch = async (id) => {
    const classRef = doc(firestore, "classes", id);
    const docSnapshot = await getDoc(classRef);

    if (docSnapshot.exists()) {
      setSearchClass({ ...docSnapshot.data(), id: id });
    } else {
      setSearchClass(null);
    }
  };

  useEffect(() => {
    if (!userCreatedClasses) return;

    let _userCreatedClasses = [...userCreatedClasses];
    let _userJoinedClasses = [...userJoinedClasses];

    _userCreatedClasses = sortArrayByFilter(_userCreatedClasses, filter);
    _userJoinedClasses = sortArrayByFilter(_userJoinedClasses, filter);

    setUserCreatedClasses(_userCreatedClasses);
    setUserJoinedClasses(_userJoinedClasses);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
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
        <Search
          placeholder="Tìm kiếm..."
          allowClear
          enterButton="Tìm kiếm"
          size="large"
          onSearch={(e) => {
            onSearch(e.trim());
          }}
        />
        <Select
          defaultValue="time_desc"
          style={{
            width: 160,
            height: "100%",
          }}
          allowClear
          options={filters}
          onChange={(e) => {
            setFilter(e);
          }}
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
        {searchClass && (
          <div className={styles.a1_wrapper}>
            <CardClass props={searchClass} isSearching={true}></CardClass>
          </div>
        )}

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
