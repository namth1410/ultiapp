import { getDataHomeworkById } from "appdata/homework/homeworkSlice";
import ShowFile from "components/ShowFile/ShowFile";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import RightBox from "./RightBox";
import styles from "./TestHomework.module.css";

function TestHomework() {
  const homeworkId = window.location.pathname.split("/")[4];
  const dispatch = useDispatch();

  const homeworkRedux = useSelector((state) => state.homeworkRedux);

  const [dataHomework, setDataHomework] = useState(null);

  useEffect(() => {
    setDataHomework(homeworkRedux.dataHomeworkById);
  }, [homeworkRedux]);

  useEffect(() => {
    dispatch(getDataHomeworkById({ homeworkId: homeworkId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      {dataHomework && (
        <>
          <div className={styles.left_box}>
            <ShowFile fileUri={dataHomework?.fileURL} />
          </div>
          {dataHomework && (
            <div className={styles.right_box}>
              <RightBox dataHomework={dataHomework} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default TestHomework;
