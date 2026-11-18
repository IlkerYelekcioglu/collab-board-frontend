import { useEffect, useState } from "react";
import { useStomp } from "../hooks/useStomp";

export default function WebSocketTest() {
  const { clientRef, connected, error } = useStomp();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("Merhaba WebSocket");

  useEffect(() => {
    if (!connected || !clientRef.current) return;

    const subscription = clientRef.current.subscribe("/topic/test", (msg) => {
      setMessages((prev) => [...prev, msg.body]);
    });

    return () => subscription.unsubscribe();
  }, [connected, clientRef]);

  const sendTest = () => {
    if (!clientRef.current || !connected) return;
    clientRef.current.publish({
      destination: "/app/test",
      body: input,
    });
  };

  return (
    <div>
      <h2>WebSocket Test (1. Aşama)</h2>

      <p>
        Bağlantı durumu:{" "}
        <strong style={{ color: connected ? "green" : "crimson" }}>
          {connected ? "✅ Bağlı" : "❌ Bağlı değil"}
        </strong>
      </p>

      {error && <p style={{ color: "crimson" }}>Hata: {error}</p>}

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={sendTest} disabled={!connected}>
          Gönder
        </button>
      </div>

      <h3>Gelen mesajlar</h3>
      {messages.length === 0 ? (
        <p style={{ color: "#888" }}>Henüz mesaj yok. Butona bas ve dene.</p>
      ) : (
        <ul>
          {messages.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
