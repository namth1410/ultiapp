import { RightOutlined } from "@ant-design/icons";
import CardQuizz from "components/CardQuizz/CardQuizz";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import styles from "./Home.module.scss";

const Home = () => {
  const navigate = useNavigate();
  const [myQuizzs, setMyQuizzs] = useState(null);
  const [maybeCareQuizzs, setMaybeCareQuizzs] = useState([]);

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
      <button
        onClick={() => {
          navigate("/quizz/create-set");
        }}
        className={styles.create_quizz}
      >
        <h2>Tạo thẻ ghi nhớ</h2>
        <p>Tìm thẻ ghi nhớ, lời giải chuyên gia và nhiều hơn nữa</p>
      </button>

      {myQuizzs && (
        <div className={styles.my_quizzs_wrapper}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>Danh sách quizz của bạn</h2>
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
      )}

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
    </div>
  );
};

export default Home;
