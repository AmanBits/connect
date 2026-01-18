import React from "react";

export default function NotificationPanel({ notifications }) {

  return (
    <div style={styles.panel}>
      <h4 style={styles.header}>Notifications</h4>

      {notifications.length === 0 && (
        <p style={styles.empty}>No notifications</p>
      )}

      {notifications.map((n) => (
        <div key={n.notificationId+12} style={styles.item}>
          <div style={styles.message}>{n.message}</div>
        </div>
      ))}
    </div>
  );
}

const styles = {
    
  panel: {
    position: "absolute",
    top: 40,
    right: 0,
    width: 320,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    zIndex: 1000,
    padding: 10,
 

  },
  header: {
    margin: "6px 10px",
    fontSize: 16,
  },
  empty: {
    padding: 10,
    textAlign: "center",
    color: "#777",
  },
  item: {
    padding: 10,
    borderBottom: "1px solid #eee",
  },
  message: {
    fontSize: 14,
    marginBottom: 8,
  },
  actions: {
    display: "flex",
    gap: 8,
  },
  accept: {
    flex: 1,
    background: "#22c55e",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 8px",
    cursor: "pointer",
  },
  reject: {
    flex: 1,
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "6px 8px",
    cursor: "pointer",
  },
};
