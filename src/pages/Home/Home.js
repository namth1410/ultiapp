import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.home}>
      <button
        onClick={() => {
          navigate("/create-set");
        }}
        className={styles.create_quizz}
      >
        <h2>Tạo thẻ ghi nhớ</h2>
        <p>Tìm thẻ ghi nhớ, lời giải chuyên gia và nhiều hơn nữa</p>
      </button>
    </div>
  );
};

export default Home;
