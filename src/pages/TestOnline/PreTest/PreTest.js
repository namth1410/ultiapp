import { Table } from "antd";
import { useState } from "react";
import styles from "./PreTest.module.css";

const countsLis = [6, 25, 39, 30];
const countsRead = [30, 16, 54];
const dataListen = [];
const dataRead = [];

for (let i = 0; i < 4; i++) {
  dataListen.push({
    key: i,
    name: `PART ${i + 1}`,
    count: countsLis[i],
  });
}

for (let i = 0; i < 3; i++) {
  dataRead.push({
    key: i,
    name: `PART ${i + 5}`,
    count: countsRead[i],
  });
}

function PreTest() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const onSelectChange = (newSelectedRowKeys) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
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
            <div style={{ fontSize: "20px" }}>Listening</div>
            <Table
              pagination={{
                position: ["none", "none"],
              }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataListen}
            />
          </div>

          <div className={styles.listening}>
            <div style={{ fontSize: "20px" }}>Reading</div>
            <Table
              pagination={{
                position: ["none", "none"],
              }}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={dataRead}
            />
          </div>
        </div>

        <div className={styles.footer}>
            <button>
                Bắt đầu
            </button>
        </div>
      </div>
    </div>
  );
}

export default PreTest;
