import {
  CheckOutlined,
  CloseOutlined,
  CloseSquareOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Button, InputNumber, Modal, Select, Space, Switch } from "antd";
import MultipleChoiceItem from "components/MultipleChoiceItem/MultipleChoiceItem";
import { MODE, useTest } from "contexts/test_context/TestContext";
import { memo, useRef, useState, useEffect } from "react";

import EssayItem from "components/EssayItem/EssayItem";
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
    setting,
    indexShuffleArray,
  } = useTest();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const [quantityQuestionSetting, setQuantityQuestionSetting] = useState(
    setting?.quantityQuestion
  );
  const [hasMultipleChoiceSetting, setHasMultipleChoiceSetting] = useState(
    setting?.mode === MODE.MULTIPLE_CHOICE || setting?.mode === MODE.MIXTURE
  );
  const [hasEssaySetting, setHasEssaySetting] = useState(
    setting?.mode === MODE.ESSAY || setting?.mode === MODE.MIXTURE
  );
  const [isShuffle, setIsShuffle] = useState(setting?.isShuffle);
  const mode = setting?.mode;

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

  const updateURL = (_setting) => {
    const params = new URLSearchParams();

    for (const key in _setting) {
      params.append(key, _setting[key]);
    }

    navigate(`?${params.toString()}`);
  };

  const handleOkSetting = () => {
    const mode =
      hasEssaySetting && hasMultipleChoiceSetting
        ? MODE.MIXTURE
        : hasEssaySetting
        ? MODE.ESSAY
        : MODE.MULTIPLE_CHOICE;

    const _setting = {
      quantityQuestion: quantityQuestionSetting,
      mode: mode,
      isShuffle: isShuffle,
    };

    updateURL(_setting);
    window.location.reload();
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

  useEffect(() => {
    if (!setting) return;
    setQuantityQuestionSetting(setting.quantityQuestion);
    setHasMultipleChoiceSetting(
      setting?.mode === MODE.MULTIPLE_CHOICE || setting?.mode === MODE.MIXTURE
    );
    setHasEssaySetting(
      setting?.mode === MODE.ESSAY || setting?.mode === MODE.MIXTURE
    );
    setIsShuffle(setting?.isShuffle);
  }, [setting]);

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
          <span style={{ fontSize: "24px" }}>{dataQuizz?.title}</span>
          <span style={{ color: "#717171" }}>{`${
            answer.filter((el) => el !== -1).length
          }/${setting?.quantityQuestion}`}</span>
        </div>

        <div className={styles.actions_wrapper}>
          <SettingOutlined
            onClick={() => {
              if (isSubmited) return;
              setIsSettingModalOpen(true);
            }}
            style={{
              fontSize: "28px",
              marginRight: "20px",
              color: isSubmited ? "#939bb4" : "unset",
            }}
          />
          <CloseSquareOutlined
            onClick={() => {
              navigate("/quizz");
            }}
            style={{ fontSize: "28px" }}
          />
        </div>
      </div>

      {setting && (
        <>
          <div className={styles.content}>
            <div className={styles.leftbox}>
              <h2>Danh sách câu hỏi</h2>
              {dataQuizz?.quizz_items.map((item, index) => {
                return index < setting?.quantityQuestion ? (
                  <button
                    className={styles.index_ques}
                    key={item.term}
                    onClick={() => scrollToIndex(index)}
                    style={{
                      color:
                        answer[index] !== -1 ? "var(--primary-color)" : "#ccc",
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
                ) : (
                  <></>
                );
              })}
              {isSubmited && (
                <div
                  style={{
                    marginTop: "20px",
                  }}
                >{`Kết quả: ${result}/${setting?.quantityQuestion}`}</div>
              )}
            </div>
            <div className={styles.rightbox} ref={rightboxRef}>
              {dataQuizz?.quizz_items.map((item, index) => {
                return index < setting?.quantityQuestion ? (
                  <div
                    style={{
                      paddingBottom: "40px",
                      backgroundColor: "#f6f7fb",
                    }}
                    key={item.term}
                  >
                    {mode === MODE.MULTIPLE_CHOICE && (
                      <MultipleChoiceItem
                        props={item}
                        index={
                          setting.isShuffle ? indexShuffleArray[index] : index
                        }
                        indexSequence={index}
                        keys={keys.length > 0 ? keys[index] : []}
                      />
                    )}

                    {mode === MODE.ESSAY && (
                      <EssayItem
                        props={item}
                        indexItem={index}
                        total={dataQuizz.quizz_items.length}
                        keys={keys.length > 0 ? keys[index] : []}
                      />
                    )}

                    {mode === MODE.MIXTURE &&
                      (index % 2 === 0 ? (
                        <MultipleChoiceItem
                          props={item}
                          index={
                            setting.isShuffle ? indexShuffleArray[index] : index
                          }
                          indexSequence={index}
                          keys={keys.length > 0 ? keys[index] : []}
                        />
                      ) : (
                        <EssayItem
                          props={item}
                          index={
                            setting.isShuffle ? indexShuffleArray[index] : index
                          }
                          indexItem={index}
                          total={dataQuizz.quizz_items.length}
                          keys={keys.length > 0 ? keys[index] : []}
                        />
                      ))}
                  </div>
                ) : (
                  <></>
                );
              })}
              {!isSubmited && (
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
                  }}
                >
                  Gửi bài kiểm tra
                </Button>
              )}
            </div>
          </div>

          <Modal
            title="Xác nhận nộp bài"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>Bạn chắc chắn muốn nộp bài không?</p>
          </Modal>

          <Modal
            title="Xác nhận nộp bài"
            open={isSettingModalOpen}
            onOk={handleOkSetting}
            onCancel={() => {
              setIsSettingModalOpen(false);
            }}
          >
            <div>
              <h2>{dataQuizz?.title}</h2>
              <h1>Thiết lập bài kiểm tra</h1>

              <div className={styles.setting_wrapper}>
                <div className={styles.setting}>
                  <span>{`Câu hỏi (tối đa ${dataQuizz?.quizz_items.length})`}</span>
                  <InputNumber
                    min={5}
                    max={dataQuizz?.quizz_items.length}
                    defaultValue={setting?.quantityQuestion}
                    onChange={(e) => {
                      setQuantityQuestionSetting(e);
                    }}
                  />
                </div>

                <div className={styles.setting}>
                  <span>Trắc nghiệm</span>
                  <Switch
                    defaultChecked={
                      setting.mode === MODE.MULTIPLE_CHOICE ||
                      setting.mode === MODE.MIXTURE
                    }
                    onChange={(e) => {
                      setHasMultipleChoiceSetting(e);
                    }}
                  />
                </div>

                <div className={styles.setting}>
                  <span>Tự luận</span>
                  <Switch
                    defaultChecked={
                      setting.mode === MODE.ESSAY ||
                      setting.mode === MODE.MIXTURE
                    }
                    onChange={(e) => {
                      setHasEssaySetting(e);
                    }}
                  />
                </div>

                <div className={styles.setting}>
                  <span>Xáo trộn</span>
                  <Switch
                    defaultChecked={setting.isShuffle}
                    onChange={(e) => {
                      setIsShuffle(e);
                    }}
                  />
                </div>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
}

export default memo(Test);
