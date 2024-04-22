import { useClass } from "contexts/class_context/ClassContext";
import { convertISOToCustomFormat } from "ultis/time";
import styles from "./LeftBox.module.css";
import { useScore } from "./ScoreContext";

function LeftBox() {
  const { dataHomework } = useClass();
  const { selectedHomework, setSelectedHomework } = useScore();

  return (
    <div className={styles.wrapper}>
      <div
        style={{
          padding: "10px 5px",
          borderBottom: "1px solid rgb(216, 220, 240)",
        }}
      >
        Tên bài tập
      </div>
      {dataHomework?.map((el) => {
        return (
          <HomeWorkItem
            key={el.id}
            homework={el}
            selectedHomework={selectedHomework}
            setSelectedHomework={setSelectedHomework}
          />
        );
      })}
      {!dataHomework && <div>Hiện chưa có bài tập nào</div>}
    </div>
  );
}
const HomeWorkItem = ({ homework, selectedHomework, setSelectedHomework }) => {
  const { id, nameHomework, config } = homework;
  return (
    <div
      className={`${styles.item_wrapper} ${
        selectedHomework?.id === id ? styles.item_wrapper_select : ""
      }`}
      onClick={() => {
        setSelectedHomework(homework);
      }}
    >
      <div>
        <div className={styles.tes}>{nameHomework}</div>
        <div
          style={{ fontSize: "12px", fontWeight: "400", marginTop: "5px" }}
        >{`Deadline: ${convertISOToCustomFormat(config.deadline)}`}</div>
      </div>
    </div>
  );
};
export default LeftBox;
