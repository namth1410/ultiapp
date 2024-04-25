import { DeleteOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Table, ConfigProvider } from "antd";
import {
  addUserToClass,
  deleteRequestJoinClass,
  getMembersOfClass,
  getUserByEmail,
  removeMemberFromClass,
} from "appdata/member/memberSlice";
import empty from "assets/img/empty.json";
import { useClass } from "contexts/class_context/ClassContext";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAuth } from "../../../firebase";
import styles from "./Member.module.scss";

const { Search } = Input;

function Member() {
  const currentUser = useAuth();
  const dispatch = useDispatch();
  const { dataClass, classId, requestJoinClass } = useClass();

  const memberRedux = useSelector((state) => state.memberRedux);

  const [isModalAddMemberOpen, setIsModalAddMemberOpen] = useState(false);
  const [userSearch, setUserSearch] = useState(null);
  const [dataMembers, setDataMembers] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleteMemberModal, setIsDeleteMemberModal] = useState(false);
  const [memberIdWantDelete, setMemberIdWantDelete] = useState(null);
  const [isOwnClass, setIsOwnClass] = useState(false);

  const [columns, setColumns] = useState([
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
            cursor: isOwnClass ? "pointer" : "not-allowed",
            color: isOwnClass ? "red" : "#ccc",
            backgroundColor: "unset",
            border: "none",
          }}
          disabled={!isOwnClass}
          onClick={(_) => {
            setIsDeleteMemberModal(true);
            setMemberIdWantDelete(record.key);
          }}
        >
          <DeleteOutlined />
        </button>
      ),
    },
  ]);

  const onRemoveMemberFromClass = async (classId, memberId) => {
    try {
      dispatch(removeMemberFromClass({ classId: classId, memberId: memberId }));
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
    dispatch(getUserByEmail({ email: value }));
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
    dispatch(
      addUserToClass({ classId: classId, uid: uid, currentUser: currentUser })
    );
    handleCancel();
  };

  const onDeleteRequestJoinClass = async (id) => {
    dispatch(deleteRequestJoinClass({ id: id }));
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
    if (!currentUser || !dataClass) return;
    setIsOwnClass(currentUser.uid === dataClass.uidCreator);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, dataClass]);

  useEffect(() => {
    setColumns([
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
              cursor: isOwnClass ? "pointer" : "not-allowed",
              color: isOwnClass ? "red" : "#ccc",
              backgroundColor: "unset",
              border: "none",
            }}
            disabled={!isOwnClass}
            onClick={(_) => {
              setIsDeleteMemberModal(true);
              setMemberIdWantDelete(record.key);
            }}
          >
            <DeleteOutlined />
          </button>
        ),
      },
    ]);
  }, [isOwnClass]);

  useEffect(() => {
    if (!memberRedux.members) return;
    setDataMembers(convertToDataTable(memberRedux.members));
    setUserSearch(memberRedux.searchUser);
    setIsSearching(false);
  }, [memberRedux]);

  useEffect(() => {
    if (!dataClass?.members) return;
    dispatch(getMembersOfClass(dataClass));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataClass]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.tools}>
        <ConfigProvider
          theme={{
            token: {
              colorText: "var(--text-color-primary)",
              colorTextPlaceholder: "var(--text-color-secondary)",
              colorBorder: "var(--text-color-primary)",
              colorBgContainer: "var(--body-background)",
            },
          }}
        >
          <Search
            placeholder="Nhập và nhấn enter để tìm kiếm"
            onSearch={onSearch}
            enterButton
            size="large"
          />
        </ConfigProvider>

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
          <ConfigProvider
            theme={{
              token: {
                colorText: "var(--text-color-primary)",
                colorTextPlaceholder: "var(--text-color-secondary)",
                colorBorder: "var(--text-color-primary)",
                colorBgContainer: "var(--body-background)",
              },
              components: {
                Table: {
                  rowHoverBg: "var(--blue)",
                  headerBg: "#868e97",
                },
              },
            }}
          >
            <Table
              style={{ width: "100%" }}
              columns={columns}
              dataSource={dataMembers}
            />
          </ConfigProvider>
        )}
        {requestJoinClass && isOwnClass && (
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
          onRemoveMemberFromClass(classId, memberIdWantDelete);
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
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "10px",
        margin: "15px 0",
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
