import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Select, Space, Modal } from "antd";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, firestore } from "../../firebase";
import styles from "./EditSet.module.css";

const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
  if (errorInfo.values.quizz_items.length === 0) {
    toast.warn("Chưa có thuật ngữ nào!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  }
};

function EditSet() {
  const { quizz_id } = useParams();

  const navigate = useNavigate();

  const [access, setAccess] = useState("public");
  const [dataQuizz, setDataQuizz] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onFinish = async (values) => {
    console.log("Success:", values);
    const dataToAdd = {
      ...values,
      access: access,
      dateCreate: new Date().toISOString(),
      uidCreator: auth.currentUser.uid,
      nameCreator: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
    };
    const quizzRef = doc(firestore, "quizzs", quizz_id);
    await updateDoc(quizzRef, dataToAdd);
    toast.success("Cập nhật thành công", {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    navigate("/home");
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
    navigate(-1);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const getDataQuizz = async (id) => {
      const quizzRef = doc(firestore, "quizzs", id);
      const docSnapshot = await getDoc(quizzRef);

      if (docSnapshot.exists()) {
        const quizzData = { id: docSnapshot.id, ...docSnapshot.data() };
        setDataQuizz(quizzData);
        setAccess(quizzData.access);
        console.log(quizzData);
      } else {
        console.log("Không tìm thấy quizz với id đã cho");
      }
    };
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is signed in:", user);
        getDataQuizz(quizz_id);
      } else {
        console.log("User is signed out");
      }
    });

    return () => {
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={styles.wrapper}>
      <h2>Tạo học phần mới</h2>
      <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        style={{
          maxWidth: "100%",
          width: "100%",
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        fields={[
          {
            name: ["title"],
            value: dataQuizz?.title,
          },
          {
            name: ["description"],
            value: dataQuizz?.description,
          },
          {
            name: ["quizz_items"],
            value: dataQuizz?.quizz_items,
          },
        ]}
      >
        <Form.Item
          name="title"
          rules={[
            {
              required: true,
              message: "Không để trống!",
            },
          ]}
        >
          <Input
            styles={{
              maxWidth: "none",
              width: "100%",
            }}
            size="large"
            placeholder='Nhập tiêu đề, ví dụ "Sinh học - Chương 22: Tiến hóa"'
          />
        </Form.Item>

        <Form.Item
          name="description"
          rules={[
            {
              required: true,
              message: "Không để trống",
            },
          ]}
          styles={{
            maxWidth: "none",
            width: "100%",
          }}
        >
          <Input.TextArea placeholder="Thêm mô tả" rows={4} />
        </Form.Item>

        <Form.Item
          styles={{
            maxWidth: "none",
            width: "100%",
          }}
          name="access"
        >
          <span style={{ marginRight: "10px" }}>Quyền truy cập</span>
          <Select
            defaultValue={access}
            style={{
              width: "auto",
            }}
            value={access}
            onChange={(value) => {
              setAccess(value);
            }}
          >
            <Select.Option value="public">Mọi người</Select.Option>
            <Select.Option value="password">Người có mật khẩu</Select.Option>
            <Select.Option value="private">Chỉ mình tôi</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Form.List
            name="quizz_items"
            rules={[
              {
                required: true,
                message: "",
              },
            ]}
            initialValue={[{ term: "", definition: "" }]}
          >
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }, index) => (
                  <Space
                    key={key}
                    style={{
                      display: "block",
                      marginBottom: 8,
                      maxWidth: "none",
                      backgroundColor: "#F6F7FB",
                      borderRadius: "16px",
                      padding: "10px",
                    }}
                    align="baseline"
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "100%",
                        maxWidth: "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "5px 5px",
                        }}
                      >
                        <span
                          style={{ fontSize: "20px", fontFamily: "Gilroy" }}
                        >
                          {`Thuật ngữ ${index + 1}`}
                        </span>
                        <CloseOutlined
                          style={{ fontSize: "16px" }}
                          onClick={() => remove(name)}
                        />
                      </div>

                      <Form.Item
                        {...restField}
                        name={[name, "term"]}
                        rules={[
                          {
                            required: true,
                            message: "Không để trống!",
                          },
                        ]}
                      >
                        <Input placeholder="Thuật ngữ" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "definition"]}
                        rules={[
                          {
                            required: true,
                            message: "Không để trống!",
                          },
                        ]}
                      >
                        <Input placeholder="Định nghĩa" />
                      </Form.Item>
                    </div>
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    onClick={() => {
                      add();
                    }}
                    block
                    icon={<PlusOutlined />}
                    style={{
                      backgroundColor: "var(--primary-color)",
                      fontSize: "20px",
                      fontFamily: "Gilroy",
                      height: "auto",
                      color: "#fff",
                    }}
                  >
                    Thêm thuật ngữ
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            htmlType="submit"
            style={{
              backgroundColor: "var(--primary-color)",
              fontSize: "20px",
              fontFamily: "Gilroy",
              height: "auto",
              color: "#fff",
              marginRight: "20px",
            }}
          >
            Cập nhật Quizz
          </Button>
          <Button
            style={{
              backgroundColor: "#f6f7fb",
              fontSize: "20px",
              fontFamily: "Gilroy",
              height: "auto",
            }}
            onClick={() => {
              showModal(true);
            }}
          >
            Hủy
          </Button>
        </Form.Item>
      </Form>

      <Modal
        title="Các thông tin thay đổi sẽ mất!"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      ></Modal>
    </div>
  );
}

export default EditSet;
