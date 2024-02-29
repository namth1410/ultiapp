import { Input } from "antd";
import { useTest } from "contexts/test_context/TestContext";
import PropTypes from "prop-types";
import styles from "./EssayItem.module.css";

function EssayItem({ props, indexItem, total, keys }) {
  const { definition } = props;

  const { answer, setAnswer, isSubmited, correctAnswer } = useTest();

  const onSelectKey = (value) => {
    if (isSubmited) return;
    if (value === keys[correctAnswer[indexItem]]) {
      let _answer = [...answer];
      _answer[indexItem] = correctAnswer[indexItem];
      setAnswer(_answer);
    } else {
      let _answer = [...answer];
      _answer[indexItem] = 100;
      setAnswer(_answer);
    }
  };

  const colorItem = () => {
    if (isSubmited) {
      if (answer[indexItem] === correctAnswer[indexItem]) {
        return "1px solid green";
      } else {
        return "1px solid #ff5b5b";
      }
    } else {
      return "";
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.info_header}>
          <span>Định nghĩa</span>
          <span>{`${indexItem + 1}/${total}`}</span>
        </div>
        <div className={styles.question}>{definition}</div>
      </div>

      <div className={styles.answer_wrapper}>
        <section
          style={{ color: "var(--text-color-primary)", marginBottom: "1.5rem" }}
        >
          Điền thuật ngữ
        </section>

        <div className={styles.answers}>
          <Input
            placeholder="Thuật ngữ"
            onChange={(e) => onSelectKey(e.target.value)}
            disabled={isSubmited}
            style={{
              height: "4.5rem",
              fontSize: "1.5rem",
              border: colorItem(),
            }}
          />
        </div>
      </div>
    </div>
  );
}

EssayItem.propTypes = {
  props: PropTypes.object,
  indexItem: PropTypes.any,
  total: PropTypes.any,
  definition: PropTypes.string,
  keys: PropTypes.any,
};

export default EssayItem;
