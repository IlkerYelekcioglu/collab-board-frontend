import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Card from "./Card";
import api from "../services/api";

export default function Column({ column }) {
  const { setNodeRef } = useDroppable({ id: column.id });
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDate, setNewCardDate] = useState("");

  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    try {
      await api.post(`/board/column/${column.id}/card`, {
        title: newCardTitle,
        dueDate: newCardDate,
      });
      setNewCardTitle("");
      setNewCardDate("");
      setIsAdding(false);
    } catch (error) {
      console.error("Kart eklenemedi", error);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: "#f4f5f7",
        borderRadius: "8px",
        padding: "12px",
        minWidth: "280px",
        width: "280px",
        maxHeight: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "12px",
          padding: "0 4px",
        }}
      >
        <h3
          style={{
            margin: 0,
            fontSize: "13px",
            fontWeight: "bold",
            color: "#5e6c84",
            textTransform: "uppercase",
          }}
        >
          {column.title}
        </h3>
        <span
          style={{
            fontSize: "12px",
            color: "#5e6c84",
            background: "#dfe1e6",
            padding: "2px 6px",
            borderRadius: "10px",
          }}
        >
          {column.cards.length}
        </span>
      </div>

      <div style={{ overflowY: "auto", flex: 1, paddingBottom: "8px" }}>
        <SortableContext
          items={column.cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {column.cards.map((card) => (
            <Card key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      <div style={{ marginTop: "auto", paddingTop: "10px" }}>
        {isAdding ? (
          <form
            onSubmit={handleAddCard}
            style={{ display: "flex", flexDirection: "column", gap: "8px" }}
          >
            <input
              autoFocus
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              placeholder="Kart başlığı..."
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #dfe1e6",
                fontSize: "14px",
              }}
            />
            <input
              type="date"
              value={newCardDate}
              onChange={(e) => setNewCardDate(e.target.value)}
              style={{
                padding: "8px",
                borderRadius: "4px",
                border: "1px solid #dfe1e6",
                fontSize: "14px",
              }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="submit"
                style={{
                  padding: "6px 12px",
                  background: "#0052cc",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                }}
              >
                Ekle
              </button>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                style={{
                  padding: "6px 12px",
                  background: "transparent",
                  border: "none",
                  color: "#5e6c84",
                }}
              >
                İptal
              </button>
            </div>
          </form>
        ) : (
          <button
            onClick={() => setIsAdding(true)}
            style={{
              width: "100%",
              padding: "8px",
              background: "transparent",
              border: "none",
              textAlign: "left",
              color: "#5e6c84",
              fontWeight: "bold",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#ebecf0")}
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            + Kart Ekle
          </button>
        )}
      </div>
    </div>
  );
}
