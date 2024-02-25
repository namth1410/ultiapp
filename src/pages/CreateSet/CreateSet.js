import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, firestore } from "../../firebase";
import styles from "./CreateSet.module.css";

const onFinish = async (values) => {
  console.log("Success:", values);
  const dataToAdd = {
    ...values,
    dateCreate: new Date().toISOString(),
    creator: auth.currentUser.uid,
  };
  console.log(dataToAdd);
  await addDoc(collection(firestore, "quizzs"), dataToAdd);
};
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

function CreateSet() {
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
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
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

        <Form.Item>
          <Button
            htmlType="submit"
            style={{
              backgroundColor: "var(--primary-color)",
              fontSize: "20px",
              fontFamily: "Gilroy",
              height: "auto",
              color: "#fff",
            }}
          >
            Lưu Quizz
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default CreateSet;
