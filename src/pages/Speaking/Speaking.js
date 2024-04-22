import { Card, Col, Modal, Row } from "antd";
import img from "assets/img/Animals.png";
import CreateCollectionSpeakingFromQuizz from "components/CreateCollectionSpeakingFromQuizz/CreateCollectionSpeakingFromQuizz";
import { useCreateSpeaking } from "contexts/create_speaking_context/CreateSpeakingContext";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { firestore, useAuth } from "../../firebase";
import styles from "./Speaking.module.scss";

const { Meta } = Card;

function importAll(r) {
  let images = {};
  r.keys().forEach((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const images = importAll(
  require.context("assets/img", false, /\.(png|jpe?g|svg)$/)
);

function Speaking() {
  const navigate = useNavigate();
  const currentUser = useAuth();
  const { setCurrent, setSelectedQuizzs, setResultSearchQuizz } =
    useCreateSpeaking();

  const [data, setData] = useState([
    "Animals",
    "Colors",
    "Grocery",
    "Hours",
    "Jobs",
    "Weather",
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [collectionFromQuizz, setCollectionFromQuizz] = useState(null);

  useEffect(() => {
    setData(["Animals", "Colors", "Grocery", "Hours", "Jobs", "Weather"]);
    if (!currentUser) return;

    const unsubscribe = onSnapshot(
      query(
        collection(firestore, "speaking"),
        where("origin", "==", `quizz`),
        where("uidCreator", "==", `${currentUser.uid}`),
        orderBy("dateCreate", "desc")
      ),
      (snapshot) => {
        const _collectionFromQuizz = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setCollectionFromQuizz(_collectionFromQuizz);
      }
    );
    return () => {
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <div
      style={{
        padding: "20px",
      }}
      className={styles.speaking_wrapper}
    >
      <div>
        <div style={{ fontSize: "22px", marginBottom: "20px" }}>
          Bộ sưu tập của bạn
        </div>
        <div>
          <Row gutter={[24, 16]}>
            {collectionFromQuizz?.map((item, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card
                  className={styles.card}
                  hoverable
                  onClick={() => {
                    navigate(`practice/${item.id}`);
                  }}
                  cover={<img alt="example" src={img} />}
                >
                  <Meta
                    style={{ textAlign: "center", textDecoration: "underline" }}
                    title={item.topic}
                  />
                </Card>
              </Col>
            ))}
            <Card
              hoverable
              className={styles.card}
              onClick={() => {
                setIsModalOpen(true);
              }}
            >
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "150px",
                  fontSize: "40px",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                +
              </div>
            </Card>
          </Row>
        </div>
      </div>

      <div style={{ marginTop: "20px" }}>
        <div style={{ fontSize: "22px", marginBottom: "20px" }}>
          Lựa chọn chủ đề
        </div>
        <div>
          <Row gutter={[24, 16]}>
            {data.map((item, index) => (
              <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6}>
                <Card
                  className={styles.card}
                  hoverable
                  style={{
                    width: 240,
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    boxShadow: "0 0 10px 0 rgba(0,0,0,.15)",
                  }}
                  onClick={() => {
                    navigate(`practice/${item.toLowerCase()}`);
                  }}
                  cover={
                    <img
                      style={{ width: "170px", marginTop: "10px" }}
                      alt="example"
                      src={images[`${item}.png`]}
                    />
                  }
                >
                  <Meta
                    style={{ textAlign: "center", textDecoration: "underline" }}
                    title={item}
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <Modal
        title=""
        open={isModalOpen}
        onOk={() => {
          setIsModalOpen(false);
        }}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrent(0);
          setSelectedQuizzs(null);
          setResultSearchQuizz(null);
        }}
        maskClosable={false}
        width={"50vw"}
        height={"50vw"}
        footer={() => <></>}
      >
        <CreateCollectionSpeakingFromQuizz />
      </Modal>
    </div>
  );
}

export default Speaking;
