import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Select, Table } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { convertDurationToString, convertISOToCustomFormat } from "ultis/time";
import { auth, firestore } from "../../../../firebase";
import styles from "./DetailRecordHomework.module.css";

function DetailRecordHomework() {
  const splitRecordId = window.location.pathname.split("/");
  const homeworkId = splitRecordId[4];

  const [dataDetailRecordHomework, setDataDetailRecordHomework] =
    useState(null);
  const [recordsOfHomework, setRecordsOfHomework] = useState(null);
  const [options, setOptions] = useState([]);

  const [dataRecord, setDataRecord] = useState(null);
  const [countAnswerCorrect, setCountAnswerCorrect] = useState(0);
  const [countAnswerIncorrect, setCountAnswerIncorrect] = useState(0);
  const [countAnswerNotDo, setCountAnswerNotDo] = useState(0);

  const columns = [
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        return (
          <span
            style={{
              backgroundColor:
                status[0] === " "
                  ? "#a3a7b4"
                  : status[0] !== status[1]
                  ? "#d32f2f"
                  : "#388e3c",
            }}
            className={styles.dot}
          ></span>
        );
      },
    },
    {
      title: "Câu",
      dataIndex: "index",
      key: "index",
      align: "center",
    },
    {
      title: "Chọn",
      dataIndex: "answer",
      key: "answer",
      align: "center",
    },
    {
      title: "Đáp án đúng",
      dataIndex: "correct_answer",
      key: "correct_answer",
      align: "center",
    },
  ];

  const convertToDataTable = (data) => {
    return data.correctAnswer.map((el, index) => ({
      status: [data.answer[index], el],
      index: index + 1,
      answer: data.answer[index],
      correct_answer: el,
    }));
  };

  const memoizedDocuments = useMemo(() => {
    return [
      {
        uri: dataDetailRecordHomework?.fileURL,
      },
    ];
  }, [dataDetailRecordHomework?.fileURL]);

  function compareAnswers(answer, correctAnswer) {
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    for (let i = 0; i < correctAnswer.length; i++) {
      if (answer[i] === " ") {
        unansweredCount++;
      } else if (answer[i] === correctAnswer[i]) {
        correctCount++;
      } else {
        wrongCount++;
      }
    }
    setCountAnswerCorrect(correctCount);
    setCountAnswerIncorrect(wrongCount);
    setCountAnswerNotDo(unansweredCount);
  }

  useEffect(() => {
    if (!dataDetailRecordHomework) return;
    compareAnswers(
      dataDetailRecordHomework.answer,
      dataDetailRecordHomework.correctAnswer
    );
    setDataRecord(convertToDataTable(dataDetailRecordHomework));
  }, [dataDetailRecordHomework]);

  useEffect(() => {
    const getDataRecordsHomework = async () => {
      const QuerySnapshot = await getDocs(
        query(
          collection(firestore, "homework_results"),
          where("userUid", "==", auth.currentUser.uid),
          where("homework_id", "==", homeworkId),
          orderBy("dateCreate", "asc")
        )
      );

      if (QuerySnapshot.empty) {
        setRecordsOfHomework(null);
        return;
      }
      const records = [];

      QuerySnapshot.forEach((doc) => {
        records.push({ ...doc.data(), id: doc.id });
      });
      console.log(records);
      setOptions(
        records.map((el, index) => {
          return {
            value: index + 1,
            label: `Lần làm bài ${index + 1}`,
          };
        })
      );
      setDataDetailRecordHomework(records[0]);
      setDataRecord(convertToDataTable(records[0]));
      setRecordsOfHomework(records);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        getDataRecordsHomework();
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      {dataDetailRecordHomework && (
        <>
          <div className={styles.left_box}>
            <MemoizedDocViewer documents={memoizedDocuments} />
          </div>
          <div className={styles.right_box}>
            <div className={styles.scrollbar}>
              <div className={styles.a0}>
                <Select
                  style={{
                    width: "100%",
                    marginBottom: "10px",
                  }}
                  defaultValue={1}
                  onChange={(e) => {
                    setDataDetailRecordHomework(recordsOfHomework[e - 1]);
                  }}
                  options={options}
                />
              </div>
              <div className={styles.a1}>0/10</div>
              <div className={styles.a2}>
                <div className={styles.a3}>
                  <span>Thời gian</span>
                  <span>
                    {convertDurationToString(
                      dataDetailRecordHomework.timeSpent / 1000
                    )}
                  </span>
                </div>

                <div className={styles.a3}>
                  <span>Nộp lúc</span>
                  <span>
                    {convertISOToCustomFormat(
                      dataDetailRecordHomework.dateCreate
                    )}
                  </span>
                </div>

                <div className={styles.a3}>
                  <span>
                    <span
                      style={{ backgroundColor: "#388e3c" }}
                      className={styles.dot}
                    ></span>{" "}
                    Số câu đúng
                  </span>
                  <span>{countAnswerCorrect}</span>
                </div>

                <div className={styles.a3}>
                  <span>
                    <span
                      style={{ backgroundColor: "#d32f2f" }}
                      className={styles.dot}
                    ></span>{" "}
                    Số câu sai
                  </span>
                  <span>{countAnswerIncorrect}</span>
                </div>

                <div className={styles.a3}>
                  <span>
                    <span
                      style={{ backgroundColor: "#a3a7b4" }}
                      className={styles.dot}
                    ></span>{" "}
                    Số câu chưa làm
                  </span>
                  <span>{countAnswerNotDo}</span>
                </div>
              </div>

              <div className={styles.answer}>
                <div style={{ marginBottom: "20px" }}>Phiếu bài làm</div>
                <div>
                  <Table columns={columns} dataSource={dataRecord} />
                </div>
              </div>
            </div>
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

export default DetailRecordHomework;
