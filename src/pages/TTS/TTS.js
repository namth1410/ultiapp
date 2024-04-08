import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import styles from "./TTS.module.css";
import { useTTS } from "./TTSContext";

function TTS() {
  const { ttsItems, setTtsItems, onAddTtsItem, setRunSubmit } = useTTS();

  const [keyGGS, setKeyGGS] = useState(
    "1UqiKR4OQd2hnFaQjzifbmrWDw96M8O17zE56OJi9skY"
  );
  const [rangeGGS, setRangeGGS] = useState("A2:B2");
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
      let a = [];
      rows.forEach((row) => {
        const rowData = row.c.map((cell) => cell.v);
        const overallDes = rowData[1]?.trim() || "";
        overallDes.split("$").forEach((el, index) => {
          if (index !== 0) {
            const x = {
              nameEx: rowData[0],
              namePose: `step_${index}`,
              des: el,
              id: `${a.length}${Date.now()}`,
            };
            a.push(x);
          }
        });
      });
      console.log(a);
      setTtsItems(a);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  const onJSON = () => {
    const tmp = ttsItems.map((el) => ({
      nameFile: `${el.nameEx}_${el.namePose}.mp3`,
      audioUrl: el.audioUrl,
    }));
    console.log(tmp);
    let codeToCopy = `function downloadAudioFiles(audioArray) {
        // Lặp qua mỗi phần tử trong mảng
        audioArray.forEach(function(audio) {
            // Gửi yêu cầu GET để tải tệp âm thanh từ đường dẫn async
            fetch(audio.audioUrl)
                .then(function(response) {
                    // Kiểm tra xem có phản hồi thành công không
                    if (!response.ok) {
                        throw new Error('Có lỗi xảy ra khi tải tệp âm thanh');
                    }
                    // Trả về dữ liệu blob từ phản hồi
                    return response.blob();
                })
                .then(function(blob) {
                    // Tạo một URL tạm thời cho blob
                    var audioUrl = URL.createObjectURL(blob);
    
                    // Tạo một thẻ a để tạo link tải tệp
                    var link = document.createElement('a');
                    link.href = audioUrl;
    
                    // Đặt thuộc tính download để tải về tệp thay vì hiển thị nó
                    link.setAttribute('download', audio.nameFile);
    
                    // Tạo sự kiện click tự động cho link để bắt đầu quá trình tải xuống
                    var clickEvent = new MouseEvent('click');
                    link.dispatchEvent(clickEvent);
                })
                .catch(function(error) {
                    // Xử lý lỗi
                    console.error('Đã xảy ra lỗi khi tải tệp âm thanh:', error);
                });
        });
    }
    
    // Sử dụng hàm với một mảng các đối tượng
    var audioArray = ${JSON.stringify(tmp)};
    
    downloadAudioFiles(audioArray);`;
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
export default TTS;
