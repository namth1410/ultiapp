import {
  CaretRightOutlined,
  EditOutlined,
  LeftCircleOutlined,
  LockOutlined,
  RightCircleOutlined,
  RiseOutlined,
  SettingOutlined,
  SoundOutlined,
  StarFilled,
  SwapOutlined,
} from "@ant-design/icons";
import { Badge, Button, Input, Modal, Rate, Select } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { normalizePartsOfSpeech, normalizePronunciation } from "ultis/func";
import { convertISOToCustomFormat } from "ultis/time";
import { auth, firestore, useAuth } from "../../firebase";
import styles from "./Quizz.module.css";

function Quizz() {
  const { quizz_id } = useParams();
  const navigate = useNavigate();
  const currentUser = useAuth();

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
  const [isEditQuizzItemModalOpen, setIsEditQuizzItemModalOpen] =
    useState(false);
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rate, setRate] = useState(0);
  const [rateComment, setRateComment] = useState("");
  const [rateOfQuizz, setRateOfQuizz] = useState(0);
  const [countRateOfQuizz, setCountRateOfQuizz] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [isLockTest, setIsLockTest] = useState(false);

  const [termEdit, setTermEdit] = useState("");
  const [definitionEdit, setDefinitionEdit] = useState("");
  const [pronunciationEdit, setPronunciationEdit] = useState("");
  const [partsOfSpeechEdit, setPartsOfSpeechEdit] = useState("");

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

  const onRate = async () => {
    const quizzRef = doc(firestore, "quizzs", quizz_id);

    const quizzDoc = await getDoc(quizzRef);
    if (!quizzDoc.exists()) {
      console.log("Quizz không tồn tại!");
      return;
    }

    const quizzData = quizzDoc.data();

    const existingRateIndex = quizzData.rates.findIndex(
      (rate) => rate.uid === currentUser.uid
    );

    if (existingRateIndex !== -1) {
      const updatedRates = [...quizzData.rates];
      updatedRates[existingRateIndex] = {
        uid: currentUser.uid,
        rate: rate,
        rateComment: rateComment,
      };

      await updateDoc(quizzRef, { rates: updatedRates });
    } else {
      const updatedRates = [
        ...quizzData.rates,
        {
          uid: currentUser.uid,
          rate: rate,
          rateComment: rateComment,
        },
      ];

      await updateDoc(quizzRef, { rates: updatedRates });
    }
    setIsRateModalOpen(false);
  };

  const onUpdateQuizzItem = async () => {
    if (termEdit === "") {
      toast.error("Không để trống thuật ngữ", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (definitionEdit === "") {
      toast.error("Không để trống thuật ngữ", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const quizzRef = doc(firestore, "quizzs", quizz_id);

    const quizzDoc = await getDoc(quizzRef);
    if (!quizzDoc.exists()) {
      console.log("Quizz không tồn tại!");
      return;
    }

    const quizzData = quizzDoc.data();

    const _quizz_items = [...quizzData.quizz_items];
    _quizz_items[indexQuizzItem] = {
      ..._quizz_items[indexQuizzItem],
      term: termEdit,
      definition: definitionEdit,
      pronunciation: pronunciationEdit,
      partsOfSpeech: partsOfSpeechEdit,
    };

    await updateDoc(quizzRef, { quizz_items: _quizz_items });
    setIsEditQuizzItemModalOpen(false);
    window.location.reload();
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
        setIsLockTest(quizzData.quizz_items.length < 5);
        setRateOfQuizz(
          quizzData.rates?.length
            ? (
                quizzData.rates.reduce(
                  (accumulator, currentValue) =>
                    accumulator + currentValue.rate,
                  0
                ) / quizzData.rates.length
              ).toFixed(1)
            : 0
        );
        setCountRateOfQuizz(quizzData.rates?.length || 0);
        const a = quizzData.rates?.find(
          (el) => el.uid === auth.currentUser.uid
        );
        setRateComment(a?.rateComment || "");

        setRate(a?.rate || 0);
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
      {dataQuizz?.quizz_items?.map((e) => (
        <img src={e.image} style={{ display: "none" }} alt="img" />
      ))}
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
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            if (currentUser.uid !== dataQuizz.uidCreator) {
              setIsRateModalOpen(true);
            }
          }}
        >
          {`${rateOfQuizz} (${countRateOfQuizz} đánh giá)`}
        </span>
      </div>

      <div className={styles.mode_wrapper}>
        <button
          onClick={() => {
            navigate(`/quizz/spell/${quizz_id}`);
          }}
        >
          Chính tả
        </button>
        <button>Học</button>

        <Badge
          count={
            isLockTest ? (
              <div
                style={{
                  width: "fit-content",
                  height: "fit-content",
                  backgroundColor: "#f5222d",
                  borderRadius: "50%",
                  padding: "5px",
                }}
              >
                <LockOutlined
                  style={{
                    color: "#fff",
                  }}
                />
              </div>
            ) : (
              0
            )
          }
        >
          <button
            onClick={() => {
              navigate(
                `/quizz/test/${quizz_id}?mode=MULTIPLE_CHOICE&quantityQuestion=5&isShuffle=false`
              );
            }}
            disabled={isLockTest}
          >
            Kiểm tra
          </button>
        </Badge>
        <button
          onClick={() => {
            navigate(`/game/${quizz_id}`);
          }}
        >
          Mini games
        </button>
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
          if (!dataQuizz) return;
          setHideTerm((pre) => !pre);
        }}
      >
        {!hideTerm && (
          <div className={styles.term_wrapper}>
            <div className={styles.actions}>
              {currentUser?.uid === dataQuizz?.uidCreator && (
                <EditOutlined
                  style={{
                    fontSize: "20px",
                    marginRight: "20px",
                    cursor: "pointer",
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const tmp = isShuffle
                      ? dataShuffleQuizz?.quizz_items[indexQuizzItem]
                      : dataQuizz?.quizz_items[indexQuizzItem];
                    setTermEdit(tmp.term);
                    setDefinitionEdit(tmp.definition);
                    setPronunciationEdit(tmp.pronunciation);
                    setPartsOfSpeechEdit(tmp.partsOfSpeech);
                    setIsEditQuizzItemModalOpen(true);
                  }}
                />
              )}

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
              <div>
                {isShuffle
                  ? dataShuffleQuizz?.quizz_items[indexQuizzItem].definition
                  : dataQuizz?.quizz_items[indexQuizzItem].definition}
              </div>
              {dataQuizz?.quizz_items[indexQuizzItem].pronunciation !== "" && (
                <div style={{ fontSize: "25px", color: "#3d3d3d" }}>
                  {isShuffle
                    ? normalizePronunciation(
                        dataShuffleQuizz?.quizz_items[indexQuizzItem]
                          .pronunciation
                      )
                    : normalizePronunciation(
                        dataQuizz?.quizz_items[indexQuizzItem].pronunciation
                      )}
                </div>
              )}
            </span>
            <img
              alt="img"
              src={
                isShuffle
                  ? dataShuffleQuizz?.quizz_items[indexQuizzItem].image
                  : dataQuizz?.quizz_items[indexQuizzItem].image
              }
              style={{
                display: isShuffle
                  ? dataShuffleQuizz?.quizz_items[indexQuizzItem].image
                    ? "block"
                    : "none"
                  : dataQuizz?.quizz_items[indexQuizzItem].image
                  ? "block"
                  : "none",
                maxWidth: "250px",
              }}
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
          {currentUser?.uid === dataQuizz?.uidCreator && (
            <EditOutlined
              onClick={() => {
                navigate(`/quizz/edit-set/${quizz_id}`);
              }}
              style={{
                fontSize: "35px",
                color: "var(--text-color-primary)",
                display: isOwner ? "inline-flex" : "none",
              }}
            />
          )}
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
              {dataQuizz
                ? `Tạo vào ${convertISOToCustomFormat(dataQuizz?.dateCreate)}`
                : ""}
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

      <Modal
        title="Sửa"
        footer={(_) => (
          <Button type="primary" onClick={onUpdateQuizzItem}>
            Lưu
          </Button>
        )}
        open={isEditQuizzItemModalOpen}
        onCancel={() => {
          setIsEditQuizzItemModalOpen(false);
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Input
            size="large"
            value={termEdit}
            onChange={(e) => setTermEdit(e.target.value)}
            placeholder="Nhập thuật ngữ"
          />
          <Input
            size="large"
            value={definitionEdit}
            onChange={(e) => setDefinitionEdit(e.target.value)}
            placeholder="Nhập định nghĩa"
          />
          <Input
            size="large"
            value={pronunciationEdit}
            onChange={(e) => setPronunciationEdit(e.target.value)}
            placeholder="Nhập phiên âm"
          />
          <Input
            size="large"
            value={partsOfSpeechEdit}
            onChange={(e) => setPartsOfSpeechEdit(e.target.value)}
            placeholder="Nhập từ loại"
          />
        </div>
      </Modal>

      <Modal
        title="Bạn đánh giá quizz này như thế nào?"
        footer={(_) => (
          <Button type="primary" onClick={onRate}>
            Gửi
          </Button>
        )}
        open={isRateModalOpen}
        onCancel={() => {
          setIsRateModalOpen(false);
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          <Rate value={rate} onChange={(e) => setRate(e)} />
          <Input
            size="large"
            value={rateComment}
            onChange={(e) => setRateComment(e.target.value)}
            placeholder="Nhập đánh giá"
          />
        </div>
      </Modal>
    </div>
  );
}

const Item = ({ props, voice }) => {
  const { term, definition, pronunciation, partsOfSpeech } = props;
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
      <div style={{ width: "180px" }}>
        <div>{term}</div>
        {pronunciation !== "" && (
          <div>{normalizePronunciation(pronunciation)}</div>
        )}
      </div>
      <div
        style={{ height: "40px", width: "2px", backgroundColor: "#f6f7fb" }}
      ></div>

      {partsOfSpeech !== "" && (
        <span style={{ paddingLeft: "10px", fontWeight: "bold" }}>
          {normalizePartsOfSpeech(partsOfSpeech)}
        </span>
      )}
      <span style={{ paddingLeft: "10px", fontWeight: "bold" }}>
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
