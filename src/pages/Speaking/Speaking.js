import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;

function importAll(r) {
  let images = {};
  r.keys().map((item, index) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

const images = importAll(
  require.context("assets/img", false, /\.(png|jpe?g|svg)$/)
);

function Speaking() {
  const navigate = useNavigate();

  const [data, setData] = useState([
    "Animals",
    "Colors",
    "Grocery",
    "Hours",
    "Jobs",
    "Weather",
  ]);
  useEffect(() => {
    console.log(images);
  }, []);

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <div>
        <div style={{ fontSize: "22px", marginBottom: "20px" }}>
          Tự tạo bộ sưu tập của bạn
        </div>
        <div>
          <Card
            hoverable
            style={{
              width: 240,
            }}
          >
            <div
              style={{
                display: "flex",
                width: "100%",
                height: "190px",
                fontSize: "40px",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              +
            </div>
          </Card>
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
    </div>
  );
}

export default Speaking;
