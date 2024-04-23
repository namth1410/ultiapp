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
        height: "-webkit-fill-available",
        backgroundColor: "#242424",
        textAlign: "center",
        boxSizing: "border-box",
      }}
      className="game_memory"
    >
      <div
        style={{
          color: "#ffffffde",
          fontSize: "3.2em",
          paddingTop: "20px",
          fontFamily: "Rocher",
          fontPalette: "--Grays",
        }}
      >
        <button
          style={{
            float: "left",
            marginLeft: "20px",
            fontSize: "0.9em",
            padding: "0.3em 0.6em",
            position: "absolute",
            left: "10px",
          }}
          onClick={() => {
            navigate(-1);
          }}
        >
          <span>🔙</span>
        </button>
        {""}
        Memory Game
      </div>
      <button onClick={startGame}>Chơi mới</button>

      <div
        style={{
          gridTemplateColumns:
            cards.length === 6 ? "repeat(3, 1fr)" : "repeat(4, 1fr)",
        }}
        className="card-container"
      >
        {cards.map((card, index) => (
          <Card
            card={card}
            key={card.id}
            onClick={handleCardItemClick}
            disabled={disabledCards}
          />
        ))}
      </div>
    </div>
  );
};

export default CardContainer;
