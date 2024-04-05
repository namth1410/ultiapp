import { Table } from "antd";
import {
  getAllResultOfHomework,
  getUsersNotDoHomework,
} from "appdata/homework/homeworkSlice";
import { useClass } from "contexts/class_context/ClassContext";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { convertDurationToString, convertISOToCustomFormat } from "ultis/time";
import styles from "./DetailHomeWork.module.css";

function DetailHomeWork() {
  const splitRecordId = window.location.pathname.split("/");
  const homeworkId = splitRecordId[4];

  const dispatch = useDispatch();
  const { dataClass } = useClass();

  const homeworkRedux = useSelector((state) => state.homeworkRedux);

  const [dataTable, setDataTable] = useState(null);
  const [dataUserNotDoHomework, setDataUserNotDoHomework] = useState(null);
  const [allResultOfHomework, setAllResultOfHomework] = useState(null);
  const [usersNotDoHomeworkInfo, setUsersNotDoHomeworkInfo] = useState(null);
  const [option, setOption] = useState("Tất cả");

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
      align: "center",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
      align: "center",
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Ngày nộp",
      dataIndex: "timeSubmit",
      key: "timeSubmit",
      align: "center",
    },
  ];

  const convertToDataTable = (data) => {
    if (!data) return;
    return data.map((el, index) => ({
      name: el.username || el.displayName,
      score: "--",
      duration: el.timeSpent
        ? convertDurationToString(el.timeSpent / 1000)
        : "--",
      timeSubmit: el.dateCreate
        ? convertISOToCustomFormat(el.dateCreate)
        : "--",
    }));
  };

  useEffect(() => {
    if (!allResultOfHomework) return;
    if (option === "Tất cả") {
      setDataTable(convertToDataTable(allResultOfHomework) || []);
    } else {
      setDataTable(convertToDataTable(usersNotDoHomeworkInfo) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option]);

  useEffect(() => {
    if (!dataUserNotDoHomework) return;
    dispatch(getUsersNotDoHomework(dataUserNotDoHomework));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUserNotDoHomework]);

  useEffect(() => {
    if (!dataClass || !allResultOfHomework) return;
    const userDoHomework = allResultOfHomework.map((el) => el.userUid);
    setDataUserNotDoHomework(
      dataClass.members.filter((item) => !userDoHomework.includes(item))
    );
    if (option === "Tất cả") {
      setDataTable(convertToDataTable(allResultOfHomework) || []);
    } else {
      setDataTable(convertToDataTable(dataUserNotDoHomework) || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allResultOfHomework]);

  useEffect(() => {
    setUsersNotDoHomeworkInfo(homeworkRedux.usersNotDoHomework);
    setAllResultOfHomework(homeworkRedux.allResultOfHomework);
  }, [homeworkRedux]);

  useEffect(() => {
    dispatch(getAllResultOfHomework({ homeworkId: homeworkId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tools_box}>
        <button
          style={{
            backgroundColor: option === "Tất cả" ? "#1E88E5" : "#E7E8EF",
            color: option === "Tất cả" ? "#fff" : "unset",
          }}
          onClick={() => {
            setOption("Tất cả");
          }}
        >
          Tất cả
        </button>
        <button
          style={{
            backgroundColor: option === "Chưa làm" ? "#1E88E5" : "#E7E8EF",
            color: option === "Chưa làm" ? "#fff" : "unset",
          }}
          onClick={() => {
            setOption("Chưa làm");
          }}
          disabled={!allResultOfHomework}
        >
          Chưa làm
        </button>
      </div>

      <div className={styles.content}>
        <div
          style={{
            width: "100%",
          }}
        >
          <Table columns={columns} dataSource={dataTable} />
        </div>
      </div>
    </div>
  );
}

export default DetailHomeWork;
