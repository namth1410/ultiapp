import { DeleteOutlined } from "@ant-design/icons";
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
  runTransaction,
  updateDoc,
  where,
} from "firebase/firestore";
import { toast } from "react-toastify";

const { Search } = Input;

function Member() {
  const { dataClass, classId } = useClass();

  const [isModalAddMemberOpen, setIsModalAddMemberOpen] = useState(false);
  const [userSearch, setUserSearch] = useState(null);
  const [dataMembers, setDataMembers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleteMemberModal, setIsDeleteMemberModal] = useState(false);
  const [memberIdWantDelete, setMemberIdWantDelete] = useState(null);

  const columns = [
    {
      title: "Họ và tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "address",
    },
    {
      title: "Xóa",
      dataIndex: "",
      key: "x",
      render: (_, record) => (
        <button
          style={{
            cursor: "pointer",
            color: "red",
            backgroundColor: "unset",
            border: "none",
          }}
          onClick={(_) => {
            setIsDeleteMemberModal(true);
            setMemberIdWantDelete(record.key);
          }}
        >
          <DeleteOutlined />
        </button>
      ),
    },
  ];

  const removeMemberFromClass = async (classId, memberId) => {
    try {
      const classRef = doc(firestore, "classes", classId);

      await runTransaction(firestore, async (transaction) => {
        const classDoc = await transaction.get(classRef);
        if (!classDoc.exists()) {
          throw new Error("Class document does not exist.");
        }

        const members = classDoc.data().members || [];

        const updatedMembers = members.filter((id) => id !== memberId);

        transaction.update(classRef, { members: updatedMembers });
      });
      setIsDeleteMemberModal(false);
      toast.success("Đã xóa", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      console.log("Member removed successfully.");
    } catch (error) {
      console.error("Error removing member from class:", error);
    }
  };

  const handleOk = () => {
    setIsModalAddMemberOpen(false);
    setUserSearch(null);
  };
  const handleCancel = () => {
    setIsModalAddMemberOpen(false);
    setUserSearch(null);
  };

  const onSearchUser = async (value, _e, info) => {
    setIsSearching(true);
    const usersRef = collection(firestore, "users");
    const querySnapshot = await getDocs(
      query(usersRef, where("email", "==", value))
    );
    const usersData = [];
    querySnapshot?.forEach((doc) => {
      usersData.push({ id: doc.id, ...doc.data() });
    });
    setUserSearch(usersData[0]);
    setIsSearching(false);
  };

  const onAddUserToClass = async () => {
    const classRef = doc(firestore, "classes", dataClass.id);
    const docSnap = await getDoc(classRef);
    if (docSnap.exists()) {
      const classData = docSnap.data();
      if (!classData.members?.includes(userSearch.uid)) {
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
        toast.warning("Người này đã ở trong lớp", {
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
    } else {
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
      key: el.uid,
      name: el.displayName,
      email: el.email,
    }));
  };
  useEffect(() => {
    if (!dataClass?.members) return;
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
            <Table columns={columns} dataSource={dataMembers} />
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
            disabled={!userSearch}
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
          loading={isSearching}
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
            <Lottie
              style={{ width: "40%", margin: "auto", marginTop: "10%" }}
              animationData={empty}
              loop={true}
            />
          )}
        </div>
      </Modal>

      <Modal
        title="Xóa thành viên"
        open={isDeleteMemberModal}
        onOk={() => {
          removeMemberFromClass(classId, memberIdWantDelete);
          setMemberIdWantDelete(null);
        }}
        onCancel={() => {
          setIsDeleteMemberModal(false);
          setMemberIdWantDelete(null);
        }}
      >
        <p>Bạn chắc chắn muốn xóa người này ra khỏi lớp?</p>
      </Modal>
    </div>
  );
}

export default Member;
