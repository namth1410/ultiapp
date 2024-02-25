import {
  LeftCircleOutlined,
  RightCircleOutlined,
  RiseOutlined,
  StarFilled,
} from "@ant-design/icons";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import styles from "./Quizz.module.css";

function Quizz() {
  const { quizz_id } = useParams();

  const [dataQuizz, setDataQuizz] = useState(null);
  const [indexQuizzItem, setIndexQuizzItem] = useState(0);
  const [totalQuizzItem, setTotalQuizzItem] = useState(0);
  const [hideTerm, setHideTerm] = useState(false);

  useEffect(() => {
    console.log(dataQuizz);
  }, [dataQuizz]);

  useEffect(() => {
    const getDataQuizz = async (id) => {
      const quizzRef = doc(firestore, "quizzs", id);
      const docSnapshot = await getDoc(quizzRef);

      if (docSnapshot.exists()) {
        const quizzData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataQuizz(quizzData);
        setTotalQuizzItem(quizzData.quizz_items.length);
        setIndexQuizzItem(0);
      } else {
        console.log("Không tìm thấy quizz với id đã cho");
      }
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        getDataQuizz(quizz_id);
      } else {
        console.log("User is signed out");
      }
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.quizz_wrapper}>
      <h1>{dataQuizz?.title}</h1>
      <div
        style={{
          color: "var(--text-color-primary)",
        }}
      >
        <RiseOutlined style={{ color: "red", marginRight: "5px" }} />
        <span style={{ marginRight: "15px" }}>
          29 người học trong 1 ngày qua
        </span>
        <StarFilled style={{ color: "#FFCD1F", marginRight: "5px" }} />
        <span>5.0 (2 đánh giá)</span>
      </div>

      <div className={styles.mode_wrapper}>
        <button>Thẻ ghi nhớ</button>
        <button>Học</button>
        <button>Kiểm tra</button>
        <button>Mini games</button>
      </div>

      <div
        className={styles.flash_card_wrapper}
        onClick={() => {
          setHideTerm((pre) => !pre);
        }}
      >
        {!hideTerm && (
          <div className={styles.term_wrapper}>
            <span className={styles.text_quizz_item}>
              {dataQuizz?.quizz_items[indexQuizzItem].term}
            </span>
          </div>
        )}
        {hideTerm && (
          <div className={styles.definition_wrapper}>
            <span className={styles.text_quizz_item}>
              {dataQuizz?.quizz_items[indexQuizzItem].definition}
            </span>
          </div>
        )}
      </div>

      <div className={styles.tools_box}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LeftCircleOutlined
            onClick={() => {
              if (indexQuizzItem === 0) return;
              return setIndexQuizzItem(indexQuizzItem - 1);
            }}
            style={{ fontSize: "35px", color: "var(--text-color-primary)" }}
          />
          <span
            style={{ color: "var(--text-color-primary)", fontSize: "20px" }}
          >{`${indexQuizzItem + 1} / ${totalQuizzItem}`}</span>
          <RightCircleOutlined
            onClick={() => {
              if (indexQuizzItem === totalQuizzItem - 1) return;
              return setIndexQuizzItem(indexQuizzItem + 1);
            }}
            style={{ fontSize: "35px", color: "var(--text-color-primary)" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Quizz;
