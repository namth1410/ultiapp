import React from "react";
import { auth } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./index.css";

const Message = ({ message }) => {
  const [user] = useAuthState(auth);
  return (
    <div className={`chat-bubble ${message.uid === user.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name}</p>
        <p className="user-message">{message.text}</p>
        {message.imgUrl !== "" && (
          <img
            style={{ borderRadius: "8px" }}
            alt="Không tìm thấy"
            width="250px"
            src={message.imgUrl}
          />
        )}
      </div>
    </div>
  );
};

export default Message;
