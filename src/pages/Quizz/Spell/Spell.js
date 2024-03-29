import { ControlOutlined, DoubleLeftOutlined } from "@ant-design/icons";
import listen from "assets/img/listen.svg";
import { useNavigate } from "react-router-dom";
import styles from "./Spell.module.css";
import { useState, useEffect } from "react";

function Spell() {
  const navigate = useNavigate();

  const [inputAnswer, setInputAnswer] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState(null);
  const correctStr = "Lightbulb";
  const [addClass, setAddClass] = useState(false);
  const [isActive, setIsActive] = useState(false);

  function getMinimumEditDistance(A, B) {
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
          operations.push(`${i - 1}# Giữ kí tự ${A[i - 1]}`)
        }
        i--;
        j--;
      }
    }

    operations.reverse();
    let _result = [];
    let chiSoLanThayDoiTruoc = -1;
    operations.forEach((el, index) => {
      if (el.includes("Thay đổi") || el.includes("Xóa")) {
        let i = parseInt(el.split("#")[0]);
        let _inputAnswer = inputAnswer.split(""); //z x c b u l
        _inputAnswer.forEach((c, _index) => {
          if (_index < i && _index > chiSoLanThayDoiTruoc) {
            console.log("giu nguyen");
            _result.push({
              type: "correct",
              character: c,
            });
          }
        });
        _result.push({
          type: "remove",
          character: el[el.length - 1],
        });
        chiSoLanThayDoiTruoc = index;
      } else {
        _result.push({
          type: "add",
          character: el[el.length - 1],
        });
      }
    });
    console.log(_result);
    setResult(_result);
    setIsChecking(true);
    return operations;
  }

  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => {
      setAddClass(true);
      setIsActive(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [result]);

  useEffect(() => {
    if (addClass) {
      const removeClassTimer = setTimeout(() => {
        setIsActive(false);
      }, 1000);

      return () => clearTimeout(removeClassTimer);
    }
  }, [addClass]);

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
                  <span className={styles.progress_bar_fill}></span>
                </div>
                <div className={styles.progress_label}>
                  <span>Tiến độ</span>
                  <span>4%</span>
                </div>
              </div>

              <div className={styles.total_progress}>
                <div className={styles.progress_bar}>
                  <span className={styles.progress_bar_fill}></span>
                </div>
                <div className={styles.progress_label}>
                  <span>Vòng này</span>
                  <span>1/7</span>
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
              <img alt="img" src={listen} style={{ width: "30px" }} />

              <div className={styles.view_input}>
                {isChecking ? (
                  <div className={styles.show}>
                    {result.map((el) => {
                      return (
                        <span
                          key={el}
                          className={`${styles.test} ${
                            addClass && el.type === "remove"
                              ? styles.remove
                              : ""
                          } ${
                            addClass && el.type === "add" ? styles.add : ""
                          } ${isActive ? styles.is_active : ""}`}
                        >
                          {el.character}
                        </span>
                      );
                    })}
                  </div>
                ) : (
                  <input
                    onChange={(e) => {
                      setInputAnswer(e.target.value);
                    }}
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        const operations = getMinimumEditDistance(
                          inputAnswer,
                          "bulletin"
                        );

                        console.log(
                          "Các thao tác cần thiết để biến đổi chuỗi A thành chuỗi B:"
                        );
                        operations.forEach((operation) =>
                          console.log(operation)
                        );
                      }
                    }}
                    placeholder="Nhập những gì bạn nghe thấy"
                  ></input>
                )}
                <div className={styles.text}>Trả lời</div>
              </div>
            </div>

            <div className={styles.input_prompt}>
              <div className={styles.input_prompt_phonetic}>
                /ˈlaɪtˌbʌlb/ Bóng đèn
              </div>
              <div className={styles.input_prompt_image}>
                <img
                  alt="img"
                  src="https://o.quizlet.com/-wA2dkxbiOHdGJPTNhmKPg.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Spell;
