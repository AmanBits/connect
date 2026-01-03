import React from "react";
import NotificationBell from "./NotificationBell";
import FriendRequestButton from "./FriendRequestButton";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <span className="navbar-brand mb-0 h1">Connect</span>
          
          <Link
            to="/profile"
            style={styles.profileBtn}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <span style={styles.profileIcon}>👤</span> My Profile
          </Link>
          <FriendRequestButton />
          <NotificationBell />
        </div>
      </nav>
    </>
  );
}

const styles = {
  profileBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    padding: "10px 18px",
    borderRadius: 12,
    background: "#4f46e5",
    color: "#fff",
    fontWeight: 600,
    textDecoration: "none",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(79,70,229,0.3)",
    transition: "all 0.2s ease",
  },
  profileIcon: {
    fontSize: 18,
  },
};
