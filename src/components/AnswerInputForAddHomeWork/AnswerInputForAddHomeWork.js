import { Input } from "antd";
import { useAddHomeWork } from "contexts/add_homework_context/AddHomeWorkContext";
import PropTypes from "prop-types";

function AnswerInputForAddHomeWork({ props }) {
  const { index, score } = props;
  const { correctAnswer, setCorrectAnswer, selectedAnswer, setSelectedAnswer } =
    useAddHomeWork();

  const onClick = () => {
    setSelectedAnswer(index);
  };

  const handleTypeAnswer = (value) => {
    let newAnswer = [...correctAnswer];
    newAnswer[index] = value.toUpperCase();
    setCorrectAnswer(newAnswer);
  };

  return (
    <button
      style={{
        maxWidth: "30%",
        padding: "8px",
        border:
          selectedAnswer === index
            ? "1px solid #1e88e5"
            : "1px solid rgb(216, 220, 240)",
        borderRadius: "4px",
        background: selectedAnswer === index ? "#e3f2fd" : "rgb(240, 242, 245)",
        cursor: "pointer",
        flexBasis: "33.33%",
        boxSizing: "border-box",
        fontFamily: "Gilroy",
      }}
      onClick={onClick}
    >
      <div style={{ color: "#65697b", marginBottom: "10px" }}>{`Câu ${
        index + 1
      }`}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "14px",
              textWrap: "nowrap",
              width: "150px",
              textAlign: "left",
            }}
          >
            Đáp án
          </span>
          <Input
            value={
              correctAnswer[index] ? correctAnswer[index].toUpperCase() : ""
            }
            onKeyDown={(e) => {
              handleTypeAnswer(e.key);
            }}
            maxLength={1}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span
            style={{
              fontSize: "14px",
              textWrap: "nowrap",
              width: "150px",
              textAlign: "left",
            }}
          >
            Điểm
          </span>
          <Input value={score} />
        </div>
      </div>
    </button>
  );
}

AnswerInputForAddHomeWork.propTypes = {
  props: PropTypes.any,
  index: PropTypes.any,
  score: PropTypes.any,
};

export default AnswerInputForAddHomeWork;
