import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

export function useStomp() {
  const clientRef = useRef(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const host = window.location.host;
    const brokerURL = `${protocol}//${host}/ws`;

    const client = new Client({
      brokerURL: brokerURL,
      reconnectDelay: 5000,
      connectHeaders: { Authorization: `Bearer ${token}` },
      onConnect: () => setConnected(true),
      onDisconnect: () => setConnected(false),
    });

    client.activate();
    clientRef.current = client;
    return () => {
      client.deactivate();
      clientRef.current = null;
    };
  }, []);

  return { clientRef, connected };
}
