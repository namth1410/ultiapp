import { Button } from "antd";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

import { useRef, useState, useEffect } from "react";
import { auth, firestore, storage } from "../../../firebase";

const SendMessage = () => {
  const inputFile = useRef();
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isSending, setIsSending] = useState(false);

  const handleImageUpload = async () => {
    if (!selectedImage) {
      return ""; // Trả về giá trị mặc định nếu không có hình ảnh được chọn
    }

    const storageRef = ref(storage, "Chat/" + new Date().toISOString());
    const uploadTask = uploadBytesResumable(storageRef, selectedImage);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Xử lý tiến trình tải lên (nếu cần)
        },
        (error) => {
          console.error("Lỗi tải lên: ", error);
          reject(error); // Trả về lỗi nếu có vấn đề trong quá trình tải lên
        },
        () => {
          // Hoàn tất tải lên
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              console.log("URL hình ảnh đã tải lên: ", downloadURL);
              resolve(downloadURL); // Trả về URL hình ảnh sau khi tải lên thành công
            })
            .catch((error) => {
              console.error("Lỗi lấy URL: ", error);
              reject(error); // Trả về lỗi nếu không thể lấy URL
            });
        }
      );
    });
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    setIsSending(true);
    if (message.trim() === "" && !selectedImage) {
      setIsSending(false);
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;
    const imgUrl = await handleImageUpload();
    setSelectedImage(null);
    await addDoc(collection(firestore, "messages"), {
      text: message,
      name: displayName,
      avatar: photoURL,
      createdAt: serverTimestamp(),
      uid,
      imgUrl: imgUrl,
    });
    setMessage("");
    setIsSending(false);
  };

  useEffect(() => {
    setTimeout(() => {
      document.querySelector("form").scrollIntoView({ behavior: "smooth" });
    }, 150);
  }, [selectedImage]);
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        marginTop: "auto",
        marginBottom: "20px",
        position: "relative",
        flexDirection: "column",
      }}
    >
      {selectedImage && (
        <div
          style={{ display: "flex", marginBottom: "10px", marginLeft: "auto" }}
        >
          <img
            alt="err"
            width="250px"
            src={URL.createObjectURL(selectedImage)}
          />
          <br />
          <button onClick={() => setSelectedImage(null)}>
            <i
              className="bi bi-trash3-fill"
              style={{
                fontSize: "22px",
                color: "#ff6666",
                padding: "8px 12px",
              }}
            ></i>
          </button>
        </div>
      )}
      <form
        style={{
          gap: "20px",
          display: "flex",
          padding: "0 10px",
          boxSizing: "border-box",
        }}
        onSubmit={(event) => sendMessage(event)}
        className="send-message"
      >
        <label htmlFor="messageInput" hidden>
          Enter Message
        </label>
        <input
          id="messageInput"
          name="messageInput"
          type="text"
          className="form-input__input"
          placeholder="Nhập những lời yêu thương vào đây này cậu..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ fontSize: "20px", flex: 1, padding: "8px" }}
          autoComplete="off"
        />

        <input
          type="file"
          name="myImage"
          onChange={(event) => {
            setSelectedImage(event.target.files[0]);
          }}
          ref={inputFile}
          style={{ display: "none" }}
        />

        <Button
          icon={
            <i
              className="bi bi-image-fill"
              style={{
                fontSize: "22px",
                color: "var(--primary-color)",
                padding: "8px 12px",
              }}
            ></i>
          }
          style={{
            color: "primary",
            border: "none",
            backgroundColor: "var(--button-background)",
            height: "100%",
            width: "fit-content",
          }}
          onClick={() => {
            inputFile.current.click();
          }}
        ></Button>

        <button
          type="submit"
          style={{
            color: "primary",
            border: "none",
            backgroundColor: "var(--button-background)",
            height: "100%",
            width: "fit-content",
            borderRadius: "4px",
          }}
          disabled={isSending}
        >
          <i
            className="bi bi-send-fill"
            style={{
              fontSize: "22px",
              color: "var(--primary-color)",
              padding: "8px 12px",
            }}
          ></i>
        </button>
      </form>
    </div>
  );
};

export default SendMessage;
