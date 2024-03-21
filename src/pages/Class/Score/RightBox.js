import { Table } from "antd";
import { useEffect, useState } from "react";
import {
  convertDurationToStringV2,
  convertISOToCustomFormat,
} from "ultis/time";
import styles from "./RightBox.module.css";
import { useScore } from "./ScoreContext";

function RightBox() {
  const { studentHomeworkData } = useScore();

  const [dataTable, setDataTable] = useState(null);

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Nộp bài lúc",
      dataIndex: "dateCreate",
      key: "dateCreate",
      align: "center",
    },
    {
      title: "Thời gian làm bài",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      align: "center",
      sorter: (a, b) => a.score > b.score,
    },
  ];

  const convertToDataTable = (data) => {
    return data.map((el, index) => ({
      name: el.username,
      dateCreate: convertISOToCustomFormat(el.dateCreate),
      duration: convertDurationToStringV2(el.timeSpent / 100),
      score: Math.random(),
    }));
  };

  useEffect(() => {
    if (!studentHomeworkData) {
      setDataTable(null);
      return;
    }
    setDataTable(convertToDataTable(studentHomeworkData));
  }, [studentHomeworkData]);

  return (
    <div className={styles.wrapper}>
      <Table columns={columns} dataSource={dataTable} />
    </div>
  );
}

export default RightBox;
