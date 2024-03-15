import { Spin } from "antd";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useExam } from "../ExamContext";
import Part1 from "../Part1/Part1";
import Part2 from "../Part2/Part2";
import Part3 from "../Part3/Part3";
import styles from "./Test.module.css";

function Exam() {
  const indexToPart = () => {
    if (indexQuestion < 6) {
      return 1;
    } else if (indexQuestion < 31) {
      return 2;
    } else if (indexQuestion < 70) {
      return 3;
    } else {
      return 4;
    }
  };

  const { indexQuestion, isReady, setIsReady, onSubmit, answer } = useExam();
  const [part, setPart] = useState(indexToPart());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setPart(indexToPart());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexQuestion]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.wrapper_1}>
        <div className={styles.title_flex}>
          <div
            style={{ color: "var(--blue)", fontSize: "26px" }}
          >{`PART ${part}`}</div>

          <button
            style={{
              border: "none",
              padding: "15px 20px",
              color: "#fff",
              fontSize: "20px",
              backgroundColor: "var(--blue)",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "Gilroy",
            }}
            onClick={() => {
              Swal.fire({
                title: "Bạn có muốn nộp bài không?",
                showDenyButton: true,
                confirmButtonText: "Nộp",
                denyButtonText: `Hủy`,
              }).then((result) => {
                if (result.isConfirmed) {
                  setIsLoading(true);
                  onSubmit().then(setIsLoading(false));
                } else if (result.isDenied) {
                  return;
                }
              });
              onSubmit(answer);
            }}
          >
            Nộp bài
          </button>
          <div
            style={{
              padding: "25px 40px",
              backgroundColor: "var(--blue)",
              color: "#fff",
              borderRadius: "8px",
            }}
          >
            0/200
          </div>
        </div>

        {isReady ? (
          <div>
            {indexQuestion < 6 && <Part1 />}
            {indexQuestion < 31 && indexQuestion > 5 && <Part2 />}
            {indexQuestion > 31 && <Part3 />}
          </div>
        ) : (
          <div>
            <button
              onClick={() => {
                setIsReady(true);
              }}
            >
              Bắt đầu
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <>
          <div className="overlay"></div>
          <div
            style={{
              position: "absolute",
              top: "40%",
              left: "50%",
              translate: "-50% -20%",
              zIndex: 3000,
              width: "200px",
              height: "200px",
            }}
          >
            <Spin size="large">
              <div className="content" />
            </Spin>
          </div>
        </>
      )}
    </div>
  );
}

export default Exam;
