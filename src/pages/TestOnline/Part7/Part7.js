import { Radio } from "antd";
import React, { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import styles from "./Part7.module.scss";

function Part7() {
  const {
    answer,
    onChooseAnswer,
    indexQuestion,
    dataExam,
    isShowKey,
    convertKeyStringToInt,
  } = useExam();
  const [selectedValue1, setSelectedValue1] = useState(null);
  const [selectedValue2, setSelectedValue2] = useState(null);
  const [selectedValue3, setSelectedValue3] = useState(null);
  const [selectedValue4, setSelectedValue4] = useState(null);
  const [selectedValue5, setSelectedValue5] = useState(null);

  useEffect(() => {
    setSelectedValue1(
      answer[indexQuestion] === 0 ? null : answer[indexQuestion]
    );
    setSelectedValue2(
      answer[indexQuestion + 1] === 0 ? null : answer[indexQuestion + 1]
    );
    setSelectedValue3(
      answer[indexQuestion + 2] === 0 ? null : answer[indexQuestion + 2]
    );
    setSelectedValue4(
      answer[indexQuestion + 3] === 0 ? null : answer[indexQuestion + 3]
    );
    setSelectedValue5(
      answer[indexQuestion + 4] === 0 ? null : answer[indexQuestion + 4]
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuestion]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.item_flex}>
        <div className={styles.exe_pro}>
          <h3>Câu hỏi</h3>
          {(dataExam.data[indexQuestion].image !== "" ||
            dataExam.data[indexQuestion].image) && (
            <div>
              {dataExam.data[indexQuestion].image.map((el) => (
                <img key={el} alt="img" src={el} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className={styles.item_flex}>
        {!isShowKey &&
          Array.from(
            { length: dataExam.data[indexQuestion].to },
            (_, index) => (
              <div key={index} className={styles.exe_pro}>
                <h3 style={{ fontFamily: "Gilroy" }}>{`${
                  dataExam.data[indexQuestion + index].question
                }.`}</h3>
                <Radio.Group
                  name="radiogroup"
                  onChange={(e) => {
                    index === 0
                      ? setSelectedValue1(e.target.value)
                      : index === 1
                      ? setSelectedValue2(e.target.value)
                      : index === 2
                      ? setSelectedValue3(e.target.value)
                      : index === 3
                      ? setSelectedValue4(e.target.value)
                      : setSelectedValue5(e.target.value);
                    onChooseAnswer(indexQuestion + index, e.target.value);
                  }}
                  disabled={isShowKey}
                  value={
                    index === 0
                      ? selectedValue1
                      : index === 1
                      ? selectedValue2
                      : index === 2
                      ? selectedValue3
                      : index === 3
                      ? selectedValue4
                      : selectedValue5
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
            )
          )}

        {isShowKey &&
          Array.from(
            { length: dataExam.data[indexQuestion].to },
            (_, index) => (
              <div
                style={{
                  marginTop: "10px",
                }}
                key={_}
                className={styles.exe_pro}
              >
                <div>{`${indexQuestion + 1 + index}.`}</div>
                {dataExam.data[indexQuestion + index].answer.map(
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
                {dataExam.data[indexQuestion + index].explain.map(
                  (el, _index) => (
                    <React.Fragment key={index}>
                      <p
                        style={{
                          fontWeight: 500,
                        }}
                      >
                        {el}
                      </p>
                      <br />
                    </React.Fragment>
                  )
                )}
              </div>
            )
          )}
      </div>
    </div>
  );
}

export default Part7;
