import { Table } from "antd";
import { useClass } from "contexts/class_context/ClassContext";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { convertDurationToString, convertISOToCustomFormat } from "ultis/time";
import { auth, firestore } from "../../../../firebase";
import styles from "./DetailHomeWork.module.css";

const splitRecordId = window.location.pathname.split("/");
const homeworkId = splitRecordId[4];

function DetailHomeWork() {
  const { dataClass } = useClass();

  const [dataTable, setDataTable] = useState(null);
  const [dataUserNotDoHomework, setDataUserNotDoHomework] = useState(null);
  const [dataHomework, setDataHomework] = useState(null);
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

    const promises = dataUserNotDoHomework.map((uid) =>
      getDocs(query(collection(firestore, "users"), where("uid", "==", uid)))
    );

    Promise.all(promises)
      .then((docs) => {
        const userData = docs.map(
          (querySnapshot) => querySnapshot.docs.map((doc) => doc.data())[0]
        );
        setUsersNotDoHomeworkInfo(userData);
      })
      .catch((error) => {
        console.error("Error getting user information:", error);
      });
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
  }, [allResultOfHomework, dataHomework]);

  useEffect(() => {
    const homeworkRef = doc(firestore, "homework", homeworkId);

    const unsub = onSnapshot(homeworkRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const homeworkData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataHomework(homeworkData);
      } else {
        console.log("Không tìm thấy homework với id đã cho");
      }
    });

    const q = query(
      collection(firestore, "homework_results"),
      where("homework_id", "==", homeworkId),
      orderBy("dateCreate", "asc")
    );

    const unsub1 = onSnapshot(q, (QuerySnapshot) => {
      if (QuerySnapshot.empty) {
        setAllResultOfHomework(null);
        return;
      }
      const records = [];

      QuerySnapshot.forEach((doc) => {
        records.push({ ...doc.data(), id: doc.id });
      });

      setAllResultOfHomework(records);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
      unsub();
      unsub1();
    };
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
