import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar";
import ConnectionList from "./ConnectionList";
import MessageBox from "./MessageBox";
import axios from "../assets/js/api";

export default function Dashboard() {
  const wsRef = useRef(null);

  const [activeChat, setActiveChat] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [friendList, setFriendList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [convId, setConvId] = useState(null);

  const isMobile = window.innerWidth < 768;

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    const loadInitial = async () => {
      const [notifRes, countRes] = await Promise.all([
        axios.get("/notifications"),
        axios.get("/notifications/unread-count"),
      ]);
      setNotifications(notifRes.data);
      setUnreadCount(countRes.data.count);
    };
    loadInitial();
  }, []);

  /* ---------------- WEBSOCKET ---------------- */
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws/notifications");
    wsRef.current = socket;

    socket.onopen = () => {
      const ping = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "PING" }));
        }
      }, 10000);
      socket._ping = ping;
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      /* ---- Notifications ---- */
      if (data.type === "FRIEND_REQUEST") {
        setNotifications((prev) => [{ ...data, read: false }, ...prev]);
        setUnreadCount((prev) => prev + 1);

        window.dispatchEvent(
          new CustomEvent("friend-request", { detail: data })
        );
      }

      if (data.type === "PRESENCE") {
        setFriendList((prev) =>
          prev.map((f) =>
            String(f.userId) === String(data.userId)
              ? { ...f, online: data.online }
              : f
          )
        );
        return;
      }

      if (data.type === "REQUEST_ACCEPT") {
        alert(data.message);
        return;
      }

     

      /* ---- CHAT EVENTS ---- */
      if (
        data.eventType === "CHAT_MESSAGE" ||
        data.eventType === "MESSAGE_ACK"
      ) {
        window.dispatchEvent(new CustomEvent("chat-message", { detail: data }));
      }
    };

    return () => {
      clearInterval(socket._ping);
      socket.close();
    };
  }, []);

  const openBox = async (user) => {
    try {
      const res = await axios.post("/friendship/sendFriendRequest", {
        id: user.id,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------------- FRIEND LIST ---------------- */
  useEffect(() => {
    axios
      .get("/friendship/friendList", { withCredentials: true })
      .then((res) => setFriendList(res.data));
  }, []);

  /* ---------------- OPEN CHAT ---------------- */
  const openChat = async (friend) => {
    try {
      const res = await axios.post("/conversation", {
        friendId: friend.userId,
      });

      if (res.data.id) {
        const msgRes = await axios.get(`/messages/${res.data.id}`);
        setConvId(res.data.id);
        setMessages(msgRes.data);
      }

      setActiveChat(friend);
    } catch (err) {
      console.error("Open chat error:", err);
    }
  };

  return (
    <div>
      <Navbar
        notifications={notifications}
        unreadCount={unreadCount}
        convId={convId}
        onOpenNotifications={async() => {
             try {
              const res = await axios.put("/notifications/read-all");
              setUnreadCount(0);
              
             } catch (error) {
              console.log("OPEN NOZTIFICATION ERROR");
             }
        }}
      />

      <div style={styles.container(isMobile)}>
        <div style={styles.left}>
          <h4>Friends</h4>
          {friendList.map((friend) => (
            <div
              key={friend.userId}
              style={styles.friendItem}
              onClick={() => openChat(friend)}
            >
              {friend.online ? "🟢" : "⚫"} {friend.fullname}
            </div>
          ))}
        </div>

        <div style={styles.center}>
          <ConnectionList openBox={openBox} />

          {activeChat && (
            <MessageBox
              friend={activeChat}
              wsRef={wsRef}
              message={messages}
              convId={convId}
              onClose={() => setActiveChat(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: (isMobile) => ({
    display: "flex",
    flexDirection: isMobile ? "column" : "row",
    gap: 16,
    padding: 16,
  }),
  left: { flex: 1 },
  center: { flex: 2 },
  friendItem: { padding: 10, cursor: "pointer" },
};
