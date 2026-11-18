import { useState, useEffect } from "react";
import api from "../services/api";

export default function TimePlanner() {
  const [activeDay, setActiveDay] = useState("A");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isAdding, setIsAdding] = useState(false);
  const [timeRange, setTimeRange] = useState("");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  const fetchRoutine = async (day) => {
    try {
      const res = await api.get(`/routine/${day}`);
      setItems(res.data);
      setError("");
    } catch {
      setError("Rutin yüklenirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      try {
        const res = await api.get(`/routine/${activeDay}`);
        if (isMounted) {
          setItems(res.data);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setError("Rutin yüklenirken bir hata oluştu.");
          setLoading(false);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, [activeDay]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!timeRange || !activity) return;
    try {
      await api.post("/routine", {
        dayType: activeDay,
        timeRange,
        activity,
        description,
      });
      setTimeRange("");
      setActivity("");
      setDescription("");
      setIsAdding(false);
      fetchRoutine(activeDay);
    } catch {
      setError("Satır eklenirken hata oluştu.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu planı silmek istediğinize emin misiniz?")) {
      try {
        await api.delete(`/routine/${id}`);
        fetchRoutine(activeDay);
      } catch {
        setError("Silinirken hata oluştu.");
      }
    }
  };

  const changeDay = (day) => {
    setActiveDay(day);
    setLoading(true);
  };

  return (
    <div
      style={{
        padding: "30px",
        maxWidth: "1000px",
        margin: "0 auto",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {/* Üst Başlık ve Sekmeler */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "24px",
            color: "#172b4d",
            fontWeight: "500",
          }}
        >
          ⏱️ Zaman Planlayıcı
        </h1>

        <div
          style={{
            display: "flex",
            background: "#f4f5f7",
            borderRadius: "4px",
            padding: "4px",
          }}
        >
          <button
            onClick={() => changeDay("A")}
            style={{
              padding: "8px 24px",
              background: activeDay === "A" ? "white" : "transparent",
              color: activeDay === "A" ? "#0052cc" : "#5e6c84",
              border: "none",
              borderRadius: "3px",
              fontWeight: "bold",
              boxShadow:
                activeDay === "A" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            🏋️ A Planı
          </button>
          <button
            onClick={() => changeDay("B")}
            style={{
              padding: "8px 24px",
              background: activeDay === "B" ? "white" : "transparent",
              color: activeDay === "B" ? "#0052cc" : "#5e6c84",
              border: "none",
              borderRadius: "3px",
              fontWeight: "bold",
              boxShadow:
                activeDay === "B" ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
              cursor: "pointer",
            }}
          >
            📚 B Planı
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px",
            background: "#ffebe6",
            color: "#bf2600",
            borderRadius: "4px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>
      )}

      {/* Yeni Ekleme Butonu */}
      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setIsAdding(!isAdding)}
          style={{
            padding: "8px 16px",
            background: isAdding ? "#de350b" : "#0052cc",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          {isAdding ? "İptal Et" : "+ Yeni Plan Ekle"}
        </button>
      </div>

      {/* Ekleme Formu */}
      {isAdding && (
        <form
          onSubmit={handleAddItem}
          style={{
            padding: "20px",
            backgroundColor: "#f4f5f7",
            borderRadius: "8px",
            border: "1px solid #dfe1e6",
            marginBottom: "20px",
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <input
            placeholder="Saat (Örn: 09:00 - 11:00)"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #dfe1e6",
              width: "180px",
              fontSize: "14px",
            }}
          />
          <input
            placeholder="Aktivite (Örn: Kodlama)"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            required
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #dfe1e6",
              flex: 1,
              minWidth: "200px",
              fontSize: "14px",
            }}
          />
          <input
            placeholder="Detay / Açıklama"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #dfe1e6",
              flex: 2,
              minWidth: "250px",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              background: "#36b37e",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Kaydet
          </button>
        </form>
      )}

      {/* Plan Kartları */}
      {loading ? (
        <p>Yükleniyor...</p>
      ) : items.length === 0 ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            color: "#5e6c84",
            border: "2px dashed #dfe1e6",
            borderRadius: "8px",
          }}
        >
          Henüz bir plan eklenmemiş. Yukarıdaki butonu kullanarak kendi
          programınızı oluşturun.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "white",
                border: "1px solid #dfe1e6",
                borderRadius: "8px",
                padding: "16px",
                boxShadow: "0 1px 2px rgba(9,30,66,0.08)",
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    backgroundColor: "#e3f2fd",
                    color: "#0052cc",
                    fontSize: "12px",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontWeight: "bold",
                  }}
                >
                  🕒 {item.timeRange}
                </span>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    opacity: 0.5,
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = 1)}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = 0.5)}
                >
                  🗑️
                </button>
              </div>

              <h3
                style={{
                  margin: "0 0 8px 0",
                  fontSize: "16px",
                  color: "#172b4d",
                }}
              >
                {item.activity}
              </h3>

              {item.description && (
                <p
                  style={{
                    margin: 0,
                    fontSize: "13px",
                    color: "#5e6c84",
                    lineHeight: "1.4",
                  }}
                >
                  {item.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
