import {
  CaretRightOutlined,
  EditOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  RiseOutlined,
  SettingOutlined,
  SoundOutlined,
  StarFilled,
  SwapOutlined,
} from "@ant-design/icons";
import { Image, Modal, Select } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { auth, firestore } from "../../firebase";
import styles from "./Quizz.module.css";

function Quizz() {
  const { quizz_id } = useParams();
  const navigate = useNavigate();

  const infoUser = JSON.parse(localStorage.getItem("ulti_user"));

  const [dataQuizz, setDataQuizz] = useState(null);
  const [dataShuffleQuizz, setDataShuffleQuizz] = useState(null);
  const [indexQuizzItem, setIndexQuizzItem] = useState(0);
  const [totalQuizzItem, setTotalQuizzItem] = useState(0);
  const [hideTerm, setHideTerm] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [access, setAccess] = useState("public");
  const [voice, setVoice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  const handleVoiceChange = (event) => {
    const voices = window.speechSynthesis.getVoices();
    setVoice(voices.find((v) => v.name === event.target.value));
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
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

      const cancelCurrentUtterance = () => {
        if (synth && synth.speaking && u) {
          synth.cancel();
        }
      };

      return () => {
        cancelCurrentUtterance();
      };
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
        if (auth.currentUser.uid === quizzData.uidCreator) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
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
        <button
          onClick={() => {
            navigate(
              `/quizz/test/${quizz_id}?mode=MULTIPLE_CHOICE&quantityQuestion=5&isShuffle=false`
            );
          }}
        >
          Kiểm tra
        </button>
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

      <button
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
            <Image
              preview={false}
              width="40%"
              src={
                isShuffle
                  ? dataShuffleQuizz?.quizz_items[indexQuizzItem].image
                  : dataQuizz?.quizz_items[indexQuizzItem].image
              }
            />
          </div>
        )}
      </button>

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

        <div style={{ display: "flex", gap: "15px" }}>
          <EditOutlined
            onClick={() => {
              navigate(`/edit-set/${quizz_id}`);
            }}
            style={{
              fontSize: "35px",
              color: "var(--text-color-primary)",
              display: isOwner ? "inline-flex" : "none",
            }}
          />
          <SettingOutlined
            onClick={() => {
              showModal();
            }}
            style={{ fontSize: "35px", color: "var(--text-color-primary)" }}
          />
        </div>
      </div>

      <div className={styles.devider}></div>

      <div className={styles.extensions}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <img
            style={{
              objectFit: "cover",
              width: "50px",
              borderRadius: "50%",
            }}
            src={infoUser.profilePic}
            alt="Notification Icon"
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              overflow: "hidden",
              marginLeft: "20px",
              gap: "5px",
            }}
          >
            <span>{infoUser.name}</span>
            <span
              style={{
                fontWeight: "500",
                width: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {infoUser.email}
            </span>
          </div>
        </div>
      </div>

      {dataQuizz?.quizz_items && (
        <div className={styles.detail_quizz}>
          <h2>{`Thuật ngữ trong học phần này (${totalQuizzItem})`}</h2>
          <div>
            {dataQuizz?.quizz_items.map((item) => {
              return <Item key={item} props={item} voice={voice} />;
            })}
          </div>
        </div>
      )}

      <Modal
        title="Xác nhận nộp bài"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <div style={{}}>
          <span style={{ marginRight: "10px" }}>Quyền truy cập</span>
          <Select
            defaultValue={access}
            style={{
              width: "auto",
            }}
            onChange={(value) => {
              setAccess(value);
            }}
          >
            <Select.Option value="public">Mọi người</Select.Option>
            <Select.Option value="password">Người có mật khẩu</Select.Option>
            <Select.Option value="private">Chỉ mình tôi</Select.Option>
          </Select>
        </div>
        <p>Có câu chưa làm !!!</p>
        <p>Bạn có muốn nộp bài không?</p>
      </Modal>
    </div>
  );
}

const Item = ({ props, voice }) => {
  const { term, definition } = props;
  return (
    <div
      style={{
        display: "flex",
        padding: "15px",
        boxShadow: "0 0.25rem 1rem 0 #282e3e14",
        backgroundColor: "#fff",
        borderRadius: "0.5rem",
        alignItems: "center",
        color: "#1a1d28",
        fontWeight: "500",
      }}
    >
      <span style={{ width: "180px" }}>{term}</span>
      <div
        style={{ height: "40px", width: "2px", backgroundColor: "#f6f7fb" }}
      ></div>
      <span style={{ paddingLeft: "20px", fontWeight: "bold" }}>
        {definition}
      </span>

      <div style={{ marginLeft: "auto" }}>
        <SoundOutlined
          style={{
            fontSize: "20px",
          }}
          onClick={(e) => {
            e.stopPropagation();
            const synth = window.speechSynthesis;
            const u = new SpeechSynthesisUtterance(term);

            u.voice = voice;
            synth.speak(u);
          }}
        />
      </div>
    </div>
  );
};

Item.propTypes = {
  props: PropTypes.object,
  term: PropTypes.string,
  definition: PropTypes.string,
  voice: PropTypes.any,
};

export default Quizz;
