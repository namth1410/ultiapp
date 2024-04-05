import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import styles from "./TTS.module.css";
import { useTTS } from "./TTSContext";
import axios from "axios";

function TTS() {
  const { ttsItems, onAddTtsItem, setRunSubmit } = useTTS();
  const [csvData, setCsvData] = useState([]);

  const fetchCSVData = () => {
    const csvUrl =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRpAQGqdB9KcUYd7RflaK-J3LW27cZlNt9oHZ8QlFv4_h59OimYgj67Cqy4TwdLdyU0DQmFoM-2WeMM/pub?output=csv";
    axios
      .get(csvUrl)
      .then((response) => {
        const parsedCsvData = parseCSV(response.data);
        setCsvData(parsedCsvData);
        console.log(parsedCsvData);
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
      });
  };

  function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/);
    const headers = rows[0].split(",");
    const data = [];
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(",");
      const rowObject = {};
      for (let j = 0; j < headers.length; j++) {
        rowObject[headers[j]] = rowData[j];
      }
      data.push(rowObject);
    }
    return data;
  }

  useEffect(() => {
    fetchCSVData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <Button
          style={{ width: "fit-content" }}
          type="primary"
          onClick={() => {
            setRunSubmit(true);
          }}
          size="large"
        >
          Run
        </Button>
        <Button style={{ width: "fit-content" }} type="primary" size="large">
          Xuất JSON
        </Button>
      </div>
      {ttsItems?.map((el, index) => (
        <TTSItem key={el.id} index={index} data={el} />
      ))}
      <Button
        style={{ width: "fit-content" }}
        type="primary"
        onClick={onAddTtsItem}
      >
        Thêm dòng
      </Button>
    </div>
  );
}

const TTSItem = ({ index, data }) => {
  const { ttsItems, setTtsItems, runSubmit } = useTTS();

  const [item, setItem] = useState(data);

  const [url, setUrl] = useState("");

  const onDeleteItem = () => {
    console.log(ttsItems);
    console.log(index);
    const updatedItems = [...ttsItems];

    updatedItems.splice(index, 1);

    setTtsItems(updatedItems);
    console.log(updatedItems);
  };

  const handleUpdateTtsItems = (index, updatedItem) => {
    setTtsItems((prevItems) => {
      const updatedItems = [...prevItems];

      updatedItems[index] = updatedItem;

      return updatedItems;
    });
  };

  const onSubmit = () => {
    let payload = item.des;
    let options = {
      method: "POST",
      headers: {
        "api-key": "jqjW6riV0AzGlePhcX4ocvzIYuQS7PiN",
        speed: "",
        voice: "banmai",
      },
      body: payload,
    };

    fetch("https://api.fpt.ai/hmi/tts/v5", options)
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi gửi yêu cầu");
        }
        return response.json();
      })
      .then(function (data) {
        console.log("Dữ liệu nhận được:", data);
        setUrl(data.async);
      })
      .catch(function (error) {
        console.error("Đã xảy ra lỗi:", error);
      });
  };

  useEffect(() => {
    if (runSubmit) {
      onSubmit();
    }
  }, [runSubmit]);

  useEffect(() => {
    handleUpdateTtsItems(index, item);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  return (
    <div className={styles.tts_item_wrapper}>
      <Button
        type="primary"
        shape="circle"
        icon={<DeleteOutlined />}
        onClick={onDeleteItem}
      />
      <Button type="primary" shape="circle" onClick={onSubmit}>
        Test
      </Button>

      <Input
        placeholder="Tên bài tập"
        value={item.nameEx}
        onChange={(e) => {
          setItem({ ...item, nameEx: e.target.value });
        }}
      />
      <Input
        placeholder="Tên động tác"
        value={item.namePose}
        onChange={(e) => {
          setItem({ ...item, namePose: e.target.value });
        }}
      />
      <Input
        placeholder="Mô tả"
        value={item.des}
        onChange={(e) => {
          setItem({ ...item, des: e.target.value });
        }}
      />

      <div>{url}</div>
    </div>
  );
};
export default TTS;
