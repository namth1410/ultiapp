import { Radio } from "antd";
import { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import styles from "./Part1.module.css";

function Part1() {
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
          <div>
            <img
              alt="img"
              src="https://zenlishtoeic.vn/wp-content/uploads/2023/06/zenlish-1-3.png"
            />
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

export default Part1;
