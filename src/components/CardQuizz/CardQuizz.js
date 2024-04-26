import { Card, Input, Modal, Tag } from "antd";
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CardQuizz.module.scss";

function CardQuizz({ props }) {
  const { id, title, quizz_items, photoURL, nameCreator, access, password } =
    props;
  const navigate = useNavigate();

  const inputRef = useRef();

  const COLOR_ACCESS = {
    public: "#87d068",
    password: "#f50",
    private: "#ccc",
  };

  const [passwordModal, setPasswordModal] = useState("");
  const [statusPassword, setStatusPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    if (passwordModal !== password) {
      setStatusPassword("error");
    } else {
      setIsModalOpen(false);
      navigate(`/quizz/${id}`);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setPasswordModal("");
    setStatusPassword("");
  };

  useEffect(() => {
    if (isModalOpen) {
      inputRef.current.focus();
    }
  }, [isModalOpen]);

  return (
    <>
      <button
        onClick={() => {
          if (access === "password") {
            showModal();
          } else {
            navigate(`/quizz/${id}`);
          }
        }}
        className={styles.card_quizz_btn}
      >
        <Card
          title={title}
          style={{
            width: 300,
            backgroundColor: "var(--button-background)",
            border: "var(--text-color-primary)",
          }}
          extra={<Tag color={COLOR_ACCESS[access]}>{access}</Tag>}
        >
          <Tag color="processing">{`${quizz_items.length} thuật ngữ`}</Tag>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginTop: "35px",
            }}
          >
            <img
              style={{
                objectFit: "cover",
                width: "35px",
                borderRadius: "50%",
                marginRight: "10px",
              }}
              src={photoURL}
              alt="Notification Icon"
            />
            <span>{nameCreator}</span>
          </div>
        </Card>
      </button>
      <Modal
        title="Nhập mật khẩu để truy cập"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input.Password
          status={statusPassword}
          placeholder="Nhập mật khẩu"
          onChange={(e) => {
            setStatusPassword("");
            setPasswordModal(e.target.value);
          }}
          onPressEnter={handleOk}
          value={passwordModal}
          ref={inputRef}
        />
      </Modal>
    </>
  );
}

CardQuizz.propTypes = {
  props: PropTypes.object,
  id: PropTypes.string,
  title: PropTypes.string,
  quizz_items: PropTypes.array,
  photoURL: PropTypes.string,
  nameCreator: PropTypes.string,
  access: PropTypes.string,
  password: PropTypes.string,
};
export default CardQuizz;
