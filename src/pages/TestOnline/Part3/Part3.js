import { Radio } from "antd";
import { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import styles from "./Part3.module.css";

function Part3() {
  const { onChooseAnswer, indexQuestion } = useExam();
  const [selectedValue, setSelectedValue] = useState(null);

  useEffect(() => {
    setSelectedValue(null);
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
          <h3 style={{ fontFamily: "Gilroy" }}>{`${
            indexQuestion + 1
          }. Where is the conversation most likely taking place?`}</h3>
          <Radio.Group
            name="radiogroup"
            onChange={(e) => {
              setSelectedValue(e.target.value);
              onChooseAnswer(indexQuestion, e.target.value);
            }}
            value={selectedValue}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <Radio
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  fontFamily: "Gilroy",
                }}
                value={1}
              >
                A. In an electronics store
              </Radio>
              <Radio
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  fontFamily: "Gilroy",
                }}
                value={2}
              >
                B. In a coffee shop
              </Radio>
              <Radio
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  fontFamily: "Gilroy",
                }}
                value={3}
              >
                C. In a supermarket
              </Radio>
              <Radio
                style={{
                  fontSize: "20px",
                  fontWeight: "500",
                  fontFamily: "Gilroy",
                }}
                value={4}
              >
                D. In an art supply store
              </Radio>
            </div>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}

export default Part3;
