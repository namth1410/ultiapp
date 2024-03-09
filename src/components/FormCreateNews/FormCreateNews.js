import { CloseCircleFilled, FileImageFilled } from "@ant-design/icons";
import { Button, Input } from "antd";
import { addDoc, collection } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useRef, useState } from "react";
import { auth, firestore, storage } from "../../firebase";
import styles from "./FormCreateNews.module.css";

const { TextArea } = Input;
let imageUrl = "";

function FormCreateNews() {
  const classId = window.location.pathname.split("/")[2];

  const hiddenFileInput = useRef(null);

  const [content, setContent] = useState("");
  const [imageNewFeed, setImageNewFeed] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async () => {
    console.log(imageNewFeed);
    const now = new Date().toISOString();
    const storageRef = ref(storage, `Newsfeed/${classId}/${now}`);

    await uploadBytes(storageRef, imageNewFeed)
      .then((snapshot) => {
        console.log("Uploaded a blob or file!");
        return getDownloadURL(snapshot.ref);
      })
      .then((downloadURL) => {
        console.log("File available at", downloadURL);
        imageUrl = downloadURL;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const onPost = async () => {
    setIsLoading(true);
    if (imageNewFeed) {
      await uploadFile();
    }
    const dataToAdd = {
      dateCreate: new Date().toISOString(),
      uidCreator: auth.currentUser.uid,
      nameCreator: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      class: classId,
      content: content,
      image: imageUrl,
    };
    const docRef = await addDoc(collection(firestore, "newsfeed"), dataToAdd);
    console.log(docRef);
    setIsLoading(false);
    setContent("");
    setImageNewFeed(null);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.content_wrapper}>
        <div className={styles.avatar}>
          <img
            alt="img"
            style={{
              width: "100%",
              height: "100%",
              textAlign: "center",
              objectFit: "cover",
            }}
            src="https://shub-storage.sgp1.cdn.digitaloceanspaces.com/profile_images/AvatarDefaultPng.png"
          />
        </div>
        <div className={styles.content}>
          <TextArea
            placeholder="Nhập nội dung thảo luận với lớp học..."
            style={{
              border: "none",
              boxShadow: "none",
              maxWidth: "none",
              width: "100%",
            }}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
            }}
          />
        </div>
      </div>

      {imageNewFeed && (
        <div className={styles.image_wrapper}>
          <CloseCircleFilled
            onClick={() => {
              setImageNewFeed(null);
              hiddenFileInput.current.value = "";
            }}
          />
          <img alt="img" src={URL.createObjectURL(imageNewFeed)} />
        </div>
      )}

      <div className={styles.footer}>
        <div
          style={{
            borderRight: "1px solid rgb(216, 220, 240)",
          }}
        >
          <Button
            size="large"
            icon={
              <FileImageFilled
                style={{ color: imageNewFeed ? "#00000040" : "#1e88e5" }}
              />
            }
            style={{
              fontFamily: "Gilroy",
              padding: "15px 30px",
              height: "auto",
              border: "none",
              boxShadow: "none",
              color: imageNewFeed ? "#00000040" : "#1e88e5",
              fontWeight: "bold",
              backgroundColor: "none",
              background: "none",
            }}
            disabled={imageNewFeed}
            onClick={() => {
              console.log("click");
              hiddenFileInput.current.click();
            }}
          >
            Thêm hình ảnh
          </Button>
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            ref={hiddenFileInput}
            onChange={(el) => {
              console.log(el.target.files);
              setImageNewFeed(el.target.files[0]);
            }}
            style={{ display: "none" }}
          />
        </div>
        <div>
          <Button
            type="primary"
            size="large"
            style={{
              fontFamily: "Gilroy",
              padding: "15px 30px",
              height: "auto",
              fontWeight: "bold",
              marginLeft: "30px",
            }}
            loading={isLoading}
            onClick={onPost}
          >
            Đăng tin
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FormCreateNews;
