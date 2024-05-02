import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Message from "pages/ChatBox/Message/Message";
import SendMessage from "pages/ChatBox/SendMessage/SendMessage";
import { useEffect, useState, useLayoutEffect } from "react";
import { firestore } from "../../firebase";

const ChatBox = () => {
  const [messages, setMessages] = useState([]);

  useLayoutEffect(() => {
    const tmp = document.querySelectorAll(".chat-bubble");
    if (tmp.length > 0) {
      tmp[tmp.length - 1].scrollIntoView({ behavior: "smooth" });
    }
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
      }}
    >
      <div
        className="messages-wrapper"
        style={{
          overflow: "auto",
        }}
      >
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      <SendMessage />
    </main>
  );
};

export default ChatBox;
