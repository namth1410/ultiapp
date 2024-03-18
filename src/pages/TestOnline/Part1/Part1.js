import { Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import styles from "./Part1.module.css";

function Part1() {
  const {
    onChooseAnswer,
    indexQuestion,
    dataExam,
    isShowKey,
    answer,
    convertKeyStringToInt,
    checkKey,
    urlList,
  } = useExam();
  const [selectedValue, setSelectedValue] = useState(null);
  const [audioSrc, setAudioSrc] = useState(null);

  useEffect(() => {
    setSelectedValue(null);
    isShowKey && setAudioSrc(urlList[indexQuestion]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuestion]);

  useEffect(() => {
    if (isShowKey) {
      setAudioSrc(urlList[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShowKey]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.item_flex}>
        <div className={styles.exe_pro}>
          <h3>Câu hỏi</h3>
          {isShowKey && (
            <audio key={audioSrc} controls>
              <source src={audioSrc} type="audio/wav"></source>
            </audio>
          )}
          <div>
            <img alt="img" src={dataExam.data[indexQuestion].image} />
          </div>
        </div>
      </div>
      <div className={styles.item_flex}>
        <div className={styles.exe_pro}>
          <h3>{`${indexQuestion + 1}.`}</h3>
          <Radio.Group
            name="radiogroup"
            onChange={(e) => {
              setSelectedValue(e.target.value);
              onChooseAnswer(indexQuestion, e.target.value);
            }}
            value={isShowKey ? answer[indexQuestion] : selectedValue}
            disabled={isShowKey}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Radio style={{ fontSize: "20px" }} value={1}>
                A {isShowKey && checkKey(1)}
              </Radio>
              <Radio style={{ fontSize: "20px" }} value={2}>
                B {isShowKey && checkKey(2)}
              </Radio>
              <Radio style={{ fontSize: "20px" }} value={3}>
                C {isShowKey && checkKey(3)}
              </Radio>
              <Radio style={{ fontSize: "20px" }} value={4}>
                D {isShowKey && checkKey(4)}
              </Radio>
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
              {dataExam.data[indexQuestion].answer.map((el, index) => (
                <React.Fragment key={el}>
                  <p
                    style={{
                      fontWeight:
                        convertKeyStringToInt(
                          dataExam.correct_answer[indexQuestion]
                        ) === index
                          ? "bold"
                          : "500",
                    }}
                  >
                    {el}
                  </p>
                  <br />
                </React.Fragment>
              ))}
              <div>{`${indexQuestion + 1}.`}</div>
              {dataExam.data[indexQuestion].answerVN.map((el, index) => (
                <React.Fragment key={el}>
                  <p
                    style={{
                      fontWeight:
                        convertKeyStringToInt(
                          dataExam.correct_answer[indexQuestion]
                        ) === index
                          ? "bold"
                          : "500",
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

export default Part1;
