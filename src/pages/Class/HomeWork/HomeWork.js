import {
  DeleteOutlined,
  DesktopOutlined,
  EditOutlined,
  PartitionOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Modal, Table } from "antd";
import { useClass } from "contexts/class_context/ClassContext";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../../../firebase";
import styles from "./HomeWork.module.css";

import { useHomework } from "contexts/homework_context/HomeworkContext";
import { convertISOToCustomFormat } from "ultis/time";

function HomeWork() {
  const navigate = useNavigate();

  const { classId, dataClass, dataHomework } = useClass();
  const { selectedHomework, setSelectedHomework } = useHomework();

  const [homeworkData, setHomeworkData] = useState([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [hasReview, setHasReview] = useState(false);
  const [canDoHomework, setCanDoHomework] = useState(false);
  const [recordsOfSelectedHomework, setRecordsOfSelectedHomework] =
    useState(null);
  const [isModalDeleteHomeworkOpen, setIsModalDeleteHomeworkOpen] =
    useState(false);

  const columns = [
    {
      title: "Tên bài tập",
      dataIndex: "name",
      key: "name",
      render: (_, { name }) => {
        return {
          props: {
            style: {
              background:
                name === selectedHomework?.nameHomework ? "#e3f2fd" : "unset",
            },
          },
          children: <div>{name}</div>,
        };
      },
    },
  ];

  const convertToDataTable = (data) => {
    return data.map((el) => ({
      key: el.id,
      name: el.nameHomework,
    }));
  };

  const onDeleteHomework = async () => {
    deleteDoc(doc(firestore, "homework", selectedHomework.id))
      .then((result) => {
        setIsModalDeleteHomeworkOpen(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    if (!dataHomework) return;
    setHomeworkData(convertToDataTable(dataHomework));
  }, [dataHomework]);

  const checkCanDoHomework = () => {
    const now = new Date().toISOString();
    const timeStart = selectedHomework.config.timeStart;
    const deadline = selectedHomework.config.deadline;
    if (timeStart && deadline) {
      if (now < timeStart || now > deadline) {
        setCanDoHomework(false);
      } else {
        setCanDoHomework(true);
      }
    } else if (!timeStart && !deadline) {
      setCanDoHomework(true);
    } else if (!timeStart && now > deadline) {
      setCanDoHomework(false);
    } else if (!deadline && now < timeStart) {
      setCanDoHomework(false);
    }
  };

  useEffect(() => {
    if (selectedHomework) {
      checkCanDoHomework();
      setHasReview(selectedHomework.config.hasReview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHomework]);

  useEffect(() => {
    if (!selectedHomework) return;

    const q = query(
      collection(firestore, "homework_results"),
      where("userUid", "==", auth.currentUser.uid),
      where("homework_id", "==", selectedHomework.id),
      orderBy("dateCreate", "asc")
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      if (QuerySnapshot.empty) {
        setIsAnswered(false);
        checkCanDoHomework();
        setRecordsOfSelectedHomework(null);
        return;
      }
      const records = [];
      QuerySnapshot.forEach((doc) => {
        records.push({ ...doc.data(), id: doc.id });
      });
      setRecordsOfSelectedHomework(records);

      setIsAnswered(true);
    });
    return () => unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHomework]);

  return (
    <div className={styles.wrapper}>
      {dataClass?.uidCreator === auth?.currentUser?.uid && (
        <div style={{ display: "flex", width: "100%" }}>
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
        </div>
      )}
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <Table
          style={{
            width: "70%",
            borderRight: "1px solid rgb(216, 220, 240)",
            height: "100%",
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
              <span>
                {selectedHomework.config.timesLimitDo
                  ? selectedHomework.config.timesLimitDo
                  : "NaN"}
              </span>
            </div>

            <div className={styles.info_homework_item}>
              <span>Ngày tạo</span>
              <span>
                {selectedHomework.dateCreate
                  ? convertISOToCustomFormat(selectedHomework.dateCreate)
                  : "NaN"}
              </span>
            </div>

            <div className={styles.info_homework_item}>
              <span>Thời gian bắt đầu</span>
              <span>
                {selectedHomework.config.timeStart
                  ? convertISOToCustomFormat(selectedHomework.config.timeStart)
                  : "NaN"}
              </span>
            </div>

            <div className={styles.info_homework_item}>
              <span>Hạn chót</span>
              <span>
                {selectedHomework.config.deadline
                  ? convertISOToCustomFormat(selectedHomework.config.deadline)
                  : "NaN"}
              </span>
            </div>

            <div className={styles.info_homework_item}>
              <span>Thời gian làm bài</span>
              <span>
                {selectedHomework.config.timeLimit
                  ? selectedHomework.config.timeLimit
                  : "NaN"}
              </span>
            </div>

            {dataClass?.uidCreator !== auth?.currentUser?.uid ? (
              <>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    fontFamily: "Gilroy",
                    padding: "15px 30px",
                    height: "auto",
                  }}
                  disabled={!canDoHomework}
                  onClick={() => {
                    navigate(
                      `/class/${classId}/homework/${selectedHomework.id}/test`
                    );
                  }}
                >
                  Làm bài
                </Button>
                {isAnswered && (
                  <Button
                    type="primary"
                    size="large"
                    style={{
                      fontFamily: "Gilroy",
                      padding: "15px 30px",
                      height: "auto",
                      marginTop: "20px",
                    }}
                    disabled={!hasReview}
                    onClick={() => {
                      navigate(
                        `/class/${classId}/homework/${selectedHomework.id}/detail/${recordsOfSelectedHomework[0].id}`
                      );
                    }}
                  >
                    Xem chi tiết
                  </Button>
                )}
              </>
            ) : (
              <div
                style={{
                  borderTop: "1px solid rgb(216, 220, 240)",
                  paddingTop: "20px",
                }}
              >
                <button className={styles.action_homework_item}>
                  <span>Làm thử</span>
                  <DesktopOutlined />
                </button>

                <button
                  className={styles.action_homework_item}
                  onClick={() => {
                    navigate(`${selectedHomework.id}/detail`);
                  }}
                >
                  <span>Chi tiết</span>
                  <PartitionOutlined />
                </button>

                <button
                  onClick={() => {
                    navigate(
                      `/class/${classId}/homework/${selectedHomework.id}/edit`
                    );
                  }}
                  className={styles.action_homework_item}
                >
                  <span>Chỉnh sửa</span>
                  <EditOutlined />
                </button>

                <button
                  onClick={() => {
                    setIsModalDeleteHomeworkOpen(true);
                  }}
                  className={styles.action_homework_item}
                >
                  <span>Xóa</span>
                  <DeleteOutlined />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Modal
        title="Bạn chắc chắn muỗn xóa bài tập?"
        open={isModalDeleteHomeworkOpen}
        onOk={onDeleteHomework}
        onCancel={() => {
          setIsModalDeleteHomeworkOpen(false);
        }}
      >
        <p style={{ width: "100%", height: "100px" }}></p>
      </Modal>
    </div>
  );
}

export default HomeWork;
