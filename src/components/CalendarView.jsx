import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarView() {
  const [events, setEvents] = useState([
    { title: "Sprint Planlama", date: "2026-11-10" },
    { title: "Kod İncelemesi", date: "2026-11-12" },
  ]);

  const handleDateClick = (arg) => {
    const title = prompt("Etkinlik başlığı girin:");
    if (title) {
      setEvents([...events, { title, date: arg.dateStr }]);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        height: "100%",
        overflowY: "auto",
      }}
    >
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        dateClick={handleDateClick}
        locale="tr"
        height="100%"
      />
    </div>
  );
}
