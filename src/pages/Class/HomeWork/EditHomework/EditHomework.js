import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Button, Input, InputNumber, Modal } from "antd";
import AnswerInputForAddHomeWork from "components/AnswerInputForAddHomeWork/AnswerInputForAddHomeWork";
import { useAddHomeWork } from "contexts/add_homework_context/AddHomeWorkContext";
import { useClass } from "contexts/class_context/ClassContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, firestore } from "../../../../firebase";
import styles from "./EditHomework.module.css";

function EditHomework() {
  const homeworkId = window.location.pathname.split("/")[4];

  const navigate = useNavigate();
  const { classId } = useClass();
  const { correctAnswer, setCorrectAnswer, countAnswer, setCountAnswer } =
    useAddHomeWork();

  const nameHomeworkInputRef = useRef(null);

  const [dataHomework, setDataHomework] = useState(null);
  const [nameHomework, setNameHomework] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    const homeworkRef = doc(firestore, "homework", dataHomework.id);
    const docSnap = await getDoc(homeworkRef);
    if (docSnap.exists()) {
      const dataToAdd = {
        dateCreate: new Date().toISOString(),
        uidCreator: auth.currentUser.uid,
        nameCreator: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        fileURL: dataHomework.fileURL,
        correctAnswer: correctAnswer,
        class: classId,
        nameHomework: nameHomeworkInputRef.current.input.value,
      };

      await updateDoc(homeworkRef, dataToAdd);
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
      navigate(`/class/${classId}/homework`);
    }
  };

  useEffect(() => {
    if (!dataHomework) return;
    setCountAnswer(dataHomework.correctAnswer.length);
    setCorrectAnswer(dataHomework.correctAnswer.join(""));
    setNameHomework(dataHomework.nameHomework);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataHomework]);

  useEffect(() => {
    const getDataHomework = async () => {
      const homeworkRef = doc(firestore, "homework", homeworkId);
      const docSnapshot = await getDoc(homeworkRef);
      console.log(docSnapshot.data());
      console.log(docSnapshot.id);
      setDataHomework({ id: docSnapshot.id, ...docSnapshot.data() });
    };
    getDataHomework();
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
