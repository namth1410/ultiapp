import { Table } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PreTest.module.css";

const countsLis = [6, 25, 39, 30, 30, 16, 54];
const dataListen = [];

for (let i = 0; i < 7; i++) {
  dataListen.push({
    key: i,
    name: `PART ${i + 1}`,
    count: countsLis[i],
  });
}

function PreTest() {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [parts, setParts] = useState(null);

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
    newSelectedRowKeys.sort(function (a, b) {
      return a - b;
    });
    let _newSelectedRowKeys = [...newSelectedRowKeys];
    _newSelectedRowKeys = _newSelectedRowKeys.map((el) => el + 1);
    setParts(_newSelectedRowKeys.join(""));
  };
  const columns = [
    {
      title: "Tên part",
      dataIndex: "name",
      render: (_, { name }) => {
        return {
          children: (
            <div style={{ fontSize: "16px", fontWeight: "500" }}>{name}</div>
          ),
        };
      },
      align: "center",
    },
    {
      title: "Số câu",
      dataIndex: "count",
      render: (_, { count }) => {
        return {
          children: (
            <div style={{ fontSize: "16px", fontWeight: "500" }}>{count}</div>
          ),
        };
      },
      align: "center",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.name_test}>TEST1 - ETS2024</div>
      <div className={styles.exe_pro}>
        <div className={styles.title_top}>
          <p>
            Thời gian làm bài thi: <span>2 giờ</span>
          </p>
          <p>Cấu trúc đề thi</p>
        </div>

        <div className={styles.content}>
          <div className={styles.listening}>
            <div style={{ fontSize: "20px" }}>
              Listening (Part 1 - 4) & Reading (Part 5 - 7)
            </div>
            <Table
              pagination={{
                position: ["none", "none"],
              }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataListen}
            />
          </div>
        </div>

        <div className={styles.footer}>
          <button
            onClick={() => {
              navigate(`exam?parts=${parts}`);
            }}
          >
            Bắt đầu
          </button>
        </div>
      </div>
    </div>
  );
}

export default PreTest;
