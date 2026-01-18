import { useEffect, useRef, useState } from "react";

export default function MessageBox({
  friend,
  wsRef,
  onClose,
  message,
  convId,
}) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState(message || []);
  const bottomRef = useRef(null);

  /* ---------------- RECEIVE MESSAGE ---------------- */
  useEffect(() => {
    const handler = (e) => {
      const data = e.detail;
      console.log("MessageBox received:", data);

      // Incoming chat message
      if (data.eventType === "CHAT_MESSAGE" && data.conversationId === convId) {
        setMessages((prev) => [
          ...prev,
          {
            id: data.messageId,
            content: data.content,
            self: false, // receiver always false
          },
        ]);
      }

      // ACK for sender
      if (data.type === "MESSAGE_ACK") {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.tempId ? { ...m, id: data.messageId } : m
          )
        );
      }
    };

    window.addEventListener("chat-message", handler);
    return () => window.removeEventListener("chat-message", handler);
  }, [convId]);

  /* ---------------- AUTO SCROLL ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- SEND MESSAGE ---------------- */
  const sendMessage = () => {
    if (!text.trim()) return;
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const tempId = crypto.randomUUID();

    wsRef.current.send(
      JSON.stringify({
        type: "CHAT_MESSAGE",
        tempId,
        senderId: "04fcf732-943b-4186-985a-7fc631d8c9b3",
        receiverId: friend.userId,
        conversationId: convId,
        content: text,
      })
    );

    // Optimistic UI
    setMessages((prev) => [...prev, { id: tempId, content: text, self: true }]);

    setText("");
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.container}>
        <div style={styles.header}>
          <span>{friend.fullname}</span>
          <button onClick={onClose}>✕</button>
        </div>

        <div style={styles.body}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                ...styles.bubble,
                ...(m.self ? styles.self : styles.other),
              }}
            >
              {m.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div style={styles.footer}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: 360,
    height: 450,
    background: "#fff",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: 10,
    background: "#2563eb",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
  },
  body: {
    flex: 1,
    padding: 10,
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  bubble: {
    padding: "8px 12px",
    borderRadius: 14,
    maxWidth: "75%",
  },
  self: {
    alignSelf: "flex-end",
    background: "#2563eb",
    color: "#fff",
  },
  other: {
    alignSelf: "flex-start",
    background: "#e5e7eb",
  },
  footer: {
    display: "flex",
    gap: 8,
    padding: 8,
  },
};
