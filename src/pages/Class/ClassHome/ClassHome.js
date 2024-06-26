import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Input, Select, ConfigProvider } from "antd";
import CardClass from "components/CardClass/CardClass";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./ClassHome.module.scss";

import {
  getClassById,
  getUserCreatedClasses,
  getUserJoinedClasses,
} from "appdata/classes/classesSlice";
import { useNavigate } from "react-router-dom";

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
  const [userCreatedClassesToShow, setUserCreatedClassesToShow] =
    useState(null);
  const [userJoinedClasses, setUserJoinedClasses] = useState(null);
  const [userJoinedClassesToShow, setUserJoinedClassesToShow] = useState(null);
  const [filter, setFilter] = useState("time_desc");
  const [typeShow, setTypeShow] = useState("normal");
  const [searchValue, setSearchValue] = useState("");

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

  const onSearch = (value) => {
    if (typeShow === "normal") {
      dispatch(getClassById({ id: value }));
    }
  };

  useEffect(() => {
    setSearchClass(null);
    if (typeShow === "lopbantao") {
      if (searchValue === "") {
        setUserCreatedClassesToShow(userCreatedClasses);
        return;
      }
      setUserCreatedClassesToShow(
        userCreatedClasses.filter((el) =>
          el.nameClass.toLowerCase().includes(searchValue)
        )
      );
    }
    if (typeShow === "lopbanthamgia") {
      if (searchValue === "") {
        setUserJoinedClassesToShow(userJoinedClasses);
        return;
      }
      setUserJoinedClassesToShow(
        userJoinedClasses.filter((el) =>
          el.nameClass.toLowerCase().includes(searchValue)
        )
      );
    }
    let a = null;
    if (typeShow === "normal") {
      a = setTimeout(() => {
        dispatch(getClassById({ id: searchValue }));
      }, 1000);
    }

    return () => clearTimeout(a);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    if (userCreatedClasses) {
      let _userCreatedClassesToShow = [...userCreatedClassesToShow];
      _userCreatedClassesToShow = sortArrayByFilter(
        _userCreatedClassesToShow,
        filter
      );
      setUserCreatedClassesToShow(_userCreatedClassesToShow);
    }

    if (userJoinedClasses) {
      let _userJoinedClassesToShow = [...userJoinedClassesToShow];
      _userJoinedClassesToShow = sortArrayByFilter(
        _userJoinedClassesToShow,
        filter
      );
      setUserJoinedClassesToShow(_userJoinedClassesToShow);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    setUserCreatedClasses(classesRedux.userCreatedClasses || []);
    setUserCreatedClassesToShow(classesRedux.userCreatedClasses || []);
    setUserJoinedClasses(classesRedux.userJoinedClasses || []);
    setUserJoinedClassesToShow(classesRedux.userJoinedClasses || []);
    setSearchClass(classesRedux.searchClass || null);
  }, [classesRedux]);

  useEffect(() => {
    dispatch(getUserCreatedClasses());
    dispatch(getUserJoinedClasses());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tools}>
        <ConfigProvider
          theme={{
            token: {
              inputFontSize: "26",
              colorText: "var(--text-color-primary)",
              colorTextPlaceholder: "var(--text-color-secondary)",
              colorBorder: "var(--text-color-primary)",
              colorBgContainer: "var(--body-background)",
            },
            components: {
              Select: {
                optionSelectedColor: "var(--primary-color)",
                selectorBg: "var(--body-background)",
                colorText: "#000",
              },
            },
          }}
        >
          <Input.Search
            placeholder="Tìm kiếm..."
            allowClear
            enterButton="Tìm kiếm"
            size="large"
            onSearch={(e) => {
              onSearch(e.trim());
            }}
            activeBorderColor="red"
            onChange={(e) => {
              setSearchValue(e.target.value);
            }}
            className={styles.search_tool}
          />
          <Select
            defaultValue="time_desc"
            className={styles.filter_tool}
            options={filters}
            onChange={(e) => {
              setFilter(e);
            }}
          />
        </ConfigProvider>

        <Button
          size="large"
          type="primary"
          style={{
            background: "#1e88e5",
            fontFamily: "Gilroy",
            width: "fit-content",
            height: "100%",
            padding: "calc(10 * 100vw / 1920) calc(20 * 100vw / 1920)",
          }}
          onClick={() => {
            navigate("/class/create-class");
          }}
          className={styles.create_class_btn}
        >
          + Tạo lớp học
        </Button>
      </div>
      <div className={styles.list_wrapper}>
        {searchValue !== "" && (
          <div style={{ padding: "0px 32px", color: "#1e88e5" }}>{`${
            searchClass ? 1 : 0
          } kết quả`}</div>
        )}
        {searchClass && (
          <div className={styles.a1_wrapper}>
            <CardClass props={searchClass} isSearching={true}></CardClass>
          </div>
        )}

        {userCreatedClasses && typeShow !== "lopbanthamgia" && (
          <div className={styles.a1_wrapper}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h2>{`Lớp bạn tạo (${userCreatedClasses.length})`}</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {typeShow !== "normal" && (
                  <LeftOutlined style={{ color: "var(--primary-color)" }} />
                )}
                <button
                  className={styles.expand_btn}
                  onClick={() => {
                    return typeShow === "normal"
                      ? setTypeShow("lopbantao")
                      : setTypeShow("normal");
                  }}
                >
                  {typeShow === "normal" ? "Xem thêm" : "Quay lại"}
                </button>
                {typeShow === "normal" && (
                  <RightOutlined style={{ color: "var(--primary-color)" }} />
                )}
              </div>
            </div>
            <div
              className={`${styles.quizzs} ${
                typeShow !== "normal" && styles.mode_expand
              }`}
            >
              {userCreatedClassesToShow.map((item, index) => {
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

        {userJoinedClasses && typeShow !== "lopbantao" && (
          <div className={styles.a1_wrapper}>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <h2>{`Lớp bạn tham gia (${userJoinedClasses.length})`}</h2>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                {typeShow !== "normal" && (
                  <LeftOutlined style={{ color: "var(--primary-color)" }} />
                )}
                <button
                  className={styles.expand_btn}
                  onClick={() => {
                    return typeShow === "normal"
                      ? setTypeShow("lopbanthamgia")
                      : setTypeShow("normal");
                  }}
                >
                  {typeShow === "normal" ? "Xem thêm" : "Quay lại"}
                </button>
                {typeShow === "normal" && (
                  <RightOutlined style={{ color: "var(--primary-color)" }} />
                )}
              </div>
            </div>
            <div
              className={`${styles.quizzs} ${
                typeShow !== "normal" && styles.mode_expand
              }`}
            >
              {userJoinedClassesToShow.map((item, index) => {
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
