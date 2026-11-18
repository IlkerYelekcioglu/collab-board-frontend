import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function Card({ card }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    backgroundColor: "white",
    padding: "12px",
    borderRadius: "8px",
    boxShadow: isDragging
      ? "0 5px 15px rgba(0,0,0,0.2)"
      : "0 1px 2px rgba(9,30,66,0.25)",
    cursor: "grab",
    opacity: isDragging ? 0.9 : 1,
    userSelect: "none",
    marginBottom: "8px",
    border: "1px solid #dfe1e6",
  };

  const badgeColors = ["#e3f2fd", "#ffebe6", "#e3fcef", "#fff0b3"];
  const textColors = ["#0052cc", "#bf2600", "#006644", "#172b4d"];
  const randomIndex = card.id % 4;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <p
        style={{
          margin: "0 0 10px 0",
          fontSize: "14px",
          fontWeight: "500",
          color: "#172b4d",
          lineHeight: "1.4",
        }}
      >
        {card.title}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ display: "flex", gap: "5px" }}>
          <span
            style={{
              backgroundColor: badgeColors[randomIndex],
              color: textColors[randomIndex],
              padding: "2px 6px",
              borderRadius: "3px",
              fontSize: "11px",
              fontWeight: "bold",
            }}
          >
            GÖREV-{card.id}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              color: card.dueDate ? "#de350b" : "#5e6c84",
              fontWeight: card.dueDate ? "bold" : "normal",
            }}
          >
            {card.dueDate ? `📅 ${card.dueDate}` : "Tarih yok"}
          </span>
          <div
            style={{
              width: "24px",
              height: "24px",
              borderRadius: "50%",
              backgroundColor: "#dfe1e6",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "12px",
            }}
          >
            👤
          </div>
        </div>
      </div>
    </div>
  );
}
