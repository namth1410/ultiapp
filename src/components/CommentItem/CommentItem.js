import PropTypes from "prop-types";
import { convertDurationToStringV1 } from "ultis/time";

function CommentItem({ comment }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        padding: "4px 0",
      }}
    >
      <div
        style={{
          position: "relative",
          display: "flex",
          width: "40px",
          height: "40px",
          marginRight: "8px",
        }}
      >
        <img
          alt="img"
          style={{
            width: "100%",
            height: "100%",
            textAlign: "center",
            objectFit: "cover",
            borderRadius: "50%",
          }}
          src="https://shub-storage.sgp1.cdn.digitaloceanspaces.com/profile_images/AvatarDefaultPng.png"
        />
      </div>

      <div
        style={{
          backgroundColor: "rgb(239, 239, 245)",
          borderRadius: "16px",
          padding: "8px 16px",
          margin: "4px",
          maxWidth: "calc(100% - 96px)",
          width: "fit-content",
          flex: "inherit",
        }}
      >
        <div style={{ width: "fit-content", fontSize: "14px" }}>
          <span>{`${comment.nameCreator} ~ `}</span>
          <span style={{ color: "#65697b", fontWeight: "700" }}>
            {convertDurationToStringV1(comment.dateCreate)}
          </span>
        </div>

        <span style={{ wordBreak: "break-all", fontWeight: "initial" }}>
          {comment.comment}
        </span>
      </div>
    </div>
  );
}

CommentItem.propTypes = {
  comment: PropTypes.any,
};

export default CommentItem;
