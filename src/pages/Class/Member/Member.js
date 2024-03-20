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
  deleteDoc,
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
  const { dataClass, classId, requestJoinClass } = useClass();

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

  const onApproveAll = async () => {
    requestJoinClass.forEach((el) => {
      onAddUserToClass(el.uidCreator);
      onDeleteRequestJoinClass(el.id);
    });
  };

  const onRejectAll = async () => {
    requestJoinClass.forEach((el) => {
      onDeleteRequestJoinClass(el.id);
    });
  };

  const onAddUserToClass = async (uid) => {
    const classRef = doc(firestore, "classes", dataClass.id);
    const docSnap = await getDoc(classRef);
    if (docSnap.exists()) {
      const classData = docSnap.data();
      if (!classData.members?.includes(uid)) {
        let dataToAdd = {};
        if (!classData.members || !Array.isArray(classData.members)) {
          dataToAdd.members = [uid];
        } else {
          dataToAdd.members = [...classData.members, uid];
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

  const onDeleteRequestJoinClass = async (id) => {
    await deleteDoc(doc(firestore, "notifications", id));
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
          <Table
            style={{ width: "100%" }}
            columns={columns}
            dataSource={dataMembers}
          />
        )}
        {requestJoinClass && (
          <div className={styles.right_box}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "600",
              }}
            >{`Chờ duyệt • ${requestJoinClass.length}`}</p>
            <button
              onClick={onApproveAll}
              className={`${styles.btn} ${styles.ok_btn}`}
            >
              Phê duyệt tất cả
            </button>
            <button
              onClick={onRejectAll}
              className={`${styles.btn} ${styles.reject_btn}`}
            >
              Từ chối tất cả
            </button>

            <div style={{ marginTop: "5px" }}>
              {requestJoinClass.map((el) => {
                return (
                  <RequestJoinItem
                    key={el}
                    item={el}
                    onAddUserToClass={onAddUserToClass}
                    onDeleteRequestJoinClass={onDeleteRequestJoinClass}
                  />
                );
              })}
            </div>
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
            onClick={() => {
              onAddUserToClass(userSearch.uid);
            }}
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

const RequestJoinItem = ({
  item,
  onAddUserToClass,
  onDeleteRequestJoinClass,
}) => {
  const { id, uidCreator, photoURL, nameCreator } = item;
  console.log(item);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        height: "100%",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "14px",
          width: "100%",
          fontWeight: "600",
        }}
      >
        <img
          style={{
            objectFit: "cover",
            borderRadius: "50%",
            width: "35px",
          }}
          src={photoURL}
          alt="Notification Icon"
        />
        <span>{nameCreator}</span>
      </div>

      <div
        style={{
          display: "flex",
          width: "100%",
          justifyContent: "space-around",
          gap: "10px",
        }}
      >
        <button
          onClick={() => {
            onAddUserToClass(uidCreator);
            onDeleteRequestJoinClass(id);
          }}
          className={`${styles.mini_btn} ${styles.ok_btn}`}
        >
          Duyệt
        </button>
        <button
          onClick={() => {
            onDeleteRequestJoinClass(id);
          }}
          className={`${styles.mini_btn} ${styles.reject_btn}`}
        >
          Xóa
        </button>
      </div>
    </div>
  );
};

export default Member;
