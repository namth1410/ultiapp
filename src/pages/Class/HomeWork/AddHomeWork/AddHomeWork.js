import { Button } from "antd";
import styles from "./AddHomeWork.module.css";
import { useRef } from "react";
function AddHomeWork() {
  const fileInput = useRef(null);
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    // Xử lý file ở đây, ví dụ: gửi file lên server
    console.log("File đã được chọn:", file);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.option}>
        <div className={styles.title}>Giữ nguyên định dạng</div>
        <div className={styles.description}>
          Đề bài được giữ nguyên và hiển thị khi làm bài
        </div>
        <Button
          type="primary"
          size="large"
          style={{
            fontFamily: "Gilroy",
            padding: "15px 30px",
            height: "auto",
          }}
        >
          Tải lên
        </Button>
      </div>

      <div className={styles.option}>
        <div className={styles.title}>Tách câu tự động</div>
        <div className={styles.description}>
          Nhận diện đề trắc nghiệm, tiếng anh từ file Word, PDF
        </div>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
          onChange={handleFileUpload}
          ref={fileInput}
        />
        <Button
          type="primary"
          size="large"
          style={{
            fontFamily: "Gilroy",
            padding: "15px 30px",
            height: "auto",
          }}
          onClick={() => console.log(fileInput)}
        >
          Tải File
        </Button>
      </div>
    </div>
  );
}

export default AddHomeWork;
