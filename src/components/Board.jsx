import { useEffect, useState } from "react";
import { fetchBoard } from "../services/boardApi";
import { useStomp } from "../hooks/useStomp";
import api from "../services/api";

export default function Board() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const { clientRef, connected } = useStomp();

  useEffect(() => {
    let isMounted = true;

    const loadInitialBoard = async () => {
      try {
        const data = await fetchBoard();
        if (isMounted) {
          setColumns(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Pano yüklenemedi:", err);
        if (isMounted) setLoading(false);
      }
    };

    loadInitialBoard();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!connected || !clientRef.current) return;

    const subscription = clientRef.current.subscribe(
      "/topic/board",
      async () => {
        try {
          const data = await fetchBoard();
          setColumns(data);
        } catch (err) {
          console.error("WebSocket güncellemesi başarısız:", err);
        }
      },
    );

    return () => subscription.unsubscribe();
  }, [connected, clientRef]);

  const handleAddCard = async (columnId, title) => {
    if (!title.trim()) return;
    try {
      await api.post(`/board/column/${columnId}/card`, { title: title });
    } catch (error) {
      console.error("Kart eklenemedi", error);
    }
  };

  if (loading)
    return (
      <p style={{ padding: "20px", fontSize: "16px", color: "#172b4d" }}>
        Pano yükleniyor...
      </p>
    );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "20px",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="🔍 Ara..."
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: "1px solid #dfe1e6",
              width: "250px",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <span
            style={{
              fontSize: "13px",
              color: connected ? "#006644" : "#de350b",
              fontWeight: "bold",
            }}
          >
            {connected ? "🟢 Canlı Bağlantı" : "🔴 Bağlantı Kesildi"}
          </span>
          <button
            style={{
              padding: "8px 16px",
              background: "#e3f2fd",
              color: "#0052cc",
              border: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            ☰ Grupla: Sprint
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          padding: "12px 16px",
          backgroundColor: "#f4f5f7",
          borderTop: "1px solid #dfe1e6",
          borderBottom: "1px solid #dfe1e6",
          fontSize: "12px",
          fontWeight: "bold",
          color: "#5e6c84",
        }}
      >
        <div style={{ flex: 3 }}>Özet (Summary)</div>
        <div style={{ flex: 1 }}>Durum (Status)</div>
        <div style={{ flex: 1 }}>Atanan (Assignee)</div>
        <div style={{ flex: 1 }}>Kategori</div>
      </div>

      {/* Sprint Grupları */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          marginTop: "20px",
          overflowY: "auto",
        }}
      >
        {columns.map((column) => (
          <SprintGroup
            key={column.id}
            column={column}
            onAddCard={handleAddCard}
          />
        ))}
      </div>
    </div>
  );
}

function SprintGroup({ column, onAddCard }) {
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const submitCard = (e) => {
    e.preventDefault();
    onAddCard(column.id, newCardTitle);
    setNewCardTitle("");
    setIsAdding(false);
  };

  return (
    <div
      style={{
        border: "1px solid #dfe1e6",
        borderRadius: "8px",
        backgroundColor: "#fafbfc",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          borderBottom: "1px solid #dfe1e6",
        }}
      >
        <span style={{ fontSize: "16px" }}>📱</span>
        <h2
          style={{
            margin: 0,
            fontSize: "16px",
            color: "#172b4d",
            fontWeight: "600",
          }}
        >
          {column.title}
        </h2>
        <span
          style={{
            backgroundColor: "#dfe1e6",
            color: "#172b4d",
            padding: "2px 8px",
            borderRadius: "10px",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {column.cards.length}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        {column.cards.map((card) => (
          <div
            key={card.id}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              borderBottom: "1px solid #dfe1e6",
              backgroundColor: "white",
            }}
          >
            <div
              style={{
                flex: 3,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input type="checkbox" style={{ cursor: "pointer" }} />
              <span
                style={{ fontSize: "13px", color: "#5e6c84", width: "70px" }}
              >
                GÖREV-{card.id}
              </span>
              <span
                style={{
                  fontSize: "14px",
                  color: "#172b4d",
                  fontWeight: "500",
                }}
              >
                {card.title}
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "bold",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  backgroundColor: column.title.toLowerCase().includes("tamam")
                    ? "#e3fcef"
                    : column.title.toLowerCase().includes("devam")
                      ? "#deebff"
                      : "#f4f5f7",
                  color: column.title.toLowerCase().includes("tamam")
                    ? "#006644"
                    : column.title.toLowerCase().includes("devam")
                      ? "#0052cc"
                      : "#42526e",
                }}
              >
                {column.title.toUpperCase()}
              </span>
            </div>

            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  backgroundColor: "#0052cc",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "10px",
                  fontWeight: "bold",
                }}
              >
                U
              </div>
              <span style={{ fontSize: "13px", color: "#172b4d" }}>
                Kullanıcı
              </span>
            </div>

            <div style={{ flex: 1 }}>
              <span
                style={{
                  fontSize: "11px",
                  backgroundColor: "#fffae6",
                  color: "#bf2600",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontWeight: "bold",
                }}
              >
                Genel
              </span>
            </div>
          </div>
        ))}

        <div style={{ padding: "12px 16px", backgroundColor: "white" }}>
          {isAdding ? (
            <form
              onSubmit={submitCard}
              style={{ display: "flex", gap: "10px" }}
            >
              <input
                autoFocus
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                placeholder="Görev özeti girin..."
                style={{
                  flex: 1,
                  padding: "8px",
                  border: "1px solid #0052cc",
                  borderRadius: "4px",
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "8px 16px",
                  background: "#0052cc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#5e6c84",
                }}
              >
                İptal
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#5e6c84",
                cursor: "pointer",
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                padding: 0,
              }}
            >
              + Görev Ekle
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
