import { Button, Modal, Spin } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useExam } from "../ExamContext";
import Part1 from "../Part1/Part1";
import Part2 from "../Part2/Part2";
import Part3 from "../Part3/Part3";
import styles from "./Test.module.css";

function Exam() {
  const navigate = useNavigate();

  const indexToPart = () => {
    if (indexQuestion < 6) {
      return 1;
    } else if (indexQuestion < 31) {
      return 2;
    } else if (indexQuestion < 70) {
      return 3;
    } else {
      return 4;
    }
  };

  const {
    indexQuestion,
    setIndexQuestion,
    isReady,
    setIsReady,
    onSubmit,
    answer,
    dataExam,
    isShowKey,
    setIsShowKey,
  } = useExam();
  const [part, setPart] = useState(indexToPart());
  const [isLoading, setIsLoading] = useState(false);
  const [isRunning, setIsRunning] = useState(true);
  const [isModalResultOpen, setIsModalResultOpen] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    setPart(indexToPart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuestion]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_1}>
        <div className={styles.title_flex}>
          <div
            style={{ color: "var(--blue)", fontSize: "26px" }}
          >{`PART ${part}`}</div>

          {isShowKey ? (
            <div
              style={{
                display: "flex",
                gap: "10px",
              }}
            >
              {indexQuestion !== 0 && (
                <button
                  style={{
                    border: "none",
                    padding: "15px 20px",
                    color: "#fff",
                    fontSize: "20px",
                    backgroundColor: "var(--blue)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "Gilroy",
                  }}
                  onClick={() => {
                    if (indexQuestion > 30) {
                      setIndexQuestion(indexQuestion - 3);
                    } else {
                      setIndexQuestion(indexQuestion - 1);
                    }
                  }}
                >
                  Câu trước
                </button>
              )}
              {indexQuestion !== 99 && (
                <button
                  style={{
                    border: "none",
                    padding: "15px 20px",
                    color: "#fff",
                    fontSize: "20px",
                    backgroundColor: "var(--blue)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "Gilroy",
                  }}
                  onClick={() => {
                    if (indexQuestion > 30) {
                      setIndexQuestion(indexQuestion + 3);
                    } else {
                      setIndexQuestion(indexQuestion + 1);
                    }
                  }}
                >
                  Câu tiếp
                </button>
              )}
            </div>
          ) : (
            <></>
          )}

          {isShowKey && isReady && (
            <button
              style={{
                border: "none",
                padding: "15px 20px",
                color: "#fff",
                fontSize: "20px",
                backgroundColor: "var(--blue)",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "Gilroy",
              }}
              onClick={() => {
                Swal.fire({
                  title: "Bạn có muốn nộp bài không?",
                  showDenyButton: true,
                  confirmButtonText: "Nộp",
                  denyButtonText: `Hủy`,
                }).then((result) => {
                  if (result.isConfirmed) {
                    setIsLoading(true);
                    setIsRunning(false);
                    onSubmit().then((_result) => {
                      setIsLoading(false);
                      setIsModalResultOpen(true);
                      setResult(_result);
                    });
                  } else if (result.isDenied) {
                    return;
                  }
                });
              }}
            >
              Nộp bài
            </button>
          )}

          {dataExam && !isShowKey && isReady && (
            <Timer
              initialTime={120 * 60000}
              countdown={true}
              isRunning={isRunning}
            />
          )}

          {dataExam && isShowKey && (
            <button
              style={{
                border: "none",
                padding: "15px 20px",
                color: "#fff",
                fontSize: "20px",
                backgroundColor: "var(--blue)",
                borderRadius: "8px",
                cursor: "pointer",
                fontFamily: "Gilroy",
              }}
              onClick={() => {
                navigate("/online");
              }}
            >
              Thoát
            </button>
          )}

          <div
            style={{
              padding: "25px 40px",
              backgroundColor: "var(--blue)",
              color: "#fff",
              borderRadius: "8px",
            }}
          >
            {`${answer.filter((el) => el !== 0).length}/100`}
          </div>
        </div>

        {isReady && !!dataExam ? (
          <div>
            {indexQuestion < 6 && <Part1 />}
            {indexQuestion < 31 && indexQuestion > 5 && <Part2 />}
            {indexQuestion >= 31 && <Part3 />}
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setIsReady(true);
              }}
            >
              Bắt đầu
            </button>
          </div>
        )}
      </div>

      <Modal
        title="Hòan thành bài kiểm tra"
        open={isModalResultOpen}
        onOk={() => {
          setIsModalResultOpen(false);
          navigate("/online");
        }}
        onCancel={() => {
          setIsModalResultOpen(false);
          navigate("/online");
        }}
        footer={(_, { OkBtn }) => (
          <>
            <Button
              onClick={() => {
                setIsShowKey(true);
                setIndexQuestion(0);
                setIsModalResultOpen(false);
              }}
            >
              Xem đáp án
            </Button>
            <OkBtn />
          </>
        )}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            fontSize: "16px",
          }}
        >
          <div>
            <span>Số câu đúng: </span>
            <span>{`${result?.countCorrect}/100`}</span>
          </div>

          <div>
            <span>Part 1: </span>
            <span>{`${result?.countCorrectPart1}/6`}</span>
          </div>

          <div>
            <span>Part 2: </span>
            <span>{`${result?.countCorrectPart2}/25`}</span>
          </div>

          <div>
            <span>Part 3: </span>
            <span>{`${result?.countCorrectPart3}/39`}</span>
          </div>

          <div>
            <span>Part 4: </span>
            <span>{`${result?.countCorrectPart4}/30`}</span>
          </div>
        </div>
      </Modal>

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
    </div>
  );
}

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

  const hoursStr = String(hours).padStart(2, "0");
  const minutesStr = String(minutes).padStart(2, "0");
  const secondsStr = String(seconds).padStart(2, "0");

  return (
    <div
      style={{
        border: "none",
        padding: "15px 20px",
        color: "#fff",
        fontSize: "20px",
        backgroundColor: "var(--blue)",
        borderRadius: "8px",
        cursor: "pointer",
        fontFamily: "Gilroy",
        width: "80px",
        textAlign: "center",
      }}
    >
      <p>
        {hoursStr}:{minutesStr}:{secondsStr}
      </p>
    </div>
  );
}

Timer.propTypes = {
  initialTime: PropTypes.any,
  countdown: PropTypes.any,
  isRunning: PropTypes.any,
};

export default Exam;
