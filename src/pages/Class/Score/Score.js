import LeftBox from "./LeftBox";
import RightBox from "./RightBox";
import styles from "./Score.module.css";
function Score() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left_box}>
        <LeftBox />
      </div>
      <div className={styles.right_box}>
        <RightBox />
      </div>
    </div>
  );
}

export default Score;
