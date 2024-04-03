import {
  getNewsfeedOfClass,
  snapshotNewsfeedOfClass,
} from "appdata/newsfeed/newsfeedSlice";
import { ReactComponent as NewsFeedSvg } from "assets/img/newsfeed.svg";
import FormCreateNews from "components/FormCreateNews/FormCreateNews";
import NewItem from "components/NewItem/NewItem";
import { useClass } from "contexts/class_context/ClassContext";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./NewsFeed.module.css";

function NewsFeed() {
  const classId = window.location.pathname.split("/")[2];
  const dispatch = useDispatch();
  const { dataClass, mySelf } = useClass();

  const newsfeedRedux = useSelector((state) => state.newsfeedRedux);

  const [newsfeed, setNewsfeed] = useState(null);
  const [canPostNews, setCanPostNews] = useState(false);

  useEffect(() => {
    if (!dataClass) return;
    setCanPostNews(
      !(dataClass.config?.offNewsFeed && dataClass.uidCreator !== mySelf.uid)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataClass]);

  useEffect(() => {
    dispatch(getNewsfeedOfClass({ classId: classId }));
    dispatch(snapshotNewsfeedOfClass({ classId: classId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!newsfeedRedux?.newsfeed) return;
    setNewsfeed(newsfeedRedux.newsfeed);
  }, [newsfeedRedux]);

  return (
    <div className={styles.wrapper}>
      {canPostNews && (
        <div className={styles.wrapper_form_create}>
          <FormCreateNews></FormCreateNews>
        </div>
      )}

      {!newsfeed && (
        <div className={styles.intro}>
          <div className={styles.a1}>
            <NewsFeedSvg />
          </div>

          <p
            style={{
              textAlign: "center",
            }}
          >
            Bảng tin
          </p>
          <p
            style={{
              fontSize: "14px",
              fontWeight: "400",
              textAlign: "center",
              marginTop: "5px",
            }}
          >
            Nơi trao đổi các vấn đề trong lớp học dành cho giáo viên học sinh
          </p>
        </div>
      )}

      {newsfeed?.map((newfeed) => {
        return <NewItem key={newfeed} newfeed={newfeed} />;
      })}
    </div>
  );
}

export default NewsFeed;
