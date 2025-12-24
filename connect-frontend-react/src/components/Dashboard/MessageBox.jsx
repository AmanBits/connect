import React, { useEffect, useState } from "react";
import axios from "../../assets/js/axiosConfig";

export default function MessageBox({ hideBox, recieved }) {
  const [message, setMessage] = useState({
    recieved: recieved,
    type: "text",
    content: "Hello",
    status: "Delivered",
    timestamp: "2023-02-01 :13:00:00",
  });

  const sendMessage = async () => {
    try {
      await axios.post("/api/v1/sendMessage", { message });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {hideBox === true ? (
        <div style={styles.page}>
          <div style={styles.container}>
            {/* HEADER */}
            <div style={styles.header}>
              <div
                style={{ display: "flex", alignItems: "center", gap: "12px" }}
              >
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="user"
                  style={styles.avatar}
                />
                <div>
                  <div style={styles.name}>{recieved}</div>
                  <div style={styles.status}>Online</div>
                </div>
              </div>

              {/* CALL ACTIONS */}
              <div style={styles.headerActions}>
                <button style={styles.iconBtn} title="Audio Call">
                  📞
                </button>
                <button style={styles.iconBtn} title="Video Call">
                  📹
                </button>
                {/* <button style={{ ...styles.iconBtn, background: "#ff4d4f" }} title="End Call">
              ❌
            </button> */}
              </div>
            </div>

            {/* MESSAGES */}
            <div style={styles.messages}>
              <div style={{ ...styles.message, ...styles.received }}>
                Hi Aman 👋 How are you?
              </div>

              <div style={{ ...styles.message, ...styles.sent }}>
                I'm good! Working on my React project 😄
              </div>

              <div style={{ ...styles.message, ...styles.received }}>
                Nice! Let me know if you need help 🚀
              </div>
            </div>

            {/* INPUT */}
            <div style={styles.inputBox}>
              {/* MEDIA SHARE */}
              <label style={styles.attachBtn} title="Attach file">
                📎
                <input type="file" style={{ display: "none" }} />
              </label>

              <label style={styles.attachBtn} title="Send image">
                🖼️
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </label>

              <input
                type="text"
                placeholder="Type a message..."
                style={styles.input}
                value={message.content}
                onChange={(e) => setMessage(e.target.value)}
              />

              <button style={styles.sendBtn} onClick={sendMessage}>
                Send ➤
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    marginTop: "40px",
    fontFamily: "Segoe UI, sans-serif",
  },

  container: {
    width: "760px",
    height: "390px",
    background: "#fff",
    borderRadius: "14px",
    boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  header: {
    height: "70px",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },

  headerActions: {
    display: "flex",
    gap: "10px",
  },

  iconBtn: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "#fff",
    cursor: "pointer",
    fontSize: "16px",
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    border: "2px solid #fff",
  },

  name: {
    fontWeight: "600",
    fontSize: "16px",
  },

  status: {
    fontSize: "12px",
    opacity: 0.8,
  },

  messages: {
    flex: 1,
    padding: "20px",
    background: "#f4f6fb",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  message: {
    maxWidth: "65%",
    padding: "12px 16px",
    borderRadius: "18px",
    fontSize: "14px",
  },

  sent: {
    background: "#667eea",
    color: "#fff",
    alignSelf: "flex-end",
    borderBottomRightRadius: "4px",
  },

  received: {
    background: "#ffffff",
    color: "#333",
    alignSelf: "flex-start",
    borderBottomLeftRadius: "4px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  inputBox: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    borderTop: "1px solid #ddd",
    gap: "8px",
  },

  attachBtn: {
    cursor: "pointer",
    fontSize: "18px",
  },

  input: {
    flex: 1,
    padding: "12px 14px",
    borderRadius: "25px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "14px",
  },

  sendBtn: {
    padding: "10px 18px",
    borderRadius: "25px",
    border: "none",
    background: "#667eea",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "600",
  },
};
