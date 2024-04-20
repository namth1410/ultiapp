import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  TableOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { Button, Input, Radio, Select, Spin, Steps } from "antd";
import empty from "assets/img/empty.json";
import j1 from "assets/img/j1.json";
import j2 from "assets/img/j2.json";
import QuizzItem from "components/QuizzItem/QuizzItem";
import { useCreateSpeaking } from "contexts/create_speaking_context/CreateSpeakingContext";
import { onAuthStateChanged } from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { auth, firestore } from "../../firebase";
import styles from "./CreateCollectionSpeakingFromQuizz.module.css";

const { Search } = Input;
const steps = [
  {
    title: "Bước 1",
    content: "First-content",
  },
  {
    title: "Bước 2",
    content: "Second-content",
  },
  {
    title: "Bước 3",
    content: "Last-content",
  },
];

function CreateCollectionSpeakingFromQuizz() {
  const {
    selectedQuizzs,
    current,
    setCurrent,
    isCreateFromMyQuizz,
    setIsCreateFromMyQuizz,
    resultSearchQuizz,
    setResultSearchQuizz,
  } = useCreateSpeaking();

  const [myQuizzs, setMyQuizzs] = useState(null);
  const [filter, setFilter] = useState("time_desc");
  const [typeShow, setTypeShow] = useState("list");
  const [statusUpload, setStatusUpload] = useState("yet");

  const items = steps.map((item) => ({
    key: item.title,
    title: item.title,
  }));

  const filters = [
    {
      value: "asc",
      label: "A-Z",
    },
    {
      value: "desc",
      label: "Z-A",
    },
    {
      value: "time_asc",
      label: "Cũ nhất",
    },
    {
      value: "time_desc",
      label: "Mới nhất",
    },
  ];

  function sortArrayByFilter(array, filter) {
    let sortedArray = [...array];

    if (filter === "asc" || filter === "desc") {
      sortedArray.sort((a, b) => {
        const nameA = a.title.toUpperCase();
        const nameB = b.title.toUpperCase();
        if (filter === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      });
    } else if (filter === "time_asc" || filter === "time_desc") {
      sortedArray.sort((a, b) => {
        const dateA = new Date(a.dateCreate);
        const dateB = new Date(b.dateCreate);
        if (filter === "time_asc") {
          return dateA - dateB;
        } else {
          return dateB - dateA;
        }
      });
    }

    return sortedArray;
  }

  function normalizeDataToUpload() {
    const speakingCollections = [];
    selectedQuizzs.forEach((el) => {
      const collection = {
        topic: el.title,
        words: el.quizz_items.map((word) => ({
          term: word.term,
          definition: word.definition,
          phonetic: word.pronunciation,
          wordType: word.partsOfSpeech,
          image: word.image,
        })),
        dateCreate: new Date().toISOString(),
        uidCreator: auth.currentUser.uid,
        nameCreator: auth.currentUser.displayName,
        photoURL: auth.currentUser.photoURL,
        origin: "quizz",
      };
      speakingCollections.push(collection);
    });
    return speakingCollections;
  }

  async function onSearch(value) {
    let querySnapshot = await getDoc(doc(firestore, "quizzs", value));
    if (querySnapshot.exists()) {
      return setResultSearchQuizz([
        {
          id: querySnapshot.id,
          ...querySnapshot.data(),
        },
      ]);
    } else {
      const quizzsRef = collection(firestore, "quizzs");
      querySnapshot = await getDocs(
        query(quizzsRef, where("title", "==", value))
      );
      if (querySnapshot.empty) {
        return setResultSearchQuizz(null);
      } else {
        const res = [];
        querySnapshot?.forEach((doc) => {
          res.push({ id: doc.id, ...doc.data() });
        });
        return setResultSearchQuizz(res);
      }
    }
  }

  async function createCollectionFromQuizzs() {
    const speakingCollections = normalizeDataToUpload();

    const promises = speakingCollections.map(async (_collection) => {
      try {
        // Kiểm tra xem có tài liệu nào có title tương tự trong collection hay không
        const querySnapshot = await getDocs(
          query(
            collection(firestore, "speaking"),
            where("topic", "==", _collection.topic)
          )
        );

        // Nếu không có tài liệu nào trùng title, thêm tài liệu mới
        if (querySnapshot.empty) {
          await addDoc(collection(firestore, "speaking"), _collection);
        } else {
          console.log("Document with the same title already exists.");
        }
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    });

    try {
      await Promise.all(promises);
      setStatusUpload("done");
    } catch (error) {
      setStatusUpload("error");
      console.error("Error adding documents: ", error);
    }
  }

  useEffect(() => {
    if (!myQuizzs) return;

    let _myQuizzs = [...myQuizzs];
    _myQuizzs = sortArrayByFilter(_myQuizzs, filter);
    setMyQuizzs(_myQuizzs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (current === 2) {
      createCollectionFromQuizzs();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  useEffect(() => {
    const getDataQuizz = async (uid) => {
      const quizzsRef = collection(firestore, "quizzs");
      const querySnapshot = await getDocs(
        query(quizzsRef, where("uidCreator", "==", uid))
      );
      const quizzsData = [];
      querySnapshot?.forEach((doc) => {
        quizzsData.push({ id: doc.id, ...doc.data() });
      });

      setMyQuizzs(quizzsData);
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        getDataQuizz(user.uid);
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div>
      <Steps style={{ marginTop: "15px" }} current={current} items={items} />
      {current === 0 && (
        <div
          style={{
            display: "flex",
          }}
        >
          <div className={styles.option}>
            <div className={styles.anim}>
              <Lottie animationData={j1} loop={true} />
            </div>
            <div className={styles.title}>Tạo từ quizz cộng đồng</div>
            <Button
              type="primary"
              size="large"
              style={{
                fontFamily: "Gilroy",
                padding: "15px 30px",
                height: "auto",
              }}
              onClick={() => {
                setCurrent(current + 1);
                setIsCreateFromMyQuizz(false);
              }}
            >
              Tải lên
            </Button>
          </div>

          <div className={styles.option}>
            <div className={styles.anim}>
              <Lottie animationData={j2} loop={true} />
            </div>
            <div className={styles.title}>Tạo từ quizz của bạn</div>
            <Button
              type="primary"
              size="large"
              style={{
                fontFamily: "Gilroy",
                padding: "15px 30px",
                height: "auto",
              }}
              onClick={() => {
                setCurrent(current + 1);
                setIsCreateFromMyQuizz(true);
              }}
            >
              Tải File
            </Button>
          </div>
        </div>
      )}

      {current === 1 && isCreateFromMyQuizz && (
        <div
          className={styles.option}
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              <ArrowLeftOutlined
                style={{ cursor: "pointer" }}
                onClick={() => {
                  setCurrent((pre) => pre - 1);
                }}
              />
              {selectedQuizzs && (
                <div>{`Bạn đã chọn ${selectedQuizzs.length} quizz`}</div>
              )}
            </div>

            <div>
              <Select
                defaultValue="time_desc"
                style={{
                  width: 160,
                  height: "100%",
                  marginRight: "5px",
                }}
                options={filters}
                onChange={(e) => {
                  setFilter(e);
                }}
              />
              <Radio.Group
                value={typeShow}
                onChange={(e) => {
                  setTypeShow(e.target.value);
                }}
              >
                <Radio.Button value="list">
                  {<UnorderedListOutlined />}
                </Radio.Button>
                <Radio.Button value="grid">{<TableOutlined />}</Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div
            style={{
              display: typeShow === "list" ? "flex" : "grid",
              gap: "10px",
              marginTop: "10px",
              gridTemplateColumns: "auto auto",
              flexDirection: "column",
              overflow: "auto",
              width: "100%",
              placeItems: "center",
              flex: 1,
            }}
            className={styles.item_wrapper}
          >
            {myQuizzs?.map((el) => (
              <QuizzItem key={el.id} props={el} typeShow={typeShow} />
            ))}
          </div>
          <Button
            style={{ marginLeft: "auto", marginTop: "5px" }}
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() => {
              if (!selectedQuizzs) return;
              setCurrent((pre) => pre + 1);
            }}
          >
            Tiếp
          </Button>
        </div>
      )}

      {current === 1 && !isCreateFromMyQuizz && (
        <div
          className={styles.option}
          style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <ArrowLeftOutlined
              style={{ cursor: "pointer" }}
              onClick={() => {
                setCurrent((pre) => pre - 1);
              }}
            />
            {selectedQuizzs && (
              <div>{`Bạn đã chọn ${selectedQuizzs.length} quizz`}</div>
            )}
          </div>

          <Search
            placeholder="Tìm kiếm..."
            allowClear
            enterButton="Tìm kiếm"
            size="large"
            onSearch={(e) => {
              onSearch(e.trim());
            }}
            style={{ marginTop: "5px" }}
          />

          <div
            style={{
              width: "100%",
              overflow: "auto",
              margin: "5px 0",
              display: "flex",
              flexDirection: "column",
              gap: "5px",
            }}
          >
            {resultSearchQuizz ? (
              resultSearchQuizz?.map((quizz) => (
                <QuizzItem key={quizz.id} props={quizz} typeShow={typeShow} />
              ))
            ) : (
              <div>
                <Lottie
                  style={{ width: "40%", margin: "auto", marginTop: "10%" }}
                  animationData={empty}
                  loop={true}
                />
              </div>
            )}
          </div>

          <Button
            style={{ marginLeft: "auto", marginTop: "auto" }}
            type="primary"
            icon={<ArrowRightOutlined />}
            onClick={() => {
              if (!selectedQuizzs) return;
              setCurrent((pre) => pre + 1);
            }}
          >
            Tiếp
          </Button>
        </div>
      )}

      {current === 2 && (
        <div className={styles.option}>
          {statusUpload === "done" ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
              }}
            >
              <CheckCircleFilled
                style={{ fontSize: "20px", color: "#00b8ff" }}
              />
              <div style={{ marginTop: "5px" }}>Thành công</div>
            </div>
          ) : (
            <>
              <Spin size="large"></Spin>
              <div style={{ marginTop: "5px" }}>Đang tạo...</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default CreateCollectionSpeakingFromQuizz;
