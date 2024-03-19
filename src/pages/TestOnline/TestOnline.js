import { Menu, Table } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  convertDurationToStringV2,
  convertISOToCustomFormat,
} from "ultis/time";
import { auth, firestore } from "../../firebase";
import "./TestOnline.css";
import styles from "./TestOnline.module.css";

function TestOnline() {
  const navigate = useNavigate();
  const items = [
    {
      label: <div className={styles.menu_item}>ETS 2024</div>,
      key: "ets2024",
      styles: {
        color: "red",
      },
    },
    {
      label: <div className={styles.menu_item}>ETS 2023</div>,
      key: "ets2023",
    },
    {
      label: <div className={styles.menu_item}>ETS 2022</div>,
      key: "ets2022",
    },
    {
      label: <div className={styles.menu_item}>ETS 2021</div>,
      key: "ets2021",
    },
    {
      label: <div className={styles.menu_item_spec}>Lịch sử thi</div>,
      key: "result",
    },
  ];

  const [testSelected, setTestSelected] = useState("ets2024");
  const [exams, setExams] = useState(null);
  const [examsToShow, setExamsToShow] = useState(null);
  const [zenlishResults, setZenlishResults] = useState(null);

  const columns = [
    {
      title: "Tên test",
      dataIndex: "nameExam",
      key: "nameExam",
    },
    {
      title: "Nộp bài lúc",
      dataIndex: "dateCreate",
      key: "dateCreate",
    },
    {
      title: "Thời gian làm",
      dataIndex: "duration",
      key: "duration",
      align: "center",
    },
    {
      title: "Part1",
      dataIndex: "part1",
      key: "part1",
      align: "center",
    },
    {
      title: "Part2",
      dataIndex: "part2",
      key: "part2",
      align: "center",
    },
    {
      title: "Part3",
      dataIndex: "part3",
      key: "part3",
      align: "center",
    },
    {
      title: "Part4",
      dataIndex: "part4",
      key: "part4",
      align: "center",
    },
    {
      title: "Part5",
      dataIndex: "part5",
      key: "part5",
      align: "center",
    },
    {
      title: "Part6",
      dataIndex: "part6",
      key: "part6",
      align: "center",
    },
    {
      title: "Part7",
      dataIndex: "part7",
      key: "part7",
      align: "center",
    },
    {
      title: "Tổng",
      dataIndex: "total",
      key: "total",
      align: "center",
    },
  ];

  const convertToDataTable = (data) => {
    return data.map((el) => ({
      nameExam: el.nameExam,
      dateCreate: convertISOToCustomFormat(el.dateCreate),
      duration: convertDurationToStringV2(el.duration / 1000),
      part1: el.result.countCorrectPart1,
      part2: el.result.countCorrectPart2,
      part3: el.result.countCorrectPart3,
      part4: el.result.countCorrectPart4,
      part5: el.result.countCorrectPart5,
      part6: el.result.countCorrectPart6,
      part7: el.result.countCorrectPart7,
      total: el.result.countCorrect,
    }));
  };

  const onClick = (e) => {
    setTestSelected(e.key);
  };

  useEffect(() => {
    if (!exams) return;
    setExamsToShow(
      exams.filter((el) => el.name.includes(testSelected.toUpperCase()))
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testSelected]);

  useEffect(() => {
    const getExam = async (uid) => {
      const examRef = collection(firestore, "testonline");
      const querySnapshot = await getDocs(examRef);

      const examData = [];
      querySnapshot?.forEach((doc) => {
        examData.push({ id: doc.id, ...doc.data() });
      });
      setExams(examData);
      setExamsToShow(
        examData.filter((el) => el.name.includes(testSelected.toUpperCase()))
      );
    };
    getExam();

    const getDataZenlisResults = async (id) => {
      const quizzsRef = collection(firestore, "zenlish_results");
      const querySnapshot = await getDocs(
        query(quizzsRef, where("uidCreator", "==", id))
      );
      if (querySnapshot.empty) {
        setZenlishResults(null);
      } else {
        const _zenlishResults = [];
        querySnapshot.forEach((doc) => {
          _zenlishResults.push({ ...doc.data(), id: doc.id });
        });
        setZenlishResults(convertToDataTable(_zenlishResults));
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        getDataZenlisResults(auth.currentUser.uid);
        console.log("User is signed in:", user);
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   const a = async () => {
  //     const dataToAdd = { data: data, correct_answer: correct_answer };
  //     const quizzRef = doc(firestore, "testonline", "aB64bYR0ukxspXRRH8sS");
  //     await updateDoc(quizzRef, dataToAdd);
  //   };

  //   a();
  // }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.menu}>
        <Menu
          onClick={onClick}
          selectedKeys={[testSelected]}
          mode="horizontal"
          items={items}
          disabled={!exams}
        />
      </div>

      {examsToShow && (
        <div className={styles.container}>
          {examsToShow.map((test) => (
            <TestItem props={test} navigate={navigate} />
          ))}
        </div>
      )}

      {testSelected === "result" && (
        <div className={styles.result_wrapper}>
          <Table
            pagination={{
              position: ["none", "none"],
            }}
            style={{ width: "100%" }}
            columns={columns}
            dataSource={zenlishResults}
          />
        </div>
      )}
    </div>
  );
}

const TestItem = ({ props, navigate }) => {
  const { id, name } = props;
  const _nameTest = name.split("-");
  const nameTest = _nameTest[1].trim() + "-" + _nameTest[0].trim();

  return (
    <div
      className={styles.test_item}
      onClick={() => {
        navigate(`${id}/${nameTest}/exam`);
      }}
    >
      <div className={styles.img}>{name}</div>
      <div className={styles.item_info}>
        <div
          style={{
            fontSize: "18px",
            color: "#333333",
            textTransform: "uppercase",
          }}
        >
          {name}
        </div>
        <div style={{ fontSize: "14px", color: "#bbbbbb", fontWeight: "500" }}>
          17812 lượt hoàn thành
        </div>
        <div style={{ fontSize: "14px", color: "#bbbbbb", fontWeight: "500" }}>
          29/06/2023 22:45
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button>Test ngay</button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`${id}/${nameTest}`);
            }}
          >
            Chọn từng part
          </button>
        </div>
      </div>
    </div>
  );
};

TestItem.propTypes = {
  props: PropTypes.any,
  id: PropTypes.any,
  name: PropTypes.any,
};

export default TestOnline;
