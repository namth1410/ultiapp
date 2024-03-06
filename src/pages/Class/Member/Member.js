import { Button, Input, Modal, Table } from "antd";
import empty from "assets/img/empty.json";
import { useClass } from "contexts/class_context/ClassContext";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { firestore } from "../../../firebase";
import styles from "./Member.module.css";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";

const { Search } = Input;

function Member() {
  const { dataClass } = useClass();

  const [isModalAddMemberOpen, setIsModalAddMemberOpen] = useState(false);
  const [userSearch, setUserSearch] = useState(null);
  const [dataMembers, setDataMembers] = useState([]);

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "address",
    },
  ];

  const handleOk = () => {
    setIsModalAddMemberOpen(false);
    setUserSearch(null);
  };
  const handleCancel = () => {
    setIsModalAddMemberOpen(false);
    setUserSearch(null);
  };

  const onSearchUser = async (value, _e, info) => {
    const usersRef = collection(firestore, "users");
    const querySnapshot = await getDocs(
      query(usersRef, where("email", "==", value))
    );
    const usersData = [];
    querySnapshot?.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });
    setUserSearch(usersData[0]);
  };

  const onAddUserToClass = async () => {
    const classRef = doc(firestore, "classes", dataClass.id);
    const docSnap = await getDoc(classRef);
    if (docSnap.exists()) {
      const classData = docSnap.data();
      let dataToAdd = {};
      if (!classData.members || !Array.isArray(classData.members)) {
        dataToAdd.members = [userSearch.uid];
      } else {
        dataToAdd.members = [...classData.members, userSearch.uid];
      }
      await updateDoc(classRef, dataToAdd);
      toast.success("Đã thêm mới 1 người", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      handleCancel();
    } else {
      console.log("No such document!");
      toast.error("Lỗi", {
        position: "top-center",
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
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const convertToDataTable = (data) => {
    return data.map((el) => ({
      key: el.id,
      name: el.displayName,
      age: 22,
      email: el.email,
    }));
  };
  useEffect(() => {
    if (!dataClass) return;
    const promises = dataClass.members.map((userId) => {
      const userQuery = query(
        collection(firestore, "users"),
        where("uid", "==", userId)
      );
      return getDocs(userQuery);
    });

    Promise.all(promises)
      .then((userSnapshotsArray) => {
        const usersData = [];
        userSnapshotsArray.forEach((userSnapshots) => {
          userSnapshots.forEach((snapshot) => {
            usersData.push({ id: snapshot.id, ...snapshot.data() });
          });
        });
        setDataMembers(convertToDataTable(usersData));
      })
      .catch((error) => {
        console.error("Error getting user data:", error);
      });
  }, [dataClass]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tools}>
        <Search
          placeholder="Nhập và nhấn enter để tìm kiếm"
          onSearch={onSearch}
          enterButton
          size="large"
        />

        <Button
          type="primary"
          size="large"
          style={{
            fontFamily: "Gilroy",
            padding: "10px 15px",
            height: "auto",
          }}
          onClick={() => {
            setIsModalAddMemberOpen(true);
          }}
        >
          Thêm học sinh
        </Button>
      </div>
      <div className={styles.content}>
        {!dataClass?.members ? (
          <Lottie
            style={{ width: "40%", margin: "auto", marginTop: "10%" }}
            animationData={empty}
            loop={true}
          />
        ) : (
          <div>
            <Table columns={columns} dataSource={dataMembers}/>
          </div>
        )}
      </div>

      <Modal
        title="Thêm người vào lớp"
        open={isModalAddMemberOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button
            type="primary"
            style={{
              width: "100%",
              fontFamily: "Gilroy",
              padding: "10px 5px",
              height: "auto",
              fontSize: "18px",
            }}
            onClick={onAddUserToClass}
            key={1}
          >
            Thêm vào lớp
          </Button>,
        ]}
      >
        <Search
          placeholder="Nhập email của người muốn thêm"
          onSearch={onSearchUser}
          enterButton
          size="large"
        />
        <div
          style={{
            height: "300px",
          }}
        >
          {userSearch ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
                height: "100%",
              }}
            >
              <img
                style={{
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
                src={userSearch.profilePic}
                alt="Notification Icon"
              />
              <span>{userSearch.email}</span>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default Member;
