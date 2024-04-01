import {
  ControlOutlined,
  DoubleLeftOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import listen from "assets/img/listen.svg";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Spell.module.css";
import { useSpell } from "./SpellContext";

function Spell() {
  const navigate = useNavigate();
  const {
    status,
    setStatus,
    dataQuizz,
    indexQuizzItem,
    progress,
    setProgress,
    totalQuizzItem,
  } = useSpell();
  const [inputAnswer, setInputAnswer] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const [addClassWrong, setAddClassWrong] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isActiveAdd, setIsActiveAdd] = useState(false);

  const onListen = () => {
    const synth = window.speechSynthesis;

    const u = new SpeechSynthesisUtterance(
      dataQuizz?.quizz_items[indexQuizzItem].term
    );

    u.voice = synth.getVoices()[0];
    synth.speak(u);
  };

  function getMinimumEditDistance(A, B) {
    if (A === B) {
      setStatus(true);
      return;
    }
    // Tạo ma trận 2 chiều với kích thước (A.length + 1) x (B.length + 1)
    const dp = [];
    for (let i = 0; i <= A.length; i++) {
      dp[i] = new Array(B.length + 1);
    }

    // Khởi tạo giá trị cho hàng đầu tiên và cột đầu tiên
    for (let i = 0; i <= A.length; i++) {
      dp[i][0] = i;
    }
    for (let j = 0; j <= B.length; j++) {
      dp[0][j] = j;
    }

    // Tính toán khoảng cách chỉnh sửa
    for (let i = 1; i <= A.length; i++) {
      for (let j = 1; j <= B.length; j++) {
        if (A[i - 1] === B[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
        }
      }
    }

    // Truy vết để xác định các thao tác cần thiết để biến đổi chuỗi A thành chuỗi B
    let i = A.length;
    let j = B.length;
    const operations = [];

    while (i > 0 || j > 0) {
      if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
        operations.push(`${i - 1}# Xóa kí tự ${A[i - 1]}`);
        i--;
      } else if (j > 0 && dp[i][j] === dp[i][j - 1] + 1) {
        operations.push(`Thêm kí tự ${B[j - 1]}`);
        j--;
      } else {
        if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + 1) {
          operations.push(
            `${i - 1}# Thay đổi kí tự ${A[i - 1]} thành ${B[j - 1]}`
          );
        } else {
          operations.push(`${i - 1}# Giữ kí tự ${A[i - 1]}`);
        }
        i--;
        j--;
      }
    }

    operations.reverse();
    let _result = [];
    operations.forEach((el, index) => {
      if (el.includes("Thay đổi") || el.includes("Xóa")) {
        if (el.includes("Thay đổi")) {
          _result.push({
            type: "remove",
            character: el.split(" ")[5] || " ",
          });
        } else {
          _result.push({
            type: "remove",
            character: el[el.length - 1] || " ",
          });
        }

        if (el.includes("Thay đổi")) {
          _result.push({
            type: "add",
            character: el[el.length - 1],
          });
        }
      } else if (el.includes("Thêm")) {
        _result.push({
          type: "add",
          character: el[el.length - 1],
        });
      } else if (el.includes("Giữ")) {
        _result.push({
          type: "correct",
          character: el[el.length - 1],
        });
      }
    });
    setResult(_result);
    setIsChecking(true);
    console.log(operations);
    return operations;
  }

  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => {
      setAddClassWrong(true);
      setIsActive(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [result]);

  useEffect(() => {
    if (addClassWrong) {
      const removeClassTimer = setTimeout(() => {
        setIsActive(false);
        setIsActiveAdd(true);
      }, 1000);

      return () => clearTimeout(removeClassTimer);
    }
  }, [addClassWrong]);

  useEffect(() => {
    setProgress(((indexQuizzItem / totalQuizzItem) * 100).toFixed(0));
    setInputAnswer("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuizzItem]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left_box}>
          <div
            className={styles.back}
            onClick={() => {
              navigate(-1);
            }}
          >
            <DoubleLeftOutlined />
            <span>Trở về</span>
          </div>

          <div className={styles.controls}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
                margin: "1.5rem 0 2.5rem",
              }}
            >
              <img alt="img" src={listen} style={{ width: "30px" }} />
              <span style={{ fontSize: "0.875rem", letterSpacing: ".1875rem" }}>
                Chính tả
              </span>
            </div>

            <div className={styles.progress}>
              <div className={styles.total_progress}>
                <div className={styles.progress_bar}>
                  <span
                    style={{ width: `${progress}%` }}
                    className={styles.progress_bar_fill}
                  ></span>
                </div>
                <div className={styles.progress_label}>
                  <span>Tiến độ</span>
                  <span>{`${progress}%`}</span>
                </div>
              </div>

              <div className={styles.total_progress}>
                <div className={styles.progress_bar}>
                  <span
                    style={{
                      width: `${(indexQuizzItem / 5) * 100}%`,
                    }}
                    className={styles.progress_bar_fill}
                  ></span>
                </div>
                <div className={styles.progress_label}>
                  <span>Vòng này</span>
                  <span>{`${indexQuizzItem}/${5}`}</span>
                </div>
              </div>
            </div>

            <div className={styles.action}>
              <button>
                <ControlOutlined style={{ marginRight: "5px" }} />
                Tùy chọn
              </button>
            </div>
          </div>
        </div>
        <div className={styles.right_box}>
          <div className={styles.spell_controller}>
            <div className={styles.input_wrapper}>
              <img
                alt="img"
                onClick={onListen}
                src={listen}
                style={{ width: "30px", cursor: "pointer" }}
              />

              <div className={styles.view_input}>
                {isChecking && (
                  <div className={styles.show}>
                    {result.map((el) => {
                      return (
                        <span
                          key={el}
                          className={`${styles.test} ${
                            addClassWrong && el.type === "remove"
                              ? styles.remove
                              : ""
                          } ${el.type === "add" ? styles.add : ""}  ${
                            isActive ? styles.is_active : ""
                          } ${
                            isActiveAdd && el.type === "add"
                              ? styles.is_active_add
                              : ""
                          }`}
                        >
                          {el.character === " " ? "\u00A0" : el.character}
                        </span>
                      );
                    })}
                  </div>
                )}
                {isChecking ? (
                  <></>
                ) : (
                  <input
                    onChange={(e) => {
                      setInputAnswer(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        getMinimumEditDistance(
                          inputAnswer,
                          dataQuizz.quizz_items[indexQuizzItem].term
                        );
                      }
                    }}
                    className={`${status && styles.correct}`}
                    value={inputAnswer}
                    placeholder="Nhập những gì bạn nghe thấy"
                  ></input>
                )}
                <div
                  style={{ color: status ? "#23b26d" : "#939bb4" }}
                  className={styles.text}
                >
                  {status ? "Bạn đã trả lời đúng" : "Trả lời"}
                  {isChecking && (
                    <span
                      onClick={() => {
                        setInputAnswer("");
                        setIsChecking(false);
                        setResult(null);
                        setAddClassWrong(false);
                        setIsActive(false);
                        setIsActiveAdd(false);
                      }}
                      style={{ cursor: "pointer", color: "#ffc000" }}
                    >
                      <span style={{ marginRight: "5px" }}>
                        <RedoOutlined />
                      </span>
                      {""}
                      Nhập lại
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.input_prompt}>
              <div className={styles.input_prompt_phonetic}>
                {dataQuizz?.quizz_items[indexQuizzItem].definition}
              </div>
              {dataQuizz?.quizz_items[indexQuizzItem].image && (
                <div className={styles.input_prompt_image}>
                  <img
                    alt="img"
                    src={dataQuizz.quizz_items[indexQuizzItem].image}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spell;
