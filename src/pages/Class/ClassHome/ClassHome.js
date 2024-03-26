import { RightOutlined } from "@ant-design/icons";
import { Button, Input, Select } from "antd";
import CardClass from "components/CardClass/CardClass";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ClassHome.module.css";

import { getUserCreatedClasses } from "appdata/classes/classesSlice";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../../firebase";
const { Search } = Input;

function ClassHome() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const classesRedux = useSelector((state) => state.classesRedux);

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
    _userCreatedClasses = sortArrayByFilter(_userCreatedClasses, filter);
    setUserCreatedClasses(_userCreatedClasses);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    setUserCreatedClasses(classesRedux.userCreatedClasses || []);
    setUserJoinedClasses(classesRedux.userJoinedClasses || []);
  }, [classesRedux]);

  useEffect(() => {
    dispatch(getUserCreatedClasses());
    // dispatch(getUserJoinedClasses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
