import React, { useEffect, useRef, useState } from "react";
import Navbar from "./Dashboard/Navbar";
import ConnectionList from "./Dashboard/ConnectionList";
import MessageBox from "./Dashboard/MessageBox";



export default function Dashboard() {
  const wsRef = useRef(null);

  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  // 1️⃣ Create WebSocket connection (ONCE)
  useEffect(() => {
    const socket = new WebSocket("ws://localhost:8080/ws");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");


      const interval = setInterval(() => {
        wsRef.current.send(JSON.stringify({ type: "HEARTBEAT" }));
      }, 15000);


      // Send location if already available
      if (location) {
        socket.send(
          JSON.stringify({
            type: "LOCATION",
            latitude: location.lat,
            longitude: location.lng,
          })
        );
        console.log("Location sent via WS");
      }
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log(data);

        if (data.type === "MESSAGE") {
          console.log("Message from:", data.from, data.message);
          setMessages((prev) => [
            ...prev,
            { from: data.from, text: data.message },
          ]);
        }

        if (data.type === "NEARBY_USERS") {
          console.log("Nearby users:", data.users);
          setNearbyUsers(data.users);
        }
      } catch (e) {
        console.log("Raw message:", event.data);
      }
    };

    socket.onerror = (err) => {
      console.error("WebSocket error", err);
    };

    socket.onclose = () => {
      console.log("WebSocket closed");
      clearInterval(interval);
    };

    return () => socket.close();
  }, []); // 🔥 IMPORTANT: empty dependency

  // 2️⃣ Get user geolocation (ONCE)
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);

        // Send location immediately if WS is open
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: "LOCATION",
              latitude: loc.lat,
              longitude: loc.lng,
            })
          );
          console.log("Location sent via WS");
        }
      },
      (err) => setError(err.message),
      { enableHighAccuracy: true }
    );
  }, []);

  // 3️⃣ Optional: send updated location whenever it changes
  useEffect(() => {
    if (!location || !wsRef.current) return;

    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "LOCATION",
          latitude: location.lat,
          longitude: location.lng,
        })
      );
      console.log("Location updated via WS");
    }
  }, [location]);

  // 4️⃣ Safe send MESSAGE button
  const sendMessage = () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "MESSAGE", message: "Hello nearby users!" })
      );
      console.log("Message sent");
    } else {
      console.warn("WebSocket not connected yet");
    }
  };

  const [hideBox, setHideBox] = useState(true);
  const [recepient, setRecepient] = useState([]);

  const openBox = (user) => {
    console.log(user);
    if (!hideBox) {
      setRecepient(user);
      setHideBox(true);
    }
  };

  return (
    <div>
      <Navbar />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        <div>Left</div>

        <div>
          <ConnectionList nearbyUsers={nearbyUsers} openBox={openBox} />
          <MessageBox hideBox={hideBox} recepient={recepient} />

          <ul>
            {messages.map((msg, index) => (
              <li key={index}>
                <b>{msg.from}</b>: {msg.text}
              </li>
            ))}
          </ul>
        </div>

        <div>Right</div>
      </div>
    </div>
  );
}
