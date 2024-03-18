import { Button, Modal, Spin } from "antd";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useExam } from "../ExamContext";
import Part1 from "../Part1/Part1";
import Part2 from "../Part2/Part2";
import Part3 from "../Part3/Part3";
import Part5 from "../Part5/Part5";
import Part6 from "../Part6/Part6";
import Part7 from "../Part7/Part7";
import styles from "./Test.module.css";

function Exam() {
  const navigate = useNavigate();
  const counts = [0, 6, 31, 70, 100, 130, 146, 200];
  let urlParams = new URLSearchParams(window.location.search);
  let parts = urlParams.get("parts")?.split("").map(Number);
  const indexToPart = () => {
    if (indexQuestion < 6) {
      return 1;
    } else if (indexQuestion < 31) {
      return 2;
    } else if (indexQuestion < 70) {
      return 3;
    } else if (indexQuestion < 100) {
      return 4;
    } else if (indexQuestion < 130) {
      return 5;
    } else if (indexQuestion < 146) {
      return 6;
    } else {
      return 7;
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
  const [canNext, setCanNext] = useState(false);
  const [canBack, setCanBack] = useState(false);
  const [result, setResult] = useState(null);

  const isPivotTopFunc = () => {
    let addTo = 0;
    if (part === 3 || part === 4) {
      addTo = 2;
    } else if (part === 6) {
      addTo = 3;
    } else if (part === 7) {
      addTo = dataExam.data[indexQuestion].to - 1;
    }
    let isPivot = false;
    if (parts) {
      counts.forEach((el, index) => {
        if (index > 0) {
          if (el - 1 === indexQuestion + addTo) {
            isPivot = true;
            return;
          }
        }
      });
    }
    return isPivot;
  };

  const isPivotBottomFunc = () => {
    let isPivot = false;
    if (parts) {
      counts.forEach((el, index) => {
        if (index > 0) {
          if (el === indexQuestion) {
            isPivot = true;
            return;
          }
        }
      });
    }
    return isPivot;
  };

  const handleNextQuestion = () => {
    const isPivot = isPivotTopFunc();
    if (isPivot) {
      const i = parts.findIndex((el) => el === part);
      setIndexQuestion(counts[parts[i + 1] - 1]);
    } else {
      if (indexQuestion < 30) {
        setIndexQuestion(indexQuestion + 1);
      } else if (indexQuestion < 100) {
        setIndexQuestion(indexQuestion + 3);
      } else if (indexQuestion < 130) {
        setIndexQuestion(indexQuestion + 1);
      } else if (indexQuestion < 146) {
        setIndexQuestion(indexQuestion + 4);
      } else {
        setIndexQuestion(indexQuestion + dataExam.data[indexQuestion].to);
      }
    }
  };

  const handleBackQuestion = () => {
    const isPivot = isPivotBottomFunc();
    if (isPivot) {
      const i = parts.findIndex((el) => el === part);
      if (parts[i - 1] === 1) {
        setIndexQuestion(5);
      } else if (parts[i - 1] === 2) {
        setIndexQuestion(30);
      } else if (parts[i - 1] === 3) {
        setIndexQuestion(67);
      } else if (parts[i - 1] === 4) {
        setIndexQuestion(97);
      } else if (parts[i - 1] === 5) {
        setIndexQuestion(129);
      } else if (parts[i - 1] === 6) {
        setIndexQuestion(142);
      }
    } else {
      if (indexQuestion < 30) {
        setIndexQuestion(indexQuestion - 1);
      } else if (indexQuestion < 100) {
        setIndexQuestion(indexQuestion - 3);
      } else if (indexQuestion < 130) {
        setIndexQuestion(indexQuestion - 1);
      } else if (indexQuestion < 146) {
        setIndexQuestion(indexQuestion - 4);
      } else {
        setIndexQuestion(indexQuestion - dataExam.data[indexQuestion - 1].to);
      }
    }
  };

  useEffect(() => {
    setPart(indexToPart());
    if (isPivotTopFunc() && part === parts[parts.length - 1]) {
      setCanNext(false);
    } else {
      setCanNext(true);
    }

    if (isPivotBottomFunc() && indexToPart() === parts[0]) {
      setCanBack(false);
    } else {
      setCanBack(true);
    }

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
              {canBack && (
                <button
                  className={styles.back_btn}
                  style={{
                    border: "none",
                    color: "#fff",
                    fontSize: "20px",
                    backgroundColor: "var(--blue)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "Gilroy",
                  }}
                  onClick={handleBackQuestion}
                >
                  Câu trước
                </button>
              )}
              {canNext && (
                <button
                  className={styles.next_btn}
                  style={{
                    border: "none",
                    color: "#fff",
                    fontSize: "20px",
                    backgroundColor: "var(--blue)",
                    borderRadius: "8px",
                    cursor: "pointer",
                    fontFamily: "Gilroy",
                  }}
                  onClick={handleNextQuestion}
                >
                  Câu tiếp
                </button>
              )}
            </div>
          ) : (
            <></>
          )}

          {!isShowKey && isReady && (
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
            {indexQuestion >= 6 && indexQuestion < 31 && <Part2 />}
            {indexQuestion >= 31 && indexQuestion < 100 && <Part3 />}
            {indexQuestion >= 100 && indexQuestion < 130 && <Part5 />}
            {indexQuestion >= 130 && indexQuestion < 146 && <Part6 />}
            {indexQuestion >= 146 && indexQuestion < 200 && <Part7 />}
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
                setIndexQuestion(counts[parts?.[0] - 1] || 0);
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

          <div>
            <span>Part 5: </span>
            <span>{`${result?.countCorrectPart5}/30`}</span>
          </div>

          <div>
            <span>Part 6: </span>
            <span>{`${result?.countCorrectPart6}/16`}</span>
          </div>

          <div>
            <span>Part 7: </span>
            <span>{`${result?.countCorrectPart7}/54`}</span>
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
