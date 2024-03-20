import FormCreateNews from "components/FormCreateNews/FormCreateNews";
import NewItem from "components/NewItem/NewItem";
import { useClass } from "contexts/class_context/ClassContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, firestore } from "../../../firebase";
import styles from "./NewsFeed.module.css";

function NewsFeed() {
  const classId = window.location.pathname.split("/")[2];

  const { dataClass } = useClass();

  const [newsfeed, setNewsfeed] = useState(null);
  const [canPostNews, setCanPostNews] = useState(false);

  useEffect(() => {
    if (!dataClass) return;
    setCanPostNews(
      !(
        dataClass.config?.offNewsFeed &&
        dataClass.uidCreator !== auth.currentUser.uid
      )
    );
  }, [dataClass]);

  useEffect(() => {
    const q = query(
      collection(firestore, "newsfeed"),
      where("class", "==", classId),
      orderBy("dateCreate", "desc")
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      if (QuerySnapshot.empty) {
        setNewsfeed(null);
        return;
      }
      const newsfeed = [];

      QuerySnapshot.forEach((doc) => {
        newsfeed.push({ ...doc.data(), id: doc.id });
      });
      setNewsfeed(newsfeed);
    });
    return () => unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      {canPostNews && (
        <div className={styles.wrapper_form_create}>
          <FormCreateNews></FormCreateNews>
        </div>
      )}

      {newsfeed?.map((newfeed) => {
        return <NewItem key={newfeed} newfeed={newfeed} />;
      })}
    </div>
  );
}

export default NewsFeed;
