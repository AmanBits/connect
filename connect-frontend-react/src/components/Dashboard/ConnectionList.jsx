import { useEffect, useState } from "react";
import "../../assets/css/dashboard/profileCarousel.css";
import axios from "../../assets/js/api";

export default function ConnectionList({ openBox }) {
  const [users, setUsers] = useState([]); // ✅ must be array
  const [index, setIndex] = useState(0);

  const CARD_WIDTH = 220; // MUST match CSS
  const VISIBLE = 5;
  const CENTER = Math.floor(VISIBLE / 2);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/my/users");
        setUsers(res?.data?.data || []);
        setIndex(CENTER); // reset index after data load
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  if (users.length === 0) {
    return <div className="carousel-container">No users found</div>;
  }

  const min = CENTER;
  const max = users.length - CENTER - 1;

  const prev = () => {
    if (index > min) setIndex((prev) => prev - 1);
  };

  const next = () => {
    if (index < max) setIndex((prev) => prev + 1);
  };

  return (
    <div className="carousel-container">
      <button className="nav-btn prev" onClick={prev} disabled={index <= min}>
        ‹
      </button>

      <div className="carousel-window">
        <div className="carousel-header">
          <span>Connected People : Around you in </span>
          <select>
            {[2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 30].map((km) => (
              <option key={km} value={km}>
                {km} KM
              </option>
            ))}
          </select>
        </div>

        <div
          className="carousel"
          style={{
            transform: `translateX(-${(index - CENTER) * CARD_WIDTH}px)`,
          }}
        >
          {users.map((user, i) => {
            const distance = Math.abs(i - index);

            return (
              <div
                key={user.id || i}
                className={`profile ${i === index ? "active" : ""}`}
                style={{
                  opacity: distance > 2 ? 0.3 : 0.6,
                  transform: `scale(${i === index ? 1 : 0.85})`,
                }}
              >
                <h3>{user.name}</h3>
                <button onClick={() => openBox(user)}>Connect</button>
              </div>
            );
          })}
        </div>
      </div>

      <button className="nav-btn next" onClick={next} disabled={index >= max}>
        ›
      </button>
    </div>
  );
}
