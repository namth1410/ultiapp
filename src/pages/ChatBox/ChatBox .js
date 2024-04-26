import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Message from "pages/ChatBox/Message/Message";
import SendMessage from "pages/ChatBox/SendMessage/SendMessage";
import { useEffect, useState } from "react";
import { firestore } from "../../firebase";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    document.querySelector("form").scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const q = query(
      collection(firestore, "messages"),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let fetchedMessages = [];
      QuerySnapshot.forEach((doc) => {
        fetchedMessages.push({ ...doc.data(), id: doc.id });
      });
      fetchedMessages.sort((a, b) => a.createdAt - b.createdAt);
      setMessages(fetchedMessages);
    });
    return () => unsubscribe;
  }, []);

  return (
    <main
      className="chat-box"
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "auto",
      }}
    >
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <SendMessage />
    </main>
  );
};

export default ChatBox;
