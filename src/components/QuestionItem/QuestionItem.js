import PropTypes from "prop-types";
import styles from "./QuestionItem.module.css";
import { useTest } from "contexts/test_context/TestContext";
import { useState, memo } from "react";

function QuestionItem({ props, index, total, keys }) {
  const { definition } = props;

  const { answer, setAnswer } = useTest();

  const [indexSelectedKey, setIndexSelectedKey] = useState(null);

  const onSelectKey = (i) => {
    setIndexSelectedKey(i);
    let _answer = [...answer];
    _answer[index] = i;
    setAnswer(_answer);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.info_header}>
          <span>Định nghĩa</span>
          <span>{`${index + 1}/${total}`}</span>
        </div>
        <div className={styles.question}>{definition}</div>
      </div>

      <div className={styles.answer_wrapper}>
        <section
          style={{ color: "var(--text-color-primary)", marginBottom: "1.5rem" }}
        >
          Chọn thuật ngữ đúng
        </section>

        <div className={styles.answers}>
          {keys?.map((key, index) => (
            <section
              style={{
                border:
                  indexSelectedKey === index
                    ? "2px solid var(--primary-color)"
                    : "",
                backgroundColor:
                  indexSelectedKey === index ? "#edefff" : "unset",
              }}
              className={styles.answer}
              key={key}
              onClick={() => onSelectKey(index)}
            >
              {key}
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

QuestionItem.propTypes = {
  props: PropTypes.object,
  index: PropTypes.any,
  total: PropTypes.any,
  definition: PropTypes.string,
  keys: PropTypes.array,
};

export default memo(QuestionItem);
