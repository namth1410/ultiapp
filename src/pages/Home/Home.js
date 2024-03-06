import { RightOutlined } from "@ant-design/icons";
import CardQuizz from "components/CardQuizz/CardQuizz";
import CardClass from "components/CardClass/CardClass";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const [myQuizzs, setMyQuizzs] = useState([]);
  const [maybeCareQuizzs, setMaybeCareQuizzs] = useState([]);
  const [myClasses, setMyClasses] = useState([]);

  useEffect(() => {
    console.log(myQuizzs);
  }, [myQuizzs]);

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

    const getMyClasses = async (uid) => {
      const classesRef = collection(firestore, "classes");
      const querySnapshot = await getDocs(
        query(classesRef, where("members", "array-contains", uid))
      );
      const classesData = [];
      querySnapshot?.forEach((doc) => {
        classesData.push({ id: doc.id, ...doc.data() });
      });

      console.log(classesData);

      setMyClasses(classesData);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        getDataQuizz(user.uid);
        getMaybeCareQuizz(user.uid);
        getMyClasses(user.uid);
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
      <button
        onClick={() => {
          navigate("/create-set");
        }}
        className={styles.create_quizz}
      >
        <h2>Tạo thẻ ghi nhớ</h2>
        <p>Tìm thẻ ghi nhớ, lời giải chuyên gia và nhiều hơn nữa</p>
      </button>

      <button
        onClick={() => {
          navigate("/create-class");
        }}
        className={styles.create_quizz}
      >
        <h2>Tạo lớp học</h2>
        <p>Giao bài tập, theo dõi kết quả người làm</p>
      </button>

      <div className={styles.my_quizzs_wrapper}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Danh sách quizz của bạn</h2>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
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
          {myQuizzs.map((item, index) => {
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

      <div
        className={`${styles.my_quizzs_wrapper} ${styles.maybe_care_quizzs_wrapper}`}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Có thể bạn quan tâm</h2>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
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

      <div
        className={`${styles.my_quizzs_wrapper} ${styles.maybe_care_quizzs_wrapper}`}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Lớp học bạn đã tham gia</h2>
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
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
          {myClasses.map((item, index) => {
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
    </div>
  );
};

export default Home;
