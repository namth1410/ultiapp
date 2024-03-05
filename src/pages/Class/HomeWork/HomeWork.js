import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./HomeWork.module.css";

function HomeWork() {
  const navigate = useNavigate();

  return (
    <div>
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

      <div></div>
    </div>
  );
}

export default HomeWork;
