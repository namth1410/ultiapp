import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import styles from "./TTS.module.css";
import { useTTS } from "./TTSContext";

function TTS() {
  const { ttsItems, setTtsItems, onAddTtsItem, setRunSubmit } = useTTS();

  const [keyGGS, setKeyGGS] = useState(
    "1UqiKR4OQd2hnFaQjzifbmrWDw96M8O17zE56OJi9skY"
  );
  async function fetchData() {
    try {
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${keyGGS}/gviz/tq?tqx=out:json`
      );
      const rawData = await response.text();
      const dataStartIndex = rawData.indexOf("{");
      const dataEndIndex = rawData.lastIndexOf("}");
      const jsonData = JSON.parse(
        rawData.substring(dataStartIndex, dataEndIndex + 1)
      );

      const rows = jsonData.table.rows;
      const a = [];
      rows.forEach((row) => {
        const rowData = row.c.map((cell) => cell.v);
        const tmp = {
          nameEx: rowData[0],
          namePose: "",
          des: rowData[1] || "",
          id: a.length,
        };
        a.push(tmp);
      });
      console.log(a);
      setTtsItems(a);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
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

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "center",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <Input
          placeholder="Nhập key gg sheet"
          value={keyGGS}
          onChange={(e) => {
            setKeyGGS(e.target.value);
          }}
        ></Input>
        <Button
          style={{ width: "fit-content" }}
          type="primary"
          onClick={fetchData}
          size="large"
        >
          Đọc ggs
        </Button>
      </div>

      {ttsItems?.map((el, index) => (
        <TTSItem key={el.id} index={index} data={el} />
      ))}
      <Button
        style={{ width: "fit-content", marginTop: "20px" }}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
