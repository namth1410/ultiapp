import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Card from "./Card";
import { useMemoryCards } from "./MemoryContext";
import "./index.css";

const CardContainer = () => {
  const {
    cards,
    handleCardItemClick,
    disabledCards,
    checkWin,
    turn,
    startGame,
  } = useMemoryCards();

  const navigate = useNavigate();

  if (checkWin()) {
    const MySwal = withReactContent(Swal);
    MySwal.fire({
      background: "#000",
      color: "#fff",
      title: "Chúc mừng bạn!",
      text: `Bạn đã mất ${turn} lượt để hoàn thành trò chơi!`,
      icon: "success",
      confirmButtonText: "Chơi lại",
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
      preConfirm: () => {
        startGame();
      },
    });
  }

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: "#242424",
        textAlign: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{ color: "#ffffffde", fontSize: "3.2em", paddingTop: "20px" }}
      >
        <button
          style={{ float: "flex", marginLeft: "20px" }}
          onClick={() => {
            navigate(-1);
          }}
        >
          🔙
        </button>
        {""}
        Memory Game
      </div>
      <button onClick={startGame}>Chơi mới</button>

      <div className="card-container">
        {cards.map((card, index) => (
          <Card
            card={card}
            key={index}
            onClick={handleCardItemClick}
            disabled={disabledCards}
          />
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
