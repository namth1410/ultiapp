import {
  CaretRightOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  RiseOutlined,
  SettingOutlined,
  SoundOutlined,
  StarFilled,
  SwapOutlined,
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
  const [dataShuffleQuizz, setDataShuffleQuizz] = useState(null);
  const [indexQuizzItem, setIndexQuizzItem] = useState(0);
  const [totalQuizzItem, setTotalQuizzItem] = useState(0);
  const [hideTerm, setHideTerm] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);

  const [voice, setVoice] = useState(null);

  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices.find((v) => v.name === event.target.value));
  };

  useEffect(() => {
    if (isShuffle && dataQuizz?.quizz_items) {
      const shuffledArray = [...dataQuizz.quizz_items].sort(
        () => Math.random() - 0.5
      );
      let _dataQuizz = { ...dataQuizz };
      _dataQuizz.quizz_items = shuffledArray;

      setDataShuffleQuizz(_dataQuizz);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShuffle]);

  useEffect(() => {
    const synth = window.speechSynthesis;
    if (dataQuizz && !hideTerm) {
      const u = new SpeechSynthesisUtterance(
        isShuffle
          ? dataShuffleQuizz?.quizz_items[indexQuizzItem].term
          : dataQuizz?.quizz_items[indexQuizzItem].term
      );

      u.voice = voice;
      synth.speak(u);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuizzItem]);

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

    const synth = window.speechSynthesis;
    const voices = synth.getVoices();

    setVoice(voices[0]);

    return () => {
      synth.cancel();
      unsubscribe();
    };
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

      <div style={{ marginTop: "20px" }}>
        <span
          style={{ color: "var(--text-color-primary)", marginRight: "10px" }}
        >
          Giọng đọc
        </span>
        <select
          style={{
            padding: "10px",
            borderRadius: "10px",
            fontFamily: "Gilroy",
          }}
          value={voice?.name}
          onChange={handleVoiceChange}
        >
          {window.speechSynthesis.getVoices().map((voice) => (
            <option key={voice.name} value={voice.name}>
              {voice.name}
            </option>
          ))}
        </select>
      </div>

      <div
        className={styles.flash_card_wrapper}
        onClick={() => {
          setHideTerm((pre) => !pre);
        }}
      >
        {!hideTerm && (
          <div className={styles.term_wrapper}>
            <div className={styles.actions}>
              <SoundOutlined
                style={{
                  fontSize: "20px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  const synth = window.speechSynthesis;
                  const u = new SpeechSynthesisUtterance(
                    isShuffle
                      ? dataShuffleQuizz?.quizz_items[indexQuizzItem].term
                      : dataQuizz?.quizz_items[indexQuizzItem].term
                  );

                  u.voice = voice;
                  synth.speak(u);
                }}
              />
            </div>
            <span className={styles.text_quizz_item}>
              {isShuffle
                ? dataShuffleQuizz?.quizz_items[indexQuizzItem].term
                : dataQuizz?.quizz_items[indexQuizzItem].term}
            </span>
          </div>
        )}
        {hideTerm && (
          <div className={styles.definition_wrapper}>
            <span className={styles.text_quizz_item}>
              {isShuffle
                ? dataShuffleQuizz?.quizz_items[indexQuizzItem].definition
                : dataQuizz?.quizz_items[indexQuizzItem].definition}
            </span>
          </div>
        )}
      </div>

      <div className={styles.tools_box}>
        <div style={{ display: "flex", gap: "15px" }}>
          <CaretRightOutlined
            onClick={() => {}}
            style={{ fontSize: "35px", color: "var(--text-color-primary)" }}
          />
          <SwapOutlined
            onClick={() => {
              setIsShuffle(!isShuffle);
            }}
            style={{
              fontSize: "35px",
              color: isShuffle ? "red" : "var(--text-color-primary)",
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <LeftCircleOutlined
            onClick={() => {
              if (indexQuizzItem === 0) return;
              setIndexQuizzItem(indexQuizzItem - 1);
              setHideTerm(false);
            }}
            style={{
              fontSize: "40px",
              color:
                indexQuizzItem === 0 ? "#E7EAF1" : "var(--text-color-primary)",
            }}
          />
          <span
            style={{ color: "var(--text-color-primary)", fontSize: "20px" }}
          >{`${indexQuizzItem + 1} / ${totalQuizzItem}`}</span>
          <RightCircleOutlined
            onClick={() => {
              if (indexQuizzItem === totalQuizzItem - 1) return;
              setIndexQuizzItem(indexQuizzItem + 1);
              setHideTerm(false);
            }}
            style={{
              fontSize: "40px",
              color:
                indexQuizzItem === totalQuizzItem - 1
                  ? "#E7EAF1"
                  : "var(--text-color-primary)",
            }}
          />
        </div>

        <div style={{ display: "flex" }}>
          <SettingOutlined
            onClick={() => {}}
            style={{ fontSize: "35px", color: "var(--text-color-primary)" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Quizz;
