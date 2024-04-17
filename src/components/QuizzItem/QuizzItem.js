import { Card, Tag } from "antd";
import PropTypes from "prop-types";
import styles from "./QuizzItem.module.css";
import { useCreateSpeaking } from "contexts/create_speaking_context/CreateSpeakingContext";

function QuizzItem({ props, typeShow }) {
  const { id, title, quizz_items, nameCreator, photoURL } = props;
  const { selectedQuizzs, setSelectedQuizzs } = useCreateSpeaking();

  const onClickItem = () => {
    if (!selectedQuizzs) {
      setSelectedQuizzs([props]);
      return;
    }
    const index = selectedQuizzs.findIndex((quizz) => quizz.id === id);

    if (index === -1) {
      setSelectedQuizzs([...selectedQuizzs, props]);
    } else {
      const newSelectedQuizzs = [...selectedQuizzs];
      newSelectedQuizzs.splice(index, 1);
      setSelectedQuizzs(newSelectedQuizzs);
    }
  };

  return typeShow === "list" ? (
    <div
      className={styles.list_item}
      onClick={onClickItem}
      style={{
        border: selectedQuizzs?.some((el) => el.id === id)
          ? "1px solid rgba(46,164,255,0.86)"
          : "1px solid rgb(216, 220, 240)",
      }}
    >
      <div>{title}</div>
      <div className={styles.terms}>{`${quizz_items.length} thuật ngữ`}</div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
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
    </div>
  ) : (
    <Card
      title={title}
      style={{
        width: 300,
        cursor: "pointer",
        border: selectedQuizzs?.some((el) => el.id === id)
          ? "1px solid rgba(46,164,255,0.86)"
          : "1px solid rgb(216, 220, 240)",
          placeSelf: "flex-start"
      }}
      onClick={onClickItem}
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
  );
}

QuizzItem.propTypes = {
  props: PropTypes.any,
  typeShow: PropTypes.any,
  id: PropTypes.any,
  title: PropTypes.any,
  quizz_items: PropTypes.any,
  nameCreator: PropTypes.any,
  photoURL: PropTypes.any,
};

export default QuizzItem;
