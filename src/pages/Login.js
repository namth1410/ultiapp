import { Button } from "antd";
import Splash from "assets/img/splash.jpg";

const Login = () => {
  return (
    <div style={{ position: "relative" }}>
      <img
        style={{ width: "100%", objectFit: "cover" }}
        src={Splash}
        alt="img"
      ></img>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "15%",
          translate: "1% -50%",
          display: "flex",
          flexDirection: "column",
          maxWidth: "35rem",
          color: "#fff",
          fontSize: "1.3rem",
        }}
      >
        <h1>Thẻ ghi nhớ kỹ thuật số và các công cụ học tốt nhất</h1>
        <p style={{ fontWeight: "500" }}>
          Tham gia cùng hơn 60 triệu học sinh đang sử dụng các thẻ ghi nhớ dựa
          trên nền tảng khoa học, các bài kiểm tra thử và lời giải chuyên gia
          của Quizlet để cải thiện điểm số và đạt được mục tiêu.
        </p>

        <Button
          size="large"
          type="primary"
          style={{
            background: "var(--primary-color)",
            fontFamily: "Gilroy",
            width: "fit-content",
            marginTop: "20px",
            display: "none",
          }}
        >
          Đăng ký miễn phí
        </Button>
      </div>
    </div>
  );
};

export default Login;
