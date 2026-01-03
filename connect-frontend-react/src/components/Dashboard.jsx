import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Dashboard/Navbar";
import ConnectionList from "./Dashboard/ConnectionList";
import MessageBox from "./Dashboard/MessageBox";
import axios from "../assets/js/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const wsRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const [hideBox, setHideBox] = useState(true);
  const [recepient, setRecepient] = useState(null);

  const [friendList, setFriendList] = useState([]);

  const isMobile = window.innerWidth < 768;

  /* ---------------- GEO ---------------- */
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }),
      (err) => setError(err.message)
    );
  }, []);

  /* ---------------- FRIEND LIST ---------------- */
  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const res = await axios.get("/friendship/friendList", {
          withCredentials: true,
        });
        setFriendList(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFriendList();
  }, []);

  /* ---------------- OPEN CHAT ---------------- */
  const openChat = (friend) => {
    setRecepient(friend);
    setHideBox(false); // ✅ open message box
  };

  /* ---------------- SEND FRIEND REQUEST ---------------- */
  const openBox = async (user) => {
    await axios.post(
      "/friendship/sendFriendRequest",
      { id: user.id },
      { withCredentials: true }
    );
  };

  return (
    <div>
      <Navbar />
      {error && <p style={{ color: "red" }}>{error}</p>}

     

      <div style={styles.container(isMobile)}>
        {/* ---------------- LEFT COLUMN ---------------- */}
        <div style={styles.left}>
          <h4>Friends</h4>

          {friendList.length === 0 && <p>No friends</p>}

          {friendList.map((friend) => (
            <div
              key={friend.id}
              style={styles.friendItem}
              onClick={() => openChat(friend)}
            >
            {friend.online ? "🟢" : "⚫"}
              <img
                src={
                  friend.profileImageUrl
                    ? `http://localhost:8080${friend.profileImageUrl}`
                    : "/default-avatar.png"
                }
                alt={friend.fullname}
                style={styles.avatar}
              />
              <span>{friend.fullname}</span>
            </div>
          ))}
        </div>

        {/* ---------------- CENTER COLUMN ---------------- */}
        <div style={styles.center}>
          <ConnectionList nearbyUsers={nearbyUsers} openBox={openBox} />

          {!hideBox && <MessageBox recepient={recepient} />}
        </div>

        {/* ---------------- RIGHT COLUMN ---------------- */}
        <div style={styles.right}>
          {/* Future: FriendRequestButton / Info */}
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

  left: {
    flex: 1,
    borderRight: "1px solid #eee",
  },

  center: {
    flex: 2,
    minWidth: 0,
  },

  right: {
    flex: 1,
    borderLeft: "1px solid #eee",
  },

  friendItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    cursor: "pointer",
    borderRadius: 8,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #4f46e5",
  },

 
};
