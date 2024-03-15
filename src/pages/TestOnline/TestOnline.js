import { Menu } from "antd";
import { useState, useEffect } from "react";
import styles from "./TestOnline.module.css";
import axios from "axios";

function TestOnline() {
  const [audioUrl, setAudioUrl] = useState(null);
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
  const onClick = (e) => {
    console.log("click ", e);
    setTestSelected(e.key);
  };

  useEffect(() => {
    axios
      .get(
        "https://zenlishtoeic.vn/wp-content/uploads/2023/06/zenlish-32-34.mp3",
        {
          responseType: "blob", // yêu cầu kiểu dữ liệu là Blob
        }
      )
      .then((response) => {
        const audioUrl = URL.createObjectURL(new Blob([response.data]));
        setAudioUrl(audioUrl);
        console.log(audioUrl);
      })
      .catch((error) => {
        console.error("Error downloading audio:", error);
      });
  }, []);
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

      <div className={styles.container}>
        <a
          href="https://zenlishtoeic.vn/wp-content/uploads/2023/06/zenlish-32-34.mp3"
          download="zenlish_audio.mp3"
        >
          Download Audio fixed
        </a>
        <a href={audioUrl} download="zenlish_audio.mp3">
          Download Audio
        </a>

        <TestItem />
        <TestItem />
        <TestItem />
      </div>
    </div>
  );
}

const TestItem = () => {
  return (
    <div className={styles.test_item}>
      <img
        alt="img"
        src="https://zenlishtoeic.vn/wp-content/uploads/2023/06/zenlish-test-full-dau-vao.png"
      />
      <div className={styles.item_info}>
        <div
          style={{
            fontSize: "18px",
            color: "#333333",
            textTransform: "uppercase",
          }}
        >
          Test đầu vào
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
          <button>Chọn từng part</button>
        </div>
      </div>
    </div>
  );
};

export default TestOnline;
