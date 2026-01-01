import { useEffect, useState, useRef } from "react";
import axios from "../../assets/js/api";

export default function ConnectionList({ openBox }) {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(0);
  const windowRef = useRef(null);

  const CARD_WIDTH = 220;
  const GAP = 16;
  const [visibleCards, setVisibleCards] = useState(3);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/friendship/suggestedUsers", {
          withCredentials: true,
        });
        setUsers(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Adjust visible cards dynamically
  useEffect(() => {
    const handleResize = () => {
      if (!windowRef.current) return;
      const width = windowRef.current.offsetWidth;
      const count = Math.floor(width / (CARD_WIDTH + GAP));
      setVisibleCards(count > 0 ? count : 1);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(users.length - visibleCards, 0);

  const prev = () => setIndex((p) => Math.max(p - 1, 0));
  const next = () => setIndex((p) => Math.min(p + 1, maxIndex));

  if (!users.length) return <div style={styles.empty}>No suggestions right now</div>;

  return (
    <div style={styles.container}>
      {/* LEFT NAV */}
      <button
        onClick={prev}
        disabled={index === 0}
        style={{ ...styles.navBtn, ...(index === 0 && styles.disabledBtn) }}
      >
        ‹
      </button>

      {/* WINDOW */}
      <div style={styles.window} ref={windowRef}>
        <div
          style={{
            ...styles.carousel,
            transform: `translateX(-${index * (CARD_WIDTH + GAP)}px)`,
          }}
        >
          {users.map((user) => (
            <div key={user.id} style={styles.card}>
              <img
                src={
                  user.profileImageUrl
                    ? `http://localhost:8080${user.profileImageUrl}`
                    : "/default-avatar.png"
                }
                alt={user.fullname}
                style={styles.avatar}
              />
              <h4 style={styles.name}>{user.fullname}</h4>
              {user.bio && <p style={styles.bio}>{user.bio}</p>}
              {user.location && <p style={styles.location}>📍 {user.location}</p>}
              <button style={styles.connectBtn} onClick={() => openBox(user)}>
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT NAV */}
      <button
        onClick={next}
        disabled={index === maxIndex}
        style={{ ...styles.navBtn, ...(index === maxIndex && styles.disabledBtn) }}
      >
        ›
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    padding: "10px 0",
  },
  window: {
    overflow: "hidden",
    flex: 1,
  },
  carousel: {
    display: "flex",
    gap: 10,
    transition: "transform 0.4s ease",
  },
  card: {
    width: 220,
    minWidth: 220,
    background: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 10,
    border: "2px solid #4f46e5",
  },
  name: { fontSize: 16, fontWeight: 600, marginBottom: 4 },
  bio: { fontSize: 13, color: "#555", marginBottom: 6 },
  location: { fontSize: 12, color: "#777", marginBottom: 10 },
  connectBtn: {
    marginTop: "auto",
    padding: "8px 16px",
    borderRadius: 20,
    border: "none",
    background: "#4f46e5",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 600,
  },
  navBtn: {
    border: "none",
    background: "transparent",
    fontSize: 34,
    cursor: "pointer",
    padding: "0 12px",
    color: "#4f46e5",
  },
  disabledBtn: { opacity: 0.3, cursor: "not-allowed" },
  empty: { padding: 20, textAlign: "center", color: "#777" },
};
