import { useAuthState } from "react-firebase-hooks/auth";
import Zoom from "react-medium-image-zoom";
import { auth } from "../../../firebase";
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
          <Zoom>
            <img
              style={{ borderRadius: "8px" }}
              alt="Không tìm thấy"
              width="200px"
              src={message.imgUrl}
            />
          </Zoom>
        )}
      </div>
    </div>
  );
};

export default Message;
