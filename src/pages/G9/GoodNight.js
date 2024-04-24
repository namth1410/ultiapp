import b from "assets/img/b.png";
import styles from "./GoodNight.module.css";

function GoodNight() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <h1>Chúc chị Giang ngủ ngon</h1>
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <div className={styles.relative}>
          <div className={styles.corazon}>❤️</div>
          <div className={`${styles.absolute} ${styles.aura1}`}></div>
          <div className={`${styles.absolute} ${styles.aura2}`}></div>
          <div className={`${styles.absolute} ${styles.aura3}`}></div>
          <div className={`${styles.absolute} ${styles.aura4}`}></div>
          <img style={{ position: "absolute" }} src={b} alt="img" />
        </div>
      </div>
    </div>
  );
}

export default GoodNight;
