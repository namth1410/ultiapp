import {
  CheckOutlined,
  CloseOutlined,
  CloseSquareOutlined,
} from "@ant-design/icons";
import { Button, Modal, Select, Space } from "antd";
import QuestionItem from "components/QuestionItem/QuestionItem";
import { useTest } from "contexts/test_context/TestContext";
import { memo, useRef, useState } from "react";

import { useNavigate } from "react-router-dom";
import styles from "./Test.module.css";

function Test() {
  const navigate = useNavigate();

  const rightboxRef = useRef(null);

  const {
    result,
    dataQuizz,
    correctAnswer,
    answer,
    keys,
    isSubmited,
    setIsSubmited,
  } = useTest();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    setIsSubmited(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  const scrollToIndex = (index) => {
    const targetElement = rightboxRef.current.children[index];
    targetElement.scrollIntoView({ behavior: "smooth" });
  };

  const options = [
    {
      label: "🇨🇳 Kiểm tra",
      value: "china",
      emoji: "🇨🇳",
      desc: "China (中国)",
    },
    {
      label: "Học",
      value: "usa",
      emoji: "🇺🇸",
      desc: "USA (美国)",
    },
    {
      label: "Ghi nhớ",
      value: "japan",
      emoji: "🇯🇵",
      desc: "Japan (日本)",
    },
    {
      label: "Ghép thẻ",
      value: "korea",
      emoji: "🇰🇷",
      desc: "Korea (韩国)",
    },
  ];

  return (
    <div className={styles.test_wrapper}>
      <div className={styles.header}>
        <Select
          style={{
            width: "100px",
            border: "none",
          }}
          placeholder="select one country"
          defaultValue={["china"]}
          onChange={handleChange}
          optionLabelProp="label"
          options={options}
          optionRender={(option) => (
            <Space>
              <span role="img" aria-label={option.data.label}>
                {option.data.emoji}
              </span>
              {option.data.desc}
            </Space>
          )}
        />

        <div className={styles.infoTest}>
          <span>{dataQuizz?.title}</span>
          <span>{`${answer.filter((el) => el !== -1).length}/${
            dataQuizz?.quizz_items.length
          }`}</span>
        </div>

        <div className={styles.actions_wrapper}>
          <CloseSquareOutlined
            onClick={() => {
              navigate(-1);
            }}
            style={{ fontSize: "28px" }}
          />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftbox}>
          <h2>Danh sách câu hỏi</h2>
          {dataQuizz?.quizz_items.map((item, index) => (
            <button
              className={styles.index_ques}
              key={item.term}
              onClick={() => scrollToIndex(index)}
              style={{
                color: answer[index] !== -1 ? "var(--primary-color)" : "#ccc",
              }}
            >
              <div>
                <span
                  style={{
                    color: isSubmited
                      ? answer[index] === correctAnswer[index]
                        ? "green"
                        : "#ff5b5b"
                      : "unset",
                    marginRight: "5px",
                  }}
                >
                  Câu hỏi {index + 1}
                </span>
                {isSubmited &&
                  (answer[index] === correctAnswer[index] ? (
                    <CheckOutlined style={{ color: "green" }} />
                  ) : (
                    <CloseOutlined style={{ color: "#ff5b5b" }} />
                  ))}
              </div>
            </button>
          ))}
          {isSubmited && (
            <div
              style={{
                marginTop: "20px",
              }}
            >{`Kết quả: ${result}/${dataQuizz?.quizz_items.length}`}</div>
          )}
        </div>
        <div className={styles.rightbox} ref={rightboxRef}>
          {dataQuizz?.quizz_items.map((item, index) => {
            return (
              <div
                style={{ paddingBottom: "40px", backgroundColor: "#f6f7fb" }}
                key={item.term}
              >
                <QuestionItem
                  props={item}
                  index={index}
                  total={dataQuizz.quizz_items.length}
                  keys={keys.length > 0 ? keys[index] : []}
                />
              </div>
            );
          })}
          <Button
            style={{
              width: "fit-content",
              backgroundColor: "var(--primary-color)",
              color: "#fff",
              fontFamily: "Gilroy",
              padding: "15px 20px",
              height: "auto",
              margin: "auto",
              fontSize: "24px",
              border: "none",
            }}
            onClick={() => {
              if (answer.includes(-1)) {
                showModal();
              } else {
                setIsSubmited(true);
              }

              console.log(correctAnswer);
            }}
          >
            Gửi bài kiểm tra
          </Button>
        </div>
      </div>

      <Modal
        title="Xác nhận nộp bài"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Có câu chưa làm !!!</p>
        <p>Bạn có muốn nộp bài không?</p>
      </Modal>
    </div>
  );
}

export default memo(Test);
