import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import styles from "./TTS.module.css";
import { useTTS } from "./TTSContext";

function TTS() {
  const { ttsItems, onAddTtsItem } = useTTS();

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
          onClick={onAddTtsItem}
          size="large"
        >
          Run
        </Button>
        <Button
          style={{ width: "fit-content" }}
          type="primary"
          onClick={onAddTtsItem}
          size="large"
        >
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
  const { ttsItems, setTtsItems } = useTTS();

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
