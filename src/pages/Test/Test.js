import { CloseSquareOutlined } from "@ant-design/icons";
import { Button, Select, Space } from "antd";
import QuestionItem from "components/QuestionItem/QuestionItem";
import { useTest } from "contexts/test_context/TestContext";
import { useRef, memo } from "react";

import styles from "./Test.module.css";
import { compareArrays } from "ultis/func";
import { toast } from "react-toastify";

function Test() {
  const rightboxRef = useRef(null);

  const { dataQuizz, correctAnswer, answer, keys } = useTest();

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
          <span>0/20</span>
          <span>{dataQuizz?.title}</span>
        </div>

        <div className={styles.actions_wrapper}>
          <CloseSquareOutlined style={{ fontSize: "28px" }} />
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.leftbox}>
          <h2>Danh sách câu hỏi</h2>
          {dataQuizz?.quizz_items.map((item, index) => (
            <div
              className={styles.index_ques}
              key={item.term}
              onClick={() => scrollToIndex(index)}
            >
              Câu hỏi {index + 1}
            </div>
          ))}
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
              if (compareArrays(correctAnswer, answer)) {
                toast.success("Đúng hết", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              } else {
                toast.error("Sai rồi", {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }
              console.log(correctAnswer);
            }}
          >
            Gửi bài kiểm tra
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(Test);
