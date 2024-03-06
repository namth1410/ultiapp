import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Button, Input, InputNumber, Modal, Spin } from "antd";
import j1 from "assets/img/j1.json";
import j2 from "assets/img/j2.json";
import AnswerInputForAddHomeWork from "components/AnswerInputForAddHomeWork/AnswerInputForAddHomeWork";
import { useAddHomeWork } from "contexts/add_homework_context/AddHomeWorkContext";
import { useClass } from "contexts/class_context/ClassContext";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import Lottie from "lottie-react";
import PropTypes from "prop-types";
import React, { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";
import { auth, firestore, storage } from "../../../../firebase";
import styles from "./AddHomeWork.module.css";

let fileURL = "";

function AddHomeWork() {
  const { classId } = useClass();
  const { answer, setAnswer, countAnswer, setCountAnswer } = useAddHomeWork();

  const nameHomeworkInputRef = useRef(null);
  const hiddenFileInput = useRef(null);

  const [selectedDocs, setSelectedDocs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
    setCountAnswer(answer.length);
  };
  const handleCancel = () => {
    setAnswer(null);
    setIsModalOpen(false);
  };

  const uploadFile = async () => {
    const file = selectedDocs[0];
    const storageRef = ref(storage, `Homework/${file.name}`);

    await uploadBytes(storageRef, file)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        console.log("File available at", downloadURL);
        fileURL = downloadURL;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const createHomework = async () => {
    if (nameHomeworkInputRef.current.input.value === "") {
      toast.error("Bạn chưa nhập tên bài tập", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    setIsLoading(true);
    await uploadFile();
    const dataToAdd = {
      dateCreate: new Date().toISOString(),
      uidCreator: auth.currentUser.uid,
      nameCreator: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      fileURL: fileURL,
      answer: answer,
      class: classId,
      nameHomework: nameHomeworkInputRef.current.input.value,
    };
    console.log(dataToAdd);

    const docRef = await addDoc(collection(firestore, "homework"), dataToAdd);
    console.log(docRef);
    setIsLoading(false);
    toast.success("Đã thêm mới 1 quizz", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const memoizedDocuments = useMemo(
    () =>
      selectedDocs.map((file) => ({
        uri: window.URL.createObjectURL(file),
        fileName: file.name,
      })),
    [selectedDocs]
  );

  return (
    <div className={styles.wrapper}>
      {selectedDocs.length === 0 && (
        <div
          style={{
            display: "flex",
          }}
        >
          <div className={styles.option}>
            <div className={styles.anim}>
              <Lottie animationData={j1} loop={true} />
            </div>
            <div className={styles.title}>Giữ nguyên định dạng</div>
            <div className={styles.description}>
              Đề bài được giữ nguyên và hiển thị khi làm bài
            </div>
            <Button
              type="primary"
              size="large"
              style={{
                fontFamily: "Gilroy",
                padding: "15px 30px",
                height: "auto",
              }}
            >
              Tải lên
            </Button>
          </div>

          <div className={styles.option}>
            <div className={styles.anim}>
              <Lottie animationData={j2} loop={true} />
            </div>
            <div className={styles.title}>Tách câu tự động</div>
            <div className={styles.description}>
              Nhận diện đề trắc nghiệm, tiếng anh từ file Word, PDF
            </div>
            <label htmlFor="fileUpload" style={{ cursor: "pointer" }}>
              <Button
                type="primary"
                size="large"
                style={{
                  fontFamily: "Gilroy",
                  padding: "15px 30px",
                  height: "auto",
                }}
                onClick={() => {
                  hiddenFileInput.current.click();
                }}
              >
                Tải File
              </Button>
            </label>
            <input
              id="fileUpload"
              type="file"
              accept=".pdf"
              multiple
              ref={hiddenFileInput}
              onChange={(el) =>
                el.target.files?.length &&
                setSelectedDocs(Array.from(el.target.files))
              }
              style={{ display: "none" }}
            />
          </div>
        </div>
      )}

      {selectedDocs.length > 0 && (
        <div className={styles.container}>
          <div className={styles.header_wrapper}>
            <div style={{ fontSize: "18px", color: "#3b3b3b" }}>
              Thêm bài tập
            </div>
            <div style={{ display: "flex" }}>
              <Input
                ref={nameHomeworkInputRef}
                placeholder="Nhập tên bài tập"
                size="large"
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
              onClick={createHomework}
            >
              Tạo bài tập
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
                      props={{ index, answer: answer?.[index] }}
                    />
                  ))}
              </div>
            </div>
          </div>

          <Modal
            title="Nhập nhanh đáp án"
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
          >
            <p>
              Chuỗi đáp án viết liền không dấu (vd: ACDABCAD). Mỗi ký tự là 1
              đáp án!
            </p>
            <Input
              style={{
                margin: "10px 0",
              }}
              size="large"
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
            />
            <p
              style={{
                fontWeight: "500",
                fontSize: "10px",
                marginLeft: "10px",
              }}
            >{`Bạn đã tạo ra ${answer?.length} đáp án`}</p>
          </Modal>
        </div>
      )}

      {isLoading && (
        <>
          <div className="overlay"></div>
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              translate: "-50% -20%",
              zIndex: 3000,
              width: "200px",
              height: "200px",
            }}
          >
            <Spin size="large">
              <div className="content" />
            </Spin>
          </div>
        </>
      )}
    </div>
  );
}

const MemoizedDocViewer = React.memo(({ documents }) => (
  <DocViewer documents={documents} pluginRenderers={DocViewerRenderers} />
));

MemoizedDocViewer.propTypes = {
  documents: PropTypes.any,
};

export default AddHomeWork;
