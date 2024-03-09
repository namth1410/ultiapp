import { DeleteFilled, MessageOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Input, Modal } from "antd";
import CommentItem from "components/CommentItem/CommentItem";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import { useState } from "react";
import { convertDurationToStringV1 } from "ultis/time";
import { auth, firestore } from "../../firebase";
import styles from "./NewItem.module.css";

function NewItem({ newfeed }) {
  const [commentDraft, setCommentDraft] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onDeletePost = async () => {
    deleteDoc(doc(firestore, "newsfeed", newfeed.id));
  };

  const onComment = async () => {
    if (commentDraft.length === 0) return;
    setCommentDraft("");
    const newComment = {
      dateCreate: new Date().toISOString(),
      uidCreator: auth.currentUser.uid,
      nameCreator: auth.currentUser.displayName,
      photoURL: auth.currentUser.photoURL,
      comment: commentDraft,
    };

    const newComments = newfeed.comments
      ? [newComment, ...newfeed.comments]
      : [newComment];

    const dataToAdd = { ...newfeed, comments: newComments };
    const quizzRef = doc(firestore, "newsfeed", newfeed.id);
    await updateDoc(quizzRef, dataToAdd);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.info_creator}>
          <div className={styles.avatar}>
            <img alt="img" src={newfeed.photoURL} />
          </div>
          <div className={styles.info}>
            <p>{newfeed.nameCreator}</p>
            <p style={{ fontSize: "12px", fontWeight: "500" }}>
              {convertDurationToStringV1(newfeed.dateCreate)}
            </p>
          </div>
        </div>

        {newfeed.uidCreator === auth.currentUser.uid && (
          <DeleteFilled
            onClick={() => {
              setIsModalOpen(true);
            }}
            style={{ color: "#ff5c5c" }}
          />
        )}
      </div>

      <p style={{ fontWeight: "700", margin: "8px 0" }}>{newfeed.content}</p>

      {newfeed.image !== "" && (
        <div className={styles.image_wrapper}>
          <img alt="img" src={newfeed.image} />
        </div>
      )}

      {newfeed.comments && (
        <div className={styles.comment_wrapper}>
          <p>
            <MessageOutlined /> {`${newfeed.comments.length} bình luận`}
          </p>
        </div>
      )}

      <div className={styles.comment_form}>
        <div className={styles.avatar}>
          <img alt="img" src={newfeed.photoURL} />
        </div>

        <Input
          size="large"
          placeholder="Viết bình luận..."
          style={{ borderRadius: "100px" }}
          value={commentDraft}
          onChange={(e) => {
            setCommentDraft(e.target.value);
          }}
          onPressEnter={onComment}
        />
        <Button
          icon={<SendOutlined />}
          onClick={onComment}
          disabled={commentDraft.length <= 0}
          style={{ color: "primary", border: "none", backgroundColor: "#fff" }}
        ></Button>
      </div>

      {newfeed?.comments && (
        <div className={styles.comments}>
          {newfeed.comments.map((comment) => {
            return <CommentItem key={comment} comment={comment} />;
          })}
        </div>
      )}

      <Modal
        title="Xóa bài viết"
        open={isModalOpen}
        onOk={onDeletePost}
        onCancel={() => {
          setIsModalOpen(false);
        }}
      >
        <p>Bài viết sẽ bị xóa khỏi bảng tin</p>
      </Modal>
    </div>
  );
}

NewItem.propTypes = {
  newfeed: PropTypes.any,
};

export default NewItem;
