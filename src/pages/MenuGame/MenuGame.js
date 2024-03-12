import styles from "./MenuGame.module.css";
import { useNavigate, useParams } from "react-router-dom";

function MenuGame() {
  const { quizz_id } = useParams();
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div
        style={{
          color: "rgba(255, 255, 255, 0.87)",
          fontSize: "32px",
          paddingTop: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        Kho trò chơi
        <button
          style={{
            float: "left",
            marginLeft: "20px",
            fontSize: "1.5em",
            padding: "0.3em 0.6em",
            position: "absolute",
            left: "0",
          }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <span>🔙</span>
        </button>
      </div>

      <div className={styles.games_box}>
        <img
          onClick={() => {
            navigate(`/game/memory/${quizz_id}`);
          }}
          src="/memory_game.png"
          alt="img"
        />
        <img
          onClick={() => {
            navigate(`/game/searchword/${quizz_id}`);
          }}
          src="/word_search.png"
          alt="img"
        />
      </div>
    </div>
  );
}

export default MenuGame;
