import { SettingOutlined } from "@ant-design/icons";
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import {
  Button,
  ConfigProvider,
  DatePicker,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
} from "antd";
import {
  getDataHomeworkById,
  updateHomeworkById,
} from "appdata/homework/homeworkSlice";
import AnswerInputForAddHomeWork from "components/AnswerInputForAddHomeWork/AnswerInputForAddHomeWork";
import { useAddHomeWork } from "contexts/add_homework_context/AddHomeWorkContext";
import { useClass } from "contexts/class_context/ClassContext";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import styles from "./EditHomework.module.css";

function EditHomework() {
  const homeworkId = window.location.pathname.split("/")[4];
  const dispatch = useDispatch();
  const { classId } = useClass();

  const homeworkRedux = useSelector((state) => state.homeworkRedux);
  const { correctAnswer, setCorrectAnswer, countAnswer, setCountAnswer } =
    useAddHomeWork();

  const nameHomeworkInputRef = useRef(null);

  const [dataHomework, setDataHomework] = useState(null);
  const [nameHomework, setNameHomework] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);

  const [hasTimeLimit, setHasTimeLimit] = useState(false);
  const [hasTimeStart, setHasTimeStart] = useState(false);
  const [hasDeadline, setHasDeadline] = useState(false);
  const [hasReview, setHasReview] = useState(false);

  const [timeLimit, setTimeLimit] = useState(null);
  const [timeStartShow, setTimeStartShow] = useState(null);
  const [timeStart, setTimeStart] = useState(null);
  const [deadlineShow, setDeadlineShow] = useState(null);
  const [deadline, setDeadline] = useState(null);
  const [wayGetScore, setWayGetScore] = useState(
    "Lấy điểm lần làm bài đầu tiên"
  );
  const [timesLimitDo, setTimesLimitDo] = useState(1);

  const handleOk = () => {
    setIsModalOpen(false);
    setCountAnswer(correctAnswer.length);
  };
  const handleCancel = () => {
    setCorrectAnswer([]);
    setCountAnswer(0);
    setIsModalOpen(false);
  };

  const memoizedDocuments = useMemo(() => {
    return [
      {
        uri: dataHomework?.fileURL,
      },
    ];
  }, [dataHomework?.fileURL]);

  const onUpdateHomework = async () => {
    const config = {
      hasReview: hasReview,
      timeLimit: timeLimit,
      timeStart: timeStart,
      deadline: deadline,
      wayGetScore: wayGetScore,
      timesLimitDo: timesLimitDo,
    };
    dispatch(
      updateHomeworkById({
        homeworkId: dataHomework.id,
        config: config,
        correctAnswer: correctAnswer,
        nameHomework: nameHomeworkInputRef.current.input.value,
      })
    );
    toast.success("Đã cập nhật bài tập", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    window.location.href = `${process.env.REACT_APP_HOST}/class/${classId}/homework`;
  };

  useEffect(() => {
    if (!dataHomework) return;
    setCountAnswer(dataHomework.correctAnswer.length);

    setHasTimeLimit(!!dataHomework.config.timeLimit);
    setTimeLimit(dataHomework.config.timeLimit);
    setHasTimeStart(!!dataHomework.config.timeStart);
    !!dataHomework.config.timeStart &&
      setTimeStartShow(
        dayjs(
          dayjs(dataHomework.config.timeStart).format("YYYY-MM-DD HH:mm:ss"),
          "YYYY-MM-DD HH:mm:ss"
        )
      );
    setHasDeadline(!!dataHomework.config.deadline);

    !!dataHomework.config.deadline &&
      setDeadlineShow(
        dayjs(
          dayjs(dataHomework.config.deadline).format("YYYY-MM-DD HH:mm:ss"),
          "YYYY-MM-DD HH:mm:ss"
        )
      );
    setHasReview(!!dataHomework.config.hasReview);
    setWayGetScore(dataHomework.config.wayGetScore);
    setTimesLimitDo(dataHomework.config.timesLimitDo);

    setCorrectAnswer(dataHomework.correctAnswer.join(""));
    setNameHomework(dataHomework.nameHomework);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataHomework]);

  useEffect(() => {
    setDataHomework(homeworkRedux.dataHomeworkById);
  }, [homeworkRedux]);

  useEffect(() => {
    dispatch(getDataHomeworkById({ homeworkId: homeworkId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {dataHomework && (
          <>
            <div className={styles.header_wrapper}>
              <div style={{ fontSize: "18px", color: "#3b3b3b" }}>
                Chỉnh sửa bài tập
              </div>
              <div style={{ display: "flex" }}>
                <Input
                  ref={nameHomeworkInputRef}
                  placeholder="Nhập tên bài tập"
                  size="large"
                  value={nameHomework}
                  onChange={(e) => setNameHomework(e.target.value)}
                ></Input>
              </div>
              <Button
                type="primary"
                size="large"
                style={{
                  fontFamily: "Gilroy",
                  padding: "15px 30px",
                  height: "auto",
                }}
                onClick={onUpdateHomework}
              >
                Cập nhật bài tập
              </Button>
            </div>

            <div style={{ display: "flex", width: "100%" }}>
              <div className={styles.left_box}>
                <MemoizedDocViewer documents={memoizedDocuments} />
              </div>

              <div className={styles.right_box}>
                <div className={styles.tool_box}>
                  <div>
                    <span style={{ marginRight: "5px" }}>Số câu</span>
                    <InputNumber
                      size="large"
                      min={1}
                      max={100000}
                      defaultValue={0}
                      value={countAnswer}
                      onChange={(e) => {
                        setCountAnswer(e);
                      }}
                    />
                  </div>
                  <Button
                    type="primary"
                    shape="circle"
                    icon={<SettingOutlined />}
                    onClick={() => {
                      setIsSettingModalOpen(true);
                    }}
                  />
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      fontFamily: "Gilroy",
                      padding: "15px 30px",
                      height: "auto",
                      backgroundColor: "#e590ff",
                    }}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    Nhập nhanh
                  </Button>
                </div>

                <div className={styles.key_wrapper}>
                  {countAnswer > 0 &&
                    [...Array(countAnswer)].map((_, index) => (
                      <AnswerInputForAddHomeWork
                        key={index}
                        props={{ index, answer: correctAnswer?.[index] }}
                      />
                    ))}
                </div>
              </div>
            </div>
          </>
        )}

        <Modal
          title="Nhập nhanh đáp án"
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <p>
            Chuỗi đáp án viết liền không dấu (vd: ACDABCAD). Mỗi ký tự là 1 đáp
            án!
          </p>
          <Input
            style={{
              margin: "10px 0",
            }}
            size="large"
            onChange={(e) => {
              setCorrectAnswer(e.target.value.toUpperCase().split(""));
            }}
          />
          <p
            style={{
              fontWeight: "500",
              fontSize: "10px",
              marginLeft: "10px",
            }}
          >{`Bạn đã tạo ra ${correctAnswer?.length} đáp án`}</p>
        </Modal>

        <Modal
          title="Cài đặt bài tập"
          open={isSettingModalOpen}
          onOk={() => {
            setIsSettingModalOpen(false);
          }}
          onCancel={() => {
            setIsSettingModalOpen(false);
          }}
          footer={[
            <Button
              type="primary"
              style={{
                width: "100%",
                fontFamily: "Gilroy",
                padding: "10px 5px",
                height: "auto",
                fontSize: "18px",
              }}
              onClick={() => {
                setIsSettingModalOpen(false);
              }}
              key={1}
            >
              OK
            </Button>,
          ]}
        >
          <div className={styles.setting_wrapper}>
            <div className={styles.setting}>
              <span>Thời gian làm bài (phút)</span>
              <Switch
                value={hasTimeLimit}
                onChange={(e) => {
                  setHasTimeLimit(e);
                  if (e) setTimeLimit(30);
                }}
              />
            </div>

            {hasTimeLimit && (
              <InputNumber
                size="large"
                min={1}
                max={100000}
                defaultValue={30}
                value={timeLimit}
                style={{ width: "100%" }}
                onChange={(e) => {
                  setTimeLimit(e);
                }}
              />
            )}

            <div className={styles.setting}>
              <span>Thời gian bắt đầu</span>
              <Switch
                onChange={(e) => {
                  setHasTimeStart(e);
                }}
                value={hasTimeStart}
              />
            </div>

            {hasTimeStart && (
              <ConfigProvider>
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  onChange={(_, time) => {
                    setTimeStart(new Date(time).toISOString());
                    setTimeStartShow(dayjs(time, "YYYY-MM-DD HH:mm:ss"));
                  }}
                  value={timeStartShow}
                />
              </ConfigProvider>
            )}

            <div className={styles.setting}>
              <span>Hạn chót nộp bài</span>
              <Switch
                onChange={(e) => {
                  setHasDeadline(e);
                }}
                value={hasDeadline}
              />
            </div>

            {hasDeadline && (
              <ConfigProvider>
                <DatePicker
                  style={{ width: "100%" }}
                  showTime
                  onChange={(_, time) => {
                    console.log(time);
                    setDeadline(new Date(time).toISOString());
                    setDeadlineShow(dayjs(time, "YYYY-MM-DD HH:mm:ss"));
                    console.log(dayjs(time, "YYYY-MM-DD HH:mm:ss"));
                  }}
                  value={deadlineShow}
                />
              </ConfigProvider>
            )}

            <div className={styles.setting}>
              <span>Không xem lại</span>
              <Switch
                onChange={(e) => {
                  setHasReview(e);
                }}
                value={!hasReview}
              />
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                gap: "5px",
                marginTop: "10px",
              }}
            >
              <span>Thiết lập bảng điểm</span>
              <Select
                value={wayGetScore}
                style={{
                  width: "100%",
                }}
                options={[
                  {
                    value: "Lấy điểm lần làm bài đầu tiên",
                    label: "Lấy điểm lần làm bài đầu tiên",
                  },
                  {
                    value: "Lấy điểm lần làm bài mới nhất",
                    label: "Lấy điểm lần làm bài mới nhất",
                  },
                  {
                    value: "Lấy điểm lần làm bài cao nhất",
                    label: "Lấy điểm lần làm bài cao nhất",
                  },
                ]}
                onChange={(e) => {
                  setWayGetScore(e);
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <span>Số lần làm bài</span>
              <InputNumber
                size="large"
                min={1}
                max={100000}
                defaultValue={1}
                onChange={(e) => {
                  setTimesLimitDo(e);
                }}
                value={timesLimitDo}
              />
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}

const MemoizedDocViewer = React.memo(({ documents }) => (
  <DocViewer documents={documents} pluginRenderers={DocViewerRenderers} />
));

MemoizedDocViewer.propTypes = {
  documents: PropTypes.any,
};

export default EditHomework;
