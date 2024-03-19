import { Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import styles from "./Part5.module.css";

function Part5() {
  const {
    answer,
    isShowKey,
    onChooseAnswer,
    indexQuestion,
    dataExam,
    checkKey,
  } = useExam();
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    if (answer[indexQuestion] === 0) {
      setSelectedValue(null);
    } else {
      setSelectedValue(answer[indexQuestion]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuestion]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.item_flex}>
        <div className={styles.exe_pro}>
          <h3>Câu hỏi</h3>
        </div>
      </div>
      <div className={styles.item_flex}>
        <div className={styles.exe_pro}>
          <h3>{dataExam.data[indexQuestion].question}</h3>
          <Radio.Group
            name="radiogroup"
            onChange={(e) => {
              setSelectedValue(e.target.value);
              onChooseAnswer(indexQuestion, e.target.value);
            }}
            value={selectedValue}
            disabled={isShowKey}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {dataExam.data[indexQuestion].answer.map((_answer, ansIndex) => (
                <Radio
                  key={_answer}
                  style={{
                    fontSize: "20px",
                    fontWeight: "500",
                    fontFamily: "Gilroy",
                  }}
                  value={ansIndex + 1}
                >
                  {_answer} {isShowKey && checkKey(ansIndex + 1)}
                </Radio>
              ))}
            </div>
          </Radio.Group>

          {isShowKey && (
            <div
              style={{
                marginTop: "10px",
              }}
              className={styles.explanation}
            >
              <div>{`${indexQuestion + 1}.`}</div>
              {dataExam.data[indexQuestion].explain.map((el, index) => (
                <React.Fragment key={el}>
                  <p
                    style={{
                      fontWeight: "500",
                    }}
                  >
                    {el}
                  </p>
                  <br />
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Part5;
