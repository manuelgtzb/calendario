"use client";

import { useMemo, useState } from "react";
import type { CalendarEvent } from "@/types/event";

interface AdminCalendarProps {
  events: CalendarEvent[];
  onSelectDate: (date: string) => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const WEEK_DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

function formatDateKey(year: number, month: number, day: number) {
  const formattedMonth = String(month + 1).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  return `${year}-${formattedMonth}-${formattedDay}`;
}

export default function AdminCalendar({
  events,
  onSelectDate,
  onSelectEvent,
}: AdminCalendarProps) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Convierte domingo = 0 al final de la semana.
    const emptyDaysBefore = (firstDay + 6) % 7;

    return [
      ...Array.from({ length: emptyDaysBefore }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [year, month]);

  function previousMonth() {
    setCurrentMonth(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setCurrentMonth(new Date(year, month + 1, 1));
  }

  function goToToday() {
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  function getEventForDay(day: number) {
    const date = formatDateKey(year, month, day);

    return events.find((event) => event.date === date);
  }

  return (
    <section className="admin-calendar">
      <div className="admin-calendar-header">
        <div className="calendar-navigation">
          <button
            type="button"
            className="calendar-arrow"
            onClick={previousMonth}
            aria-label="Mes anterior"
          >
            ←
          </button>

          <h2>
            {MONTHS[month]} {year}
          </h2>

          <button
            type="button"
            className="calendar-arrow"
            onClick={nextMonth}
            aria-label="Mes siguiente"
          >
            →
          </button>
        </div>

        <button
          type="button"
          className="calendar-today-button"
          onClick={goToToday}
        >
          Hoy
        </button>
      </div>

      <div className="admin-calendar-weekdays">
        {WEEK_DAYS.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="admin-calendar-grid">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                className="admin-calendar-day empty"
              />
            );
          }

          const date = formatDateKey(year, month, day);
          const event = getEventForDay(day);

          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();

          const statusClass = event
            ? event.reservationStatus.toLowerCase()
            : "";

          return (
            <button
              key={date}
              type="button"
              className={`admin-calendar-day ${
                isToday ? "today" : ""
              } ${event ? "occupied" : ""}`}
              onClick={() =>
                event
                  ? onSelectEvent(event)
                  : onSelectDate(date)
              }
            >
              <span className="calendar-day-number">{day}</span>

              {event && (
                <div className={`calendar-event ${statusClass}`}>
                  <strong>{event.eventType}</strong>

                  {event.reservationStatus !== "Bloqueada" && (
                    <span>{event.customerName}</span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      <div className="admin-calendar-legend">
        <span>
          <i className="legend-dot apartada" />
          Apartada
        </span>

        <span>
          <i className="legend-dot confirmada" />
          Confirmada
        </span>

        <span>
          <i className="legend-dot bloqueada" />
          Bloqueada
        </span>
      </div>
    </section>
  );
}
