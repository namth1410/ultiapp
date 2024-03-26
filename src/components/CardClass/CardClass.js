import { Button, Card, Input, Modal, Tag } from "antd";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import PropTypes from "prop-types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { auth, firestore } from "../../firebase";

function CardClass({ props, isSearching = false }) {
  const { id, nameClass, members, nameCreator, password, config } = props;
  const navigate = useNavigate();

  const [inputPassword, setInputPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onRequest = async () => {
    if (password !== inputPassword) {
      toast.error("Mã bảo vệ không đúng", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      setIsLoading(true);
      if (members?.includes(auth.currentUser.uid)) {
        toast.success("Bạn đã ở trong lớp", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } else {
        if (config.approveStudent) {
          const q = query(
            collection(firestore, "notifications"),
            where("type", "==", "request_join_class"),
            where("uidCreator", "==", auth.currentUser.uid),
            where("class", "==", id)
          );

          const querySnapshot = await getDocs(q);

          if (!querySnapshot.empty) {
            console.log("Đã tồn tại bản ghi với cùng type và uidCreator");
          } else {
            const dataToAdd = {
              dateCreate: new Date().toISOString(),
              uidCreator: auth.currentUser.uid,
              nameCreator: auth.currentUser.displayName,
              photoURL: auth.currentUser.photoURL,
              class: id,
              type: "request_join_class",
            };
            const docRef = await addDoc(
              collection(firestore, "notifications"),
              dataToAdd
            );
            console.log(docRef);
            setInputPassword("");
          }
        } else {
          const classRef = doc(firestore, "classes", id);
          let dataToAdd = {};
          if (!members || !Array.isArray(members)) {
            dataToAdd.members = [auth.currentUser.uid];
          } else {
            dataToAdd.members = [...members, auth.currentUser.uid];
          }
          await updateDoc(classRef, dataToAdd);
          toast.success("Bạn đã ở trong lớp", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          navigate(`/class/${id}/newsfeed`);
        }
      }

      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          isSearching ? setIsModalOpen(true) : navigate(`/class/${id}`);
        }}
        style={{
          cursor: "pointer",
          border: "none",
          backgroundColor: "unset",
          width: "fit-content",
        }}
      >
        <Card
          title={nameClass}
          style={{
            width: 300,
          }}
        >
          <Tag color="#108ee9">{`${members?.length || 0} thành viên`}</Tag>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginTop: "35px",
              width: "100%",
              fontFamily: "Gilroy",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Người tạo:</span>
              <span style={{ fontWeight: "bold" }}>{nameCreator}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <span>Mã lớp:</span>
              <span style={{ fontWeight: "bold" }}>{id}</span>
            </div>
          </div>
        </Card>
      </button>
      <Modal
        title={`Tham gia lớp ${nameClass}?`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
        }}
        footer={(_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <Button
              disabled={password !== "" && inputPassword === ""}
              onClick={onRequest}
              type="primary"
              loading={isLoading}
            >
              Gửi yêu cầu
            </Button>
          </>
        )}
      >
        <p style={{ width: "100%", height: "100px" }}></p>
        {password !== "" && (
          <Input
            placeholder="Nhập mã bảo vệ"
            value={inputPassword}
            onChange={(e) => {
              setInputPassword(e.target.value);
            }}
            onPressEnter={onRequest}
          />
        )}
      </Modal>
    </>
  );
}

CardClass.propTypes = {
  props: PropTypes.object,
  id: PropTypes.string,
  nameClass: PropTypes.string,
  members: PropTypes.array,
  nameCreator: PropTypes.string,
  isSearching: PropTypes.any,
  password: PropTypes.string,
  config: PropTypes.any,
};

export default CardClass;
