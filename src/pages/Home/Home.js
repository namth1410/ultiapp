import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { Input, Select, ConfigProvider } from "antd";
import CardQuizz from "components/CardQuizz/CardQuizz";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import styles from "./Home.module.scss";

const { Search } = Input;

const Home = () => {
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
  const navigate = useNavigate();
  const [myQuizzs, setMyQuizzs] = useState(null);
  const [myQuizzsToShow, setMyQuizzsToShow] = useState(null);
  const [maybeCareQuizzs, setMaybeCareQuizzs] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filter, setFilter] = useState("time_desc");
  const [typeShow, setTypeShow] = useState("normal");

  function sortArrayByFilter(array, filter) {
    let sortedArray = [...array];

    if (filter === "asc" || filter === "desc") {
      sortedArray.sort((a, b) => {
        const nameA = a.title.toUpperCase();
        const nameB = b.title.toUpperCase();
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

  useEffect(() => {
    if (typeShow === "quizzcuaban") {
      if (searchValue === "") {
        setMyQuizzsToShow(myQuizzs);
        return;
      }
      setMyQuizzsToShow(
        myQuizzs.filter((el) => el.title.toLowerCase().includes(searchValue))
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    if (myQuizzsToShow) {
      let _myQuizzsToShow = [...myQuizzsToShow];
      _myQuizzsToShow = sortArrayByFilter(_myQuizzsToShow, filter);
      setMyQuizzsToShow(_myQuizzsToShow);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    const getDataQuizz = async (uid) => {
      const quizzsRef = collection(firestore, "quizzs");
      const querySnapshot = await getDocs(
        query(quizzsRef, where("uidCreator", "==", uid))
      );
      const quizzsData = [];
      querySnapshot?.forEach((doc) => {
        quizzsData.push({ id: doc.id, ...doc.data() });
      });
      setMyQuizzs(quizzsData);
      setMyQuizzsToShow(quizzsData);
    };

    const getMaybeCareQuizz = async (uid) => {
      const quizzsRef = collection(firestore, "quizzs");
      const querySnapshot = await getDocs(
        query(
          quizzsRef,
          where("uidCreator", "!=", uid),
          where("access", "==", "public")
        )
      );
      const quizzsData = [];
      querySnapshot?.forEach((doc) => {
        quizzsData.push({ id: doc.id, ...doc.data() });
      });

      setMaybeCareQuizzs(quizzsData);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        getDataQuizz(user.uid);
        getMaybeCareQuizz(user.uid);
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={styles.home}>
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
          <Search
            placeholder="Tìm kiếm..."
            allowClear
            enterButton="Tìm kiếm"
            size="large"
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
      </div>

      <button
        onClick={() => {
          navigate("/quizz/create-set");
        }}
        className={styles.create_quizz}
      >
        <h2>Tạo thẻ ghi nhớ</h2>
        <p>Tìm thẻ ghi nhớ, lời giải chuyên gia và nhiều hơn nữa</p>
      </button>

      {myQuizzs && typeShow !== "explore" && (
        <div className={styles.my_quizzs_wrapper}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              color: "var(--text-color-primary",
            }}
          >
            <h2>{`Danh sách quizz của bạn (${myQuizzs.length})`}</h2>
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
                    ? setTypeShow("quizzcuaban")
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
            {myQuizzsToShow.map((item, index) => {
              return index < 3 ? (
                <div key={item.id}>
                  <CardQuizz props={item} />
                </div>
              ) : (
                <></>
              );
            })}
          </div>
        </div>
      )}

      {typeShow !== "quizzcuaban" && (
        <div
          className={`${styles.my_quizzs_wrapper} ${styles.maybe_care_quizzs_wrapper}`}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Có thể bạn quan tâm</h2>
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
            {maybeCareQuizzs.map((item, index) => {
              return index < 3 ? (
                <div key={item.id}>
                  <CardQuizz props={item} />
                </div>
              ) : (
                <></>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
