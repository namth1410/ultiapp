import { PlusOutlined } from "@ant-design/icons";
import { Button, Table } from "antd";
import { useClass } from "contexts/class_context/ClassContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";
import styles from "./HomeWork.module.css";
import { useHomework } from "contexts/homework_context/HomeworkContext";

function HomeWork() {
  const navigate = useNavigate();

  const { classId, dataClass, dataHomework } = useClass();
  const { selectedHomework, setSelectedHomework } = useHomework();

  const [homeworkData, setHomeworkData] = useState([]);

  const columns = [
    {
      title: "Tên bài tập",
      dataIndex: "name",
      key: "name",
    },
  ];

  const convertToDataTable = (data) => {
    console.log(data);
    return data.map((el) => ({
      key: el.id,
      name: el.nameHomework,
    }));
  };

  useEffect(() => {
    if (!dataHomework) return;
    setHomeworkData(convertToDataTable(dataHomework));
  }, [dataHomework]);

  return (
    <>
      {dataClass?.uidCreator !== auth?.currentUser?.uid ? (
        <div>
          <div className={styles.tools}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                navigate(`${window.location.pathname}/add`);
              }}
            >
              Tạo bài tập
            </Button>
          </div>

          <div></div>
        </div>
      ) : (
        <div style={{ display: "flex", width: "100%" }}>
          <Table
            style={{
              width: "70%",
              borderRight: "1px solid rgb(216, 220, 240)",
            }}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setSelectedHomework(
                    dataHomework.find((el) => el.id === record.key)
                  );
                },
              };
            }}
            columns={columns}
            dataSource={homeworkData}
          />

          {selectedHomework && (
            <div className={styles.right_box}>
              <h3>{selectedHomework.nameHomework}</h3>

              <div className={styles.info_homework_item}>
                <span>Số lần làm bài</span>
                <span>1</span>
              </div>

              <div className={styles.info_homework_item}>
                <span>Đã làm</span>
                <span>0/1</span>
              </div>

              <div className={styles.info_homework_item}>
                <span>Ngày tạo</span>
                <span>05 tháng 03</span>
              </div>

              <div className={styles.info_homework_item}>
                <span>Thời lượng</span>
                <span>Không</span>
              </div>

              <div className={styles.info_homework_item}>
                <span>Hạn chót</span>
                <span>07/03</span>
              </div>

              <Button
                type="primary"
                size="large"
                style={{
                  fontFamily: "Gilroy",
                  padding: "15px 30px",
                  height: "auto",
                }}
                onClick={() => {
                  navigate(`/class/${classId}/homework/${selectedHomework.id}/test`);
                }}
              >
                Làm bài
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default HomeWork;
