import { Card, Tag } from "antd";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function CardQuizz({ props }) {
  const { id, title, quizz_items, photoURL, nameCreator } = props;
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`/quizz/${id}`);
      }}
      style={{ cursor: "pointer" }}
    >
      <Card
        title={title}
        style={{
          width: 300,
        }}
      >
        <Tag color="processing">{`${quizz_items.length} thuật ngữ`}</Tag>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "35px",
          }}
        >
          <img
            style={{
              objectFit: "cover",
              width: "35px",
              borderRadius: "50%",
              marginRight: "10px",
            }}
            src={photoURL}
            alt="Notification Icon"
          />
          <span>{nameCreator}</span>
        </div>
      </Card>
    </div>
  );
}

CardQuizz.propTypes = {
  props: PropTypes.object,
  id: PropTypes.string,
  title: PropTypes.string,
  quizz_items: PropTypes.array,
  photoURL: PropTypes.string,
  nameCreator: PropTypes.string,
};
export default CardQuizz;
