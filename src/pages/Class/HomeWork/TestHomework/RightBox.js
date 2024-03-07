import { Button, Modal, Radio, Spin } from "antd";
import { addDoc, collection } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../../../firebase";
import styles from "./RightBox.module.css";

function RightBox({ dataHomework }) {
  const navigate = useNavigate();

  const [selectedIndexAnswer, setSelectedIndexAnswer] = useState(null);
  const [value, setValue] = useState(0);
  const [myAnswer, setMyAnswer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const onChange = (e) => {
    setValue(e.target.value);
    let _myAnswer = [...myAnswer];
    _myAnswer[selectedIndexAnswer] = e.target.value;
    setMyAnswer(_myAnswer);
  };

  const onClickCube = (index) => {
    if (index === selectedIndexAnswer) return;
    setSelectedIndexAnswer(index);
    setValue(myAnswer[index] || 0);
  };

  const onHandleSubmit = async () => {
    setIsLoading(true);
    const elapsedTime = new Date().getTime() - startTime;
    setIsTimerRunning(false);
    const dataToAdd = {
      dateCreate: new Date().toISOString(),
      userUid: auth.currentUser.uid,
      username: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      homework_id: dataHomework.id,
      class: dataHomework.class,
      correctAnswer: dataHomework.correctAnswer,
      answer: myAnswer,
      fileURL: dataHomework.fileURL,
      timeSpent: elapsedTime,
    };
    console.log(dataToAdd);
    const docRef = await addDoc(
      collection(firestore, "homework_results"),
      dataToAdd
    );

    setIsLoading(false);
    const url = window.location.pathname.replace("test", `detail/${docRef.id}`);
    navigate(url);
  };

  useEffect(() => {
    if (!dataHomework) return;
    console.log(dataHomework);
    setMyAnswer(dataHomework.correctAnswer.map(() => " "));
    setStartTime(new Date().getTime());
  }, [dataHomework]);

  return (
    <>
      <div className={styles.time_wrapper}>
        <div style={{ fontWeight: "500" }}>Thời gian làm bài</div>
        {dataHomework && (
          <Timer
            initialTime={
              dataHomework.config.timeLimit
                ? dataHomework.config.timeLimit * 60000
                : 0
            }
            countdown={dataHomework.config.timeLimit}
            isRunning={isTimerRunning}
          />
        )}
      </div>

      <div className={styles.name_homework_wrapper}>
        {dataHomework.nameHomework}
      </div>

      <div className={styles.answer_wrapper}>
        <div>Phiếu trả lời</div>
        <div className={styles.answer}>
          {dataHomework.correctAnswer.map((el, index) => {
            return (
              <CubeAnswer
                key={index}
                index={index}
                onClick={() => {
                  onClickCube(index);
                }}
                selectedIndexAnswer={selectedIndexAnswer}
                answer={myAnswer?.[index]}
              />
            );
          })}
        </div>
        <Radio.Group
          style={{ marginTop: "20px" }}
          onChange={onChange}
          value={value}
          disabled={selectedIndexAnswer == null}
        >
          <Radio value={"A"}>A</Radio>
          <Radio value={"B"}>B</Radio>
          <Radio value={"C"}>C</Radio>
          <Radio value={"D"}>D</Radio>
        </Radio.Group>

        <div className={styles.footer}>
          <Button
            size="large"
            style={{
              fontFamily: "Gilroy",
              padding: "15px 30px",
              height: "auto",
              backgroundColor: "#e0e0e0",
            }}
          >
            Rời khỏi
          </Button>
          <Button
            type="primary"
            size="large"
            style={{
              fontFamily: "Gilroy",
              padding: "15px 30px",
              height: "auto",
            }}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            Nộp bài
          </Button>
        </div>
      </div>

      <Modal
        title="Bạn có chắc chắn muốn nộp bài?"
        open={isModalOpen}
        onOk={onHandleSubmit}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      ></Modal>
      {isLoading && (
        <>
          <div className="overlay"></div>
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              translate: "-50% -20%",
              zIndex: 3000,
              width: "200px",
              height: "200px",
            }}
          >
            <Spin size="large">
              <div className="content" />
            </Spin>
          </div>
        </>
      )}
    </>
  );
}

const CubeAnswer = ({ index, onClick, selectedIndexAnswer, answer }) => {
  return (
    <button
      style={{
        position: "relative",
        margin: "8px",
        border: "none",
        backgroundColor: "#fff",
      }}
      onClick={onClick}
    >
      <div
        style={{
          borderRadius: "2px",
          width: "2.85rem",
          height: "2.85rem",
          border:
            selectedIndexAnswer === index
              ? "2px solid #1e88e5"
              : "1px solid rgb(216, 220, 240)",
          cursor: "pointer",
          backgroundColor: answer?.trim().length > 0 ? "#e3f2fd" : "none",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
        }}
      >
        <p>{`${index + 1}`}</p>
        {answer?.trim().length > 0 && <p>{`:${answer}`}</p>}
      </div>
    </button>
  );
};

RightBox.propTypes = {
  dataHomework: PropTypes.any,
};
CubeAnswer.propTypes = {
  index: PropTypes.any,
  onClick: PropTypes.func,
  selectedIndexAnswer: PropTypes.any,
  answer: PropTypes.any,
};

function Timer({ initialTime, countdown, isRunning }) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        if (countdown) {
          setTime((prevTime) => prevTime - 1000);
        } else {
          setTime((prevTime) => prevTime + 1000);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning, countdown]);

  const hours = Math.floor((time / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((time / (1000 * 60)) % 60);
  const seconds = Math.floor((time / 1000) % 60);

  return (
    <div>
      <p>
        {hours} giờ {minutes} phút {seconds} giây
      </p>
    </div>
  );
}

Timer.propTypes = {
  initialTime: PropTypes.any,
  countdown: PropTypes.any,
  isRunning: PropTypes.any,
};

export default RightBox;
