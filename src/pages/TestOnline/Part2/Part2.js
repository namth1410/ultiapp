import { Radio } from "antd";
import { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import styles from "./Part2.module.css";

function Part2() {
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
          <h3>{`${indexQuestion + 1}.`}</h3>
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
              <Radio style={{ fontSize: "20px" }} value={1}>
                A
              </Radio>
              <Radio style={{ fontSize: "20px" }} value={2}>
                B
              </Radio>
              <Radio style={{ fontSize: "20px" }} value={3}>
                C
              </Radio>
              <Radio style={{ fontSize: "20px" }} value={4}>
                D
              </Radio>
            </div>
          </Radio.Group>
        </div>
      </div>
    </div>
  );
}

export default Part2;
