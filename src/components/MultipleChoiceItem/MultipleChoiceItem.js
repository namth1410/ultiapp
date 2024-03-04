import { useTest } from "contexts/test_context/TestContext";
import PropTypes from "prop-types";
import { useState } from "react";
import styles from "./MultipleChoiceItem.module.css";

function MultipleChoiceItem({ props, index, keys, indexSequence }) {
  const { definition } = props;

  const { answer, setAnswer, isSubmited, correctAnswer, setting } = useTest();

  const [indexSelectedKey, setIndexSelectedKey] = useState(null);

  const onSelectKey = (i) => {
    if (isSubmited) return;
    setIndexSelectedKey(i);
    let _answer = [...answer];
    _answer[indexSequence] = i;
    setAnswer(_answer);
  };

  const colorItem = (index_in_item) => {
    if (isSubmited) {
      if (!indexSelectedKey && index_in_item === correctAnswer[indexSequence]) {
        return "green";
      }
      if (indexSelectedKey === index_in_item) {
        return answer[indexSequence] === correctAnswer[indexSequence] ? "green" : "#ff5b5b";
      } else {
        return index_in_item === correctAnswer[indexSequence] ? "green" : "unset";
      }
    } else {
      return indexSelectedKey === index_in_item ? "#edefff" : "unset";
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.info_header}>
          <span>Định nghĩa</span>
          <span>{`${indexSequence + 1}/${setting.quantityQuestion}`}</span>
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
            <button
              style={{
                border:
                  indexSelectedKey === index
                    ? "2px solid var(--primary-color)"
                    : "",
                backgroundColor: colorItem(index),
              }}
              className={styles.answer}
              key={key}
              onClick={() => onSelectKey(index)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

MultipleChoiceItem.propTypes = {
  props: PropTypes.object,
  index: PropTypes.any,
  definition: PropTypes.string,
  keys: PropTypes.array,
  indexSequence: PropTypes.any,
};

export default MultipleChoiceItem;
