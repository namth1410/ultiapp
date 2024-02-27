import { RightOutlined } from "@ant-design/icons";
import CardQuizz from "components/CardQuizz/CardQuizz";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const [myQuizzs, setMyQuizzs] = useState([]);

  useEffect(() => {
    console.log(myQuizzs);
  }, [myQuizzs]);

  useEffect(() => {
    const getDataQuizz = async (uid) => {
      const quizzsRef = collection(firestore, "quizzs");
      const querySnapshot = await getDocs(
        query(quizzsRef, where("uidCreator", "==", uid))
      );
      console.log(querySnapshot);
      const quizzsData = [];
      querySnapshot.forEach((doc) => {
        quizzsData.push({ id: doc.id, ...doc.data() });
      });

      setMyQuizzs(quizzsData);
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        getDataQuizz(user.uid);
      } else {
        console.log("User is signed out");
      }
    });

    return () => unsubscribe();
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
    </div>
  );
};

export default Home;
