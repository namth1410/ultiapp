import { DeleteFilled, MessageOutlined, SendOutlined } from "@ant-design/icons";
import { Button, Input, Modal } from "antd";
import {
  deleteNewsfeed,
  postCommentNewsfeed,
} from "appdata/newsfeed/newsfeedSlice";
import CommentItem from "components/CommentItem/CommentItem";
import { useClass } from "contexts/class_context/ClassContext";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { convertDurationToStringV1 } from "ultis/time";
import { auth, useAuth } from "../../firebase";
import styles from "./NewItem.module.css";

function NewItem({ newfeed }) {
  const { creatorId } = useClass();

  const currentUser = useAuth();
  const dispatch = useDispatch();

  const [commentDraft, setCommentDraft] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHiddenComment, setIsHiddenComment] = useState(false);

  const onDeletePost = async () => {
    dispatch(deleteNewsfeed({ newsfeedId: newfeed.id }));
    setIsModalOpen(false);
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
    dispatch(postCommentNewsfeed({ body: dataToAdd }));
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

        {(newfeed.uidCreator === currentUser?.uid ||
          currentUser?.uid === creatorId) && (
          <Button
            icon={<DeleteFilled />}
            onClick={() => {
              setIsModalOpen(true);
            }}
            className={styles.delete_btn}
          >
            Xóa
          </Button>
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

          <button
            onClick={() => {
              setIsHiddenComment(!isHiddenComment);
            }}
            style={{
              backgroundColor: "unset",
              border: "none",
              cursor: "pointer",
              textDecoration: "underline",
              fontFamily: "Gilroy",
              fontSize: "16px",
            }}
          >
            {isHiddenComment ? "Hiện bình luận" : "Ẩn bình luận"}
          </button>
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

      {newfeed?.comments && !isHiddenComment && (
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
