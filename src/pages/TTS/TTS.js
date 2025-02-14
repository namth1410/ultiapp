import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./TTS.module.css";
import { useTTS } from "./TTSContext";

function Tts() {
  const { ttsItems, setTtsItems, onAddTtsItem, setRunSubmit } = useTTS();

  const [keyGGS, setKeyGGS] = useState(
    "1KcESDkXhjofy_ZOgyBgDxqubzR53GsQDyn3nkKS4Tx8"
  );
  const [rangeGGS, setRangeGGS] = useState("A4:A83");
  async function fetchData() {
    try {
      const response = await fetch(
        `https://docs.google.com/spreadsheets/d/${keyGGS}/gviz/tq?tqx=out:json&range=${rangeGGS}`
      );
      const rawData = await response.text();
      const dataStartIndex = rawData.indexOf("{");
      const dataEndIndex = rawData.lastIndexOf("}");
      const jsonData = JSON.parse(
        rawData.substring(dataStartIndex, dataEndIndex + 1)
      );

      const rows = jsonData.table.rows;
      console.log(rows);

      let a = [];

      rows.forEach((row) => {
        const x = {
          nameEx: "",
          namePose: row.c[0].v,
          des: row.c[0].v,
          id: `${a.length}${Date.now()}`,
        };
        a.push(x);
      });

      console.log(a);
      setTtsItems(a);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const onJSON = () => {
    const tmp = ttsItems.map((el) => ({
      nameFile: `${el.namePose}.mp3`,
      audioUrl: el.audioUrl,
      des: el.des,
    }));
    console.log(tmp);
    let codeToCopy = `  
    
    // Sử dụng hàm với một mảng các đối tượng
    var audioArray = ${JSON.stringify(tmp)};
    
    function processBatch(batch) {
  batch.forEach(function (audio) {
    let payload = audio.des;
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
      .then((response) => {
        if (!response.ok) {
          throw new Error("Có lỗi xảy ra khi gửi yêu cầu");
        }
        return response.json();
      })
      .then((data) => {
        fetch(data.async)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Có lỗi xảy ra khi tải tệp âm thanh");
            }
            return response.blob();
          })
          .then((blob) => {
            let audioUrl = URL.createObjectURL(blob);
            let link = document.createElement("a");
            link.href = audioUrl;
            link.setAttribute("download", audio.nameFile);
            link.dispatchEvent(new MouseEvent("click"));
          })
          .catch((error) =>
            console.error("Đã xảy ra lỗi khi tải tệp âm thanh:", error)
          );
      });
  });
}

function processAudioArray(audioArray, batchSize) {
  let index = 0;

  function processNextBatch() {
    if (index < audioArray.length) {
      let batch = audioArray.slice(index, index + batchSize);
      processBatch(batch);
      index += batchSize;

      // Chờ 5 giây trước khi chạy batch tiếp theo (tuỳ chỉnh nếu cần)
      setTimeout(processNextBatch, 5000);
    }
  }

  processNextBatch();
}

// Chạy function với audioArray, mỗi lần xử lý tối đa 9 phần tử
processAudioArray(audioArray, 9);
`;
    navigator.clipboard
      .writeText(codeToCopy)
      .then(function () {
        toast.success("Đã copy", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch(function (error) {
        console.error("Đã xảy ra lỗi khi sao chép đoạn mã:", error);
      });
    return tmp;
  };

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
        <Button
          style={{ width: "fit-content" }}
          type="primary"
          size="large"
          onClick={onJSON}
        >
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
        <Input
          placeholder="Nhập range A3:B4"
          value={rangeGGS}
          onChange={(e) => {
            setRangeGGS(e.target.value);
          }}
          onPressEnter={fetchData}
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

  useEffect(() => {
    if (url !== "") {
      setTtsItems((prevItems) => {
        let updatedItems = [...prevItems];

        updatedItems[index].audioUrl = url;

        return updatedItems;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  return (
    <div className={styles.tts_item_wrapper}>
      <span style={{ alignSelf: "center", marginRight: "5px" }}>
        {index + 1}
      </span>
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
export default Tts;
