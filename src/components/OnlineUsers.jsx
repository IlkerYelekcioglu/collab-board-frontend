import { useEffect, useState } from "react";
import { useStomp } from "../hooks/useStomp";

export default function OnlineUsers() {
  const { clientRef, connected } = useStomp();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!connected || !clientRef.current) return;

    const subscription = clientRef.current.subscribe(
      "/topic/online-users",
      (message) => {
        const userList = JSON.parse(message.body);
        setUsers(userList);
      },
    );

    return () => subscription.unsubscribe();
  }, [connected, clientRef]);

  if (users.length === 0) return null;

  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: "14px", color: "#666" }}>Çevrimiçi:</span>
      {users.map((user, index) => (
        <span
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            padding: "4px 8px",
            borderRadius: "12px",
            fontSize: "12px",
            fontWeight: "bold",
            color: "white",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "#4caf50",
              borderRadius: "50%",
            }}
          ></span>
          {user}
        </span>
      ))}
    </div>
  );
}
