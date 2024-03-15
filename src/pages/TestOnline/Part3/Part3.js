import { Radio } from "antd";
import { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import styles from "./Part3.module.css";

function Part3() {
  const { onChooseAnswer, indexQuestion, dataExam } = useExam();
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
        </div>
      </div>
      <div className={styles.item_flex}>
        {Array.from({ length: 3 }, (_, index) => (
          <div key={index} className={styles.exe_pro}>
            <h3 style={{ fontFamily: "Gilroy" }}>{`${
              dataExam.questions[indexQuestion - 31 + index].question
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
              value={
                index === 1
                  ? selectedValue1
                  : index === 2
                  ? selectedValue2
                  : selectedValue3
              }
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                }}
              >
                {dataExam.questions[indexQuestion - 31 + index].answers.map(
                  (answer, ansIndex) => (
                    <Radio
                      key={ansIndex}
                      style={{
                        fontSize: "20px",
                        fontWeight: "500",
                        fontFamily: "Gilroy",
                      }}
                      value={ansIndex + 1}
                    >
                      {answer}
                    </Radio>
                  )
                )}
              </div>
            </Radio.Group>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Part3;
