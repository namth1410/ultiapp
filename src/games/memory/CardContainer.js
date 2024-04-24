import bg_memory from "assets/img/bg_memory.png";
import timer from "assets/img/timer.png";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Card from "./Card";
import { useMemoryCards } from "./MemoryContext";
import "./index.css";
import { useState, useEffect } from "react";

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
  const [seconds, setSeconds] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);

  if (checkWin() && timerRunning) {
    setTimerRunning(false);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerRunning) {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }
    }, 1000);

    if (!timerRunning) {
      setTimeout(() => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
          background: "#000",
          color: "#fff",
          title: "Chúc mừng bạn!",
          html: `<div>Bạn đã mất ${turn} lượt để hoàn thành trò chơi!</div><div>Thời gian: ${seconds} giây</div>`,
          icon: "success",
          confirmButtonText: "Chơi lại",
          allowOutsideClick: false,
          allowEscapeKey: false,
          allowEnterKey: false,
          preConfirm: () => {
            startGame();
            setTimerRunning(true);
            setSeconds(0);
          },
        });
      }, 500);
    }

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timerRunning]);

  return (
    <div
      style={{
        width: "100%",
        height: "-webkit-fill-available",
        textAlign: "center",
        boxSizing: "border-box",
        backgroundImage: `url(${bg_memory})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
      className="game_memory"
    >
      <div
        style={{
          color: "#ffffffde",
          fontSize: "3.2em",
          padding: "0px 20px",
          fontFamily: "Rocher",
          fontPalette: "--Grays",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={() => {
            navigate(-1);
          }}
        >
          <span>🔙</span>
        </button>
        {""}

        <span>Memory Game</span>
        <button
          style={{ fontFamily: "Gilroy", fontSize: "20px" }}
          onClick={startGame}
        >
          Chơi mới
        </button>
      </div>

      <div
        style={{
          width: "200px",
          height: "80px",
          backgroundImage: `url(${timer})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          marginInline: "auto",
          position: "relative",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: "20px",
            position: "absolute",
            top: "40%",
            left: "55%",
          }}
        >
          {Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0")}{" "}
          : {(seconds % 60).toString().padStart(2, "0")}
        </span>
      </div>

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
