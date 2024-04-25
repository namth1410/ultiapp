import { Menu, Table } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  convertDurationToStringV2,
  convertISOToCustomFormat,
} from "ultis/time";
import { auth, firestore } from "../../firebase";
import "./TestOnline.css";
import styles from "./TestOnline.module.scss";

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
      sorter: (a, b) => a.dateCreate.localeCompare(b.dateCreate),
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
      title: "LC",
      dataIndex: "lc",
      key: "lc",
      align: "center",
    },
    {
      title: "RC",
      dataIndex: "rc",
      key: "rc",
      align: "center",
    },
    {
      title: "Tổng điểm",
      dataIndex: "score",
      key: "score",
      align: "center",
    },
  ];

  const convertToScoreLC = (totalCorrect) => {
    if (totalCorrect < 7) {
      return 5;
    } else if (totalCorrect < 26) {
      return (totalCorrect - 5) * 5;
    } else if (totalCorrect < 35) {
      return (totalCorrect - 4) * 5;
    } else if (totalCorrect < 44) {
      return (totalCorrect - 3) * 5;
    } else if (totalCorrect < 47) {
      return (totalCorrect - 2) * 5;
    } else if (totalCorrect === 47) {
      return 230;
    } else if (totalCorrect < 57) {
      return totalCorrect * 5;
    } else if (totalCorrect < 96) {
      return (totalCorrect + 1) * 5;
    } else {
      return 495;
    }
  };

  const convertToScoreRC = (totalCorrect) => {
    if (totalCorrect < 16) {
      return 5;
    } else if (totalCorrect < 25) {
      return (totalCorrect - 14) * 5;
    } else if (totalCorrect < 28) {
      return (totalCorrect - 13) * 5;
    } else if (totalCorrect < 33) {
      return (totalCorrect - 12) * 5;
    } else if (totalCorrect < 38) {
      return (totalCorrect - 11) * 5;
    } else if (totalCorrect < 41) {
      return (totalCorrect - 10) * 5;
    } else if (totalCorrect < 46) {
      return (totalCorrect - 9) * 5;
    } else if (totalCorrect < 49) {
      return (totalCorrect - 8) * 5;
    } else if (totalCorrect < 56) {
      return (totalCorrect - 7) * 5;
    } else if (totalCorrect < 61) {
      return (totalCorrect - 6) * 5;
    } else if (totalCorrect < 64) {
      return (totalCorrect - 5) * 5;
    } else if (totalCorrect < 67) {
      return (totalCorrect - 4) * 5;
    } else if (totalCorrect < 72) {
      return (totalCorrect - 3) * 5;
    } else if (totalCorrect < 77) {
      return (totalCorrect - 2) * 5;
    } else if (totalCorrect < 89) {
      return (totalCorrect - 1) * 5;
    } else if (totalCorrect < 92) {
      return totalCorrect * 5;
    } else if (totalCorrect < 94) {
      return (totalCorrect + 1) * 5;
    } else if (totalCorrect < 97) {
      return (totalCorrect + 2) * 5;
    } else {
      return 495;
    }
  };

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
      lc: convertToScoreLC(
        el.result.countCorrectPart1 +
          el.result.countCorrectPart2 +
          el.result.countCorrectPart3 +
          el.result.countCorrectPart4
      ),
      rc: convertToScoreRC(
        el.result.countCorrectPart5 +
          el.result.countCorrectPart6 +
          el.result.countCorrectPart7
      ),
      score:
        convertToScoreLC(
          el.result.countCorrectPart1 +
            el.result.countCorrectPart2 +
            el.result.countCorrectPart3 +
            el.result.countCorrectPart4
        ) +
        convertToScoreRC(
          el.result.countCorrectPart5 +
            el.result.countCorrectPart6 +
            el.result.countCorrectPart7
        ),
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
        query(
          quizzsRef,
          where("uidCreator", "==", id),
          orderBy("dateCreate", "desc")
        )
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
            <TestItem key={test.id} props={test} navigate={navigate} />
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
            color: "var(--text-color-primary)",
            textTransform: "uppercase",
          }}
          className={styles.name_test}
        >
          {name}
        </div>
        <div
          className={styles.sub_text}
          style={{ fontSize: "14px", color: "#bbbbbb", fontWeight: "500" }}
        >
          17812 lượt hoàn thành
        </div>
        <div
          className={styles.sub_text}
          style={{ fontSize: "14px", color: "#bbbbbb", fontWeight: "500" }}
        >
          29/06/2023 22:45
        </div>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
          className={styles.btn_wrapper}
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
