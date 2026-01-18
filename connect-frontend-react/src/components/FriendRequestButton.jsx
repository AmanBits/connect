import axios from "../assets/js/api";
import React, { useEffect, useState, useRef } from "react";

export default function FriendRequestButton() {
  const [requests, setRequests] = useState([]);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Initial load
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    const res = await axios.get("/friendship/incomingFriendshipRequest");
    console.log(res.data);
    setRequests(res.data || []);
  };

  // WebSocket / Custom event
  useEffect(() => {
    const handler = (e) => {
      if (e.detail.type === "FRIEND_REQUEST") {
        setRequests((prev) => [e.detail.payload, ...prev]);
      }
    };
    window.addEventListener("friend-request", handler);
    return () => window.removeEventListener("friend-request", handler);
  }, []);

  // Close on outside click
  useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const acceptRequest = async (requestId) => {
    
    const res =await axios.post(`/friendship/acceptFriendRequest`,{requestId:requestId});
    console.log(res);
    setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
  };

  const rejectRequest = async (requestId) => {
    await axios.post(`/friendship/rejectFriendRequest/`,{requestId:requestId});
    setRequests((prev) => prev.filter((r) => r.requestId !== requestId));
  };

  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button style={styles.button} onClick={() => setOpen(!open)}>
        👥
        {requests.length > 0 && (
          <span style={styles.badge}>{requests.length}</span>
        )}
      </button>

      {open && (
        <div style={styles.dropdown}>
          <h4 style={styles.header}>Friend Requests</h4>

          {requests.length === 0 && (
            <p style={styles.empty}>No new requests</p>
          )}

          {requests.map((req) => (
            <div key={req.requestId} style={styles.item}>
              <img
                src={`http://localhost:8080`+req.requesterProfileImage}
                alt={req.requesterFullname}
                style={styles.avatar}
              />

              <div style={{ flex: 1 }}>
                <div style={styles.name}>{req.requesterFullname}</div>
                <div style={styles.username}>{req.requesterUsername}</div>
              </div>

              <div style={styles.actions}>
                <button
                  style={styles.accept}
                  onClick={() => acceptRequest(req.requestId)}
                >
                  ✓
                </button>
                <button
                  style={styles.reject}
                  onClick={() => rejectRequest(req.requestId)}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


const styles = {
  button: {
    position: "relative",
    padding: "10px",
    borderRadius: "8px",
    background: "#fff",
    border: "1px solid #ddd",
    cursor: "pointer",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    fontSize: "12px",
    padding: "2px 6px",
  },
  dropdown: {
    position: "absolute",
    top: "45px",
    right: 0,
    width: "320px",
    background: "#fff",
    borderRadius: "10px",
    border: "1px solid #ddd",
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
    zIndex: 100,
  },
  header: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    margin: 0,
  },
  empty: {
    padding: "12px",
    textAlign: "center",
    color: "#777",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    borderBottom: "1px solid #eee",
  },
  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    objectFit: "cover",
  },
  name: {
    fontWeight: "600",
  },
  username: {
    fontSize: "12px",
    color: "#777",
  },
  actions: {
    display: "flex",
    gap: "6px",
  },
  accept: {
    background: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    cursor: "pointer",
  },
  reject: {
    background: "#f44336",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    cursor: "pointer",
  },
};
