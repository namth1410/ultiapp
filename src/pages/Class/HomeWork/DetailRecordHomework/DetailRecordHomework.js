import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { doc, getDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import React, { useEffect, useMemo, useState } from "react";
import { firestore } from "../../../../firebase";
import styles from "./DetailRecordHomework.module.css";
import { convertISOToCustomFormat } from "ultis/time";
import { Table } from "antd";

const splitRecordId = window.location.pathname.split("/");
const recordId = splitRecordId[splitRecordId.length - 1];

function DetailRecordHomework() {
  const [dataDetailRecordHomework, setDataDetailRecordHomework] =
    useState(null);

  const [dataRecord, setDataRecord] = useState(null);

  const columns = [
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => {
        console.log(status);
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
    return data.correctAnswer.split("").map((el, index) => ({
      status: [data.answer.split("")[index], el],
      index: index + 1,
      answer: data.answer.split("")[index],
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

  useEffect(() => {
    const getDataDetailRecordHomework = async () => {
      const recordRef = doc(firestore, "homework_results", recordId);
      const docSnapshot = await getDoc(recordRef);
      console.log(docSnapshot.data());
      console.log(docSnapshot.id);
      setDataDetailRecordHomework({
        id: docSnapshot.id,
        ...docSnapshot.data(),
      });
      setDataRecord(convertToDataTable(docSnapshot.data()));
    };
    getDataDetailRecordHomework();
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
              <div className={styles.a1}>0/10</div>
              <div className={styles.a2}>
                <div className={styles.a3}>
                  <span>Thời gian</span>
                  <span>45 phút</span>
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
                  <span>2</span>
                </div>

                <div className={styles.a3}>
                  <span>
                    <span
                      style={{ backgroundColor: "#d32f2f" }}
                      className={styles.dot}
                    ></span>{" "}
                    Số câu sai
                  </span>
                  <span>2</span>
                </div>

                <div className={styles.a3}>
                  <span>
                    <span
                      style={{ backgroundColor: "#a3a7b4" }}
                      className={styles.dot}
                    ></span>{" "}
                    Số câu chưa làm
                  </span>
                  <span>40</span>
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
