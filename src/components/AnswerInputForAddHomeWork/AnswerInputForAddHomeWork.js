import { Input } from "antd";
import { useAddHomeWork } from "contexts/add_homework_context/AddHomeWorkContext";
import PropTypes from "prop-types";
import { useEffect } from "react";

function AnswerInputForAddHomeWork({ props }) {
  const { index } = props;
  const { answer, selectedAnswer, setSelectedAnswer, setAnswer } =
    useAddHomeWork();

  const onClick = () => {
    setSelectedAnswer(index);
  };

  const handleTypeAnswer = (value) => {
    let newAnswer = [...answer];
    console.log(index);
    console.log(answer);
    newAnswer[index] = value;
    console.log(newAnswer);
    setAnswer(newAnswer);
  };

  useEffect(() => {
    console.log(props);
  }, []);

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
            value={answer[index] ? answer[index].toUpperCase() : ""}
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
          <Input />
        </div>
      </div>
    </button>
  );
}

AnswerInputForAddHomeWork.propTypes = {
  props: PropTypes.any,
  index: PropTypes.any,
};

export default AnswerInputForAddHomeWork;
