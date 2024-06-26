import { Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import styles from "./Part3.module.scss";

function Part3() {
  const {
    onChooseAnswer,
    indexQuestion,
    dataExam,
    isShowKey,
    convertKeyStringToInt,
    audioSrc,
  } = useExam();
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);
  const [selectedValue3, setSelectedValue3] = useState(null);

  useEffect(() => {
    setSelectedValue1(null);
    setSelectedValue2(null);
    setSelectedValue3(null);
  }, [indexQuestion]);

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
          {(dataExam.data[indexQuestion].image !== "" ||
            dataExam.data[indexQuestion].image) && (
            <div>
              <img alt="img" src={dataExam.data[indexQuestion].image} />
            </div>
          )}
        </div>
      </div>
      <div className={styles.item_flex}>
        {!isShowKey &&
          Array.from({ length: 3 }, (_, index) => (
            <div key={index} className={styles.exe_pro}>
              <h3 style={{ fontFamily: "Gilroy" }}>{`${
                dataExam.data[indexQuestion + index].question
              }`}</h3>
              <Radio.Group
                name="radiogroup"
                onChange={(e) => {
                  index === 1
                    ? setSelectedValue1(e.target.value)
                    : index === 2
                    ? setSelectedValue2(e.target.value)
                    : setSelectedValue3(e.target.value);
                  onChooseAnswer(indexQuestion + index, e.target.value);
                }}
                disabled={isShowKey}
                value={
                  index === 1
                    ? selectedValue1
                    : index === 2
                    ? selectedValue2
                    : selectedValue3
                }
              >
                <div className={styles.container_answer}>
                  {dataExam.data[indexQuestion + index].answer.map(
                    (_answer, ansIndex) => (
                      <Radio
                        key={_answer}
                        style={{
                          fontSize: "20px",
                          fontWeight: "500",
                          fontFamily: "Gilroy",
                        }}
                        value={ansIndex + 1}
                      >
                        {_answer}
                      </Radio>
                    )
                  )}
                </div>
              </Radio.Group>
            </div>
          ))}

        {isShowKey &&
          Array.from({ length: 3 }, (_, index) => (
            <div
              style={{
                marginTop: "10px",
              }}
              key={_}
              className={styles.exe_pro}
            >
              <div>{`${dataExam.data[indexQuestion + index].question}`}</div>
              {dataExam.data[indexQuestion + index].answer.map((el, _index) => (
                <React.Fragment key={index}>
                  <p
                    style={{
                      fontWeight:
                        convertKeyStringToInt(
                          dataExam.correct_answer[indexQuestion + index]
                        ) === _index
                          ? "bold"
                          : "500",
                    }}
                  >
                    {el}
                  </p>
                  <br />
                </React.Fragment>
              ))}
              <div>{`${indexQuestion + 1 + index}.`}</div>
              {dataExam.data[indexQuestion + index].answerVN.map(
                (el, _index) => (
                  <React.Fragment key={index}>
                    <p
                      style={{
                        fontWeight:
                          convertKeyStringToInt(
                            dataExam.correct_answer[indexQuestion + index]
                          ) === _index
                            ? "bold"
                            : "500",
                      }}
                    >
                      {el}
                    </p>
                    <br />
                  </React.Fragment>
                )
              )}
            </div>
          ))}

        {isShowKey && (
          <div style={{ marginTop: "10px" }} className={styles.exe_pro}>
            <div>{`${indexQuestion + 1} - ${indexQuestion + 3}`}</div>
            {dataExam.data[indexQuestion].paragraph.map((el, index) => (
              <React.Fragment key={el}>
                <p
                  style={{
                    fontWeight: 500,
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
  );
}

export default Part3;
