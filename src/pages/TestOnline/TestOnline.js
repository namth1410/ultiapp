import { Menu } from "antd";
import { collection, getDocs } from "firebase/firestore";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore } from "../../firebase";
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
  ];

  const [testSelected, setTestSelected] = useState("ets2024");
  const [exams, setExams] = useState(null);
  const [examsToShow, setExamsToShow] = useState(null);

  const onClick = (e) => {
    console.log("click ", e);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   const a = async () => {
  //     const dataToAdd = { data: data, correct_answer: correct_answer };
  //     const quizzRef = doc(firestore, "testonline", "YHv3lmwvA9t6PjCZBFEm");
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
        />
      </div>

      {examsToShow && (
        <div className={styles.container}>
          {examsToShow.map((test) => (
            <TestItem props={test} navigate={navigate} />
          ))}
        </div>
      )}
    </div>
  );
}

const TestItem = ({ props, navigate }) => {
  const { id, name } = props;
  console.log(props);
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
