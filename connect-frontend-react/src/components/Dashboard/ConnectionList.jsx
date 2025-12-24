import { useState } from "react";
import "../../assets/css/dashboard/profileCarousel.css";

const users = [
  {
    name: "John",
    area: "New York",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    name: "Emma",
    area: "London",
    img: "https://randomuser.me/api/portraits/women/2.jpg",
  },
  {
    name: "Mike",
    area: "Paris",
    img: "https://randomuser.me/api/portraits/men/3.jpg",
  },
  {
    name: "Sophia",
    area: "Berlin",
    img: "https://randomuser.me/api/portraits/women/4.jpg",
  },
  {
    name: "David",
    area: "Tokyo",
    img: "https://randomuser.me/api/portraits/men/5.jpg",
  },
  {
    name: "Olivia",
    area: "Rome",
    img: "https://randomuser.me/api/portraits/women/6.jpg",
  },
  {
    name: "James",
    area: "Sydney",
    img: "https://randomuser.me/api/portraits/men/7.jpg",
  },
];

export default function ConnectionList({nearbyUsers,openBox}) {
  const CARD_WIDTH = 220; // px (MUST match CSS)
  const VISIBLE = 5;
  const CENTER = Math.floor(VISIBLE / 2);

  const [index, setIndex] = useState(CENTER);

  const min = CENTER;
  const max = users.length - CENTER - 1;

  const prev = () => {
    if (index > min) setIndex(index - 1);
  };

  const next = () => {
    if (index < max) setIndex(index + 1);
  };

  return (
    <div className="carousel-container">
      <button className="nav-btn prev" onClick={prev}>
        ‹
      </button>

      <div className="carousel-window">
        <span>Connected People : Around you in </span><select name="size">
          <option value="2">2KM</option>
          <option value="2">4KM</option>
          <option value="2">6KM</option>
          <option value="2">8KM</option>
          <option value="2">10KM</option>
          <option value="2">12KM</option>
          <option value="2">14KM</option>
          <option value="2">16KM</option>
          <option value="2">18KM</option>
          <option value="2">20KM</option>
          <option value="2">30KM</option>
        </select>
        <div
          className="carousel"
          style={{
            transform: `translateX(-${(index - CENTER) * CARD_WIDTH}px)`,
          }}
        >
          {nearbyUsers.map((user, i) => {
            const distance = Math.abs(i - index);

            return (
              <div
                key={i}
                className={`profile ${i === index ? "active" : ""}`}
                style={{
                  opacity: distance > 2 ? 0.3 : 0.6,
                  transform: `scale(${i === index ? 1 : 0.85})`,
                }}
               
              >
                {/* <img src={user.img} alt={user} /> */}
                <h3>{user}</h3>
                <button  onClick={(e)=>openBox(user)}>Connect</button>
                {/* <p>{user.area}</p> */}
              </div>
            );
          })}
        </div>
      </div>

      <button className="nav-btn next" onClick={next}>
        ›
      </button>
    </div>
  );
}
