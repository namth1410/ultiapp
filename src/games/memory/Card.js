import box_memory from "assets/img/box_memory.png";
import PropTypes from "prop-types";

const Card = ({ card, onClick, disabled }) => {
  const className = `${card.isFlipped ? "flipped" : ""} ${
    card.isMatched ? "matched" : ""
  }`;

  const handleClick = () => {
    if (!disabled) {
      onClick(card);
    }
  };

  return (
    <div className="card">
      <div style={{ width: "100%", height: "100%" }} className={className}>
        <div className="front">
          {card.type === "term" ? card.term : card.definition}
        </div>
        <img
          className="back"
          src={box_memory}
          alt="Card Cover"
          onClick={handleClick}
          draggable={false}
        />
      </div>
    </div>
  );
};

Card.propTypes = {
  card: PropTypes.any,
  onClick: PropTypes.any,
  disabled: PropTypes.any,
};

export default Card;
