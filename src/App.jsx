import { useState, useEffect } from "react";
import AuthForm from "./features/auth/AuthForm";
import Board from "./components/Board";
import OnlineUsers from "./components/OnlineUsers";
import TimePlanner from "./components/TimePlanner";
import api from "./services/api";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [me, setMe] = useState(null);
  const [activeTab, setActiveTab] = useState("board");

  useEffect(() => {
    if (!token) return;
    api
      .get("/auth/me")
      .then((res) => setMe(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
      });
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMe(null);
  };

  if (!token) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          background: "#f4f5f7",
        }}
      >
        <div
          style={{
            padding: 40,
            background: "white",
            borderRadius: 8,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h1 style={{ textAlign: "center", color: "#0052cc" }}>
            Collab Board
          </h1>
          <AuthForm onLogin={setToken} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", width: "100vw", height: "100vh" }}>
      <div
        style={{
          width: "240px",
          backgroundColor: "#0052cc",
          color: "white",
          display: "flex",
          flexDirection: "column",
          padding: "20px 0",
        }}
      >
        <div
          style={{
            padding: "0 20px",
            marginBottom: "30px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "8px",
              borderRadius: "4px",
              color: "#0052cc",
              fontWeight: "bold",
            }}
          >
            CB
          </div>
          <h2 style={{ margin: 0, fontSize: "18px" }}>Collab Board</h2>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "5px",
            padding: "0 10px",
          }}
        >
          <button
            onClick={() => setActiveTab("board")}
            style={{
              padding: "12px 15px",
              textAlign: "left",
              background:
                activeTab === "board" ? "rgba(255,255,255,0.2)" : "transparent",
              border: "none",
              borderRadius: "4px",
              color: "white",
              fontSize: "14px",
              fontWeight: activeTab === "board" ? "bold" : "normal",
            }}
          >
            📋 Pano
          </button>
          <button
            onClick={() => setActiveTab("planner")}
            style={{
              padding: "12px 15px",
              textAlign: "left",
              background:
                activeTab === "planner"
                  ? "rgba(255,255,255,0.2)"
                  : "transparent",
              border: "none",
              borderRadius: "4px",
              color: "white",
              fontSize: "14px",
              fontWeight: activeTab === "planner" ? "bold" : "normal",
            }}
          >
            📅 Zaman Planlayıcı
          </button>
        </div>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f4f5f7",
        }}
      >
        <div
          style={{
            height: "60px",
            backgroundColor: "white",
            borderBottom: "1px solid #dfe1e6",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            padding: "0 20px",
            gap: "20px",
          }}
        >
          <OnlineUsers />
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontWeight: "bold", color: "#172b4d" }}>
              👤 {me}
            </span>
            <button
              onClick={handleLogout}
              style={{
                padding: "6px 12px",
                border: "1px solid #dfe1e6",
                background: "white",
                borderRadius: "4px",
                color: "#42526e",
              }}
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        <div style={{ flex: 1, overflow: "hidden", backgroundColor: "white" }}>
          {activeTab === "board" ? (
            <Board />
          ) : (
            <div style={{ height: "100%", overflowY: "auto" }}>
              <TimePlanner />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
