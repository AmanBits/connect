import React, { useState } from "react";
import NotificationPanel from "./NotificationPanel";

export default function NotificationBell({
  notifications,
  unreadCount,
  onOpenNotifications,
  acceptRequest
}) {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);

    if (next && unreadCount > 0) {
      onOpenNotifications(); // mark all read
    }
  };

  return (
    <div style={styles.wrapper}>
      <button style={styles.bell} onClick={toggle}>
        🔔
        {unreadCount > 0 && (
          <span style={styles.badge}>{unreadCount}</span>
        )}
      </button>

      {open && <NotificationPanel notifications={notifications} acceptRequest={acceptRequest}/>}
    </div>
  );
}

const styles = {
  wrapper: { position: "relative" },
  bell: {
    fontSize: 22,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    background: "#ef4444",
    color: "#fff",
    fontSize: 12,
    borderRadius: "50%",
    padding: "2px 6px",
  },
};
