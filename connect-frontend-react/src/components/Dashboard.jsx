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
  const [incomingFriendshipRequests, setIncomingFriendshipRequests] = useState(
    []
  );

  const [hideBox, setHideBox] = useState(true);
  const [recepient, setRecepient] = useState(null);

  const [friendList, setfriendList] = useState([]);

  const isMobile = window.innerWidth < 768;

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
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  }, []);

  useEffect(() => {
    const friendList = async () => {
      try {
        const res = await axios.get("/friendship/friendList", {
          withCredentials: true,
        });
        
        console.log(res.data)
        setfriendList(res.data);
      } catch (error) {
        console.log("Error in friend list " + error);
      }
    };

    friendList();
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      const res = await axios.get("/friendship/incomingFriendshipRequest", {
        withCredentials: true,
      });
      console.log(res.data);
      setIncomingFriendshipRequests(res.data);
    };
    fetchRequests();
  }, []);

  const openBox = async (user) => {
    await axios.post(
      "/friendship/sendFriendRequest",
      { id: user.id },
      { withCredentials: true }
    );
    setRecepient(user);
    setHideBox(false);
  };

  const acceptRequest = async (id) => {
    console.log(id);
    await axios.post(
      "/friendship/acceptFriendRequest",
      { requestId: id },
      { withCredentials: true }
    );
  };

  const rejectRequest = async (id) => {
    await axios.post(
      "/friendship/rejectFriendRequest",
      { requestId: id },
      { withCredentials: true }
    );
  };

  return (
    <div>
      <Navbar />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div>
       
<Link to="/profile">Go to Profile</Link>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          gap: 16,
          padding: 16,
        }}
      >
        <div style={{ flex: 1 }}>
          <h4>Friend List</h4>
          {friendList != [] ? (
            friendList.map((item, index) => {
              return <div>
                  <img
                src={
                  item.profileImageUrl
                    ? `http://localhost:8080${item.profileImageUrl}`
                    : "/default-avatar.png"
                }
                alt={item.fullname}
                style={styles.avatar}
              />
              <p>{item.fullname}</p>
              </div>
            })
          ) : (
            <span>no friends</span>
          )}
        </div>

        <div style={{ flex: 2, minWidth: 0 }}>
          <ConnectionList nearbyUsers={nearbyUsers} openBox={openBox} />
          <MessageBox hideBox={hideBox} recepient={recepient} />

          <ul>
            {messages.map((msg, i) => (
              <li key={i}>
                <b>{msg.from}</b>: {msg.text}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            flex: 1,
            minWidth: 0,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 12,
          }}
        >
          <h4>Friend Requests</h4>
          {incomingFriendshipRequests.map((req) => (
            <div
              key={req.id}
              style={{
                marginBottom: 12,
                wordBreak: "break-all",
              }}
            >
                   <img
                src={
                  req.requesterProfileImage
                    ? `http://localhost:8080${req.requesterProfileImage}`
                    : "/default-avatar.png"
                }
                alt={req.requesterFullname}
                style={styles.avatar}
              />
              <div>{req.requesterFullname}</div>
              <div style={{ marginTop: 6 }}>
                <button onClick={() => acceptRequest(req.requestId)}>Accept</button>
                <button
                  style={{ marginLeft: 8 }}
                  onClick={() => rejectRequest(req.requestId)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


const styles = {
 avatar: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: 10,
    border: "2px solid #4f46e5",
  }

}