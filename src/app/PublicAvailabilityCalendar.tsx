"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface AvailabilityEntry {
  date: string;
  available: boolean;
}

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const WEEK_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function isBeforeToday(date: string, todayKey: string) {
  return date < todayKey;
}

export default function PublicAvailabilityCalendar() {
  const today = useMemo(() => new Date(), []);
  const todayKey = dateKey(today.getFullYear(), today.getMonth(), today.getDate());
  const firstAvailableMonth = useMemo(
    () => new Date(today.getFullYear(), today.getMonth(), 1),
    [today]
  );
  const [currentMonth, setCurrentMonth] = useState(firstAvailableMonth);
  const [unavailableDates, setUnavailableDates] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadAvailability = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/availability", { cache: "no-store" });
      const data = (await response.json()) as unknown;

      if (!response.ok || !Array.isArray(data)) {
        throw new Error("No se pudo consultar la disponibilidad.");
      }

      setUnavailableDates(
        new Set(
          data.flatMap((entry) => {
            if (
              entry &&
              typeof entry === "object" &&
              typeof (entry as AvailabilityEntry).date === "string" &&
              (entry as AvailabilityEntry).available === false
            ) {
              return [(entry as AvailabilityEntry).date];
            }

            return [];
          })
        )
      );
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudo consultar la disponibilidad."
      );
      setUnavailableDates(new Set());
      setSelectedDate("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadAvailability();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [loadAvailability]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const mondayOffset = (firstDay + 6) % 7;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: mondayOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [month, year]);

  const selectedLabel = selectedDate
    ? new Intl.DateTimeFormat("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(`${selectedDate}T12:00:00`))
    : "";
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");
  const canContact = Boolean(selectedDate && whatsappNumber);
  const whatsappMessage = `Hola, me gustaría recibir información sobre la disponibilidad de Salón Roma para el ${selectedLabel}.`;
  const previousMonthDisabled =
    year === firstAvailableMonth.getFullYear() && month === firstAvailableMonth.getMonth();

  function moveMonth(direction: number) {
    setCurrentMonth(new Date(year, month + direction, 1));
    setSelectedDate("");
  }

  return (
    <div className="calendar-shell">
      <div className="calendar-main">
        <div className="calendar-heading">
          <button
            type="button"
            onClick={() => moveMonth(-1)}
            aria-label="Mes anterior"
            disabled={previousMonthDisabled}
          >
            ←
          </button>
          <h3>{MONTHS[month]} <span>{year}</span></h3>
          <button type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente">→</button>
        </div>

        <div className="weekday-row">
          {WEEK_DAYS.map((day) => <span key={day}>{day}</span>)}
        </div>

        {loading ? (
          <p className="public-calendar-loading" role="status">Cargando disponibilidad...</p>
        ) : (
          <div className="calendar-grid" aria-live="polite">
            {cells.map((day, index) => {
              if (!day) return <span className="calendar-empty" key={`empty-${index}`} />;

              const date = dateKey(year, month, day);
              const past = isBeforeToday(date, todayKey);
              const occupied = unavailableDates.has(date);
              const disabled = Boolean(error) || past || occupied;
              const status = error
                ? "disponibilidad no disponible"
                : past
                  ? "fecha pasada"
                  : occupied
                    ? "no disponible"
                    : "disponible";

              return (
                <button
                  type="button"
                  key={date}
                  className={`${past ? "past" : ""} ${occupied ? "unavailable" : ""} ${selectedDate === date ? "selected" : ""}`}
                  disabled={disabled}
                  onClick={() => setSelectedDate(date)}
                  aria-label={`${day} de ${MONTHS[month]} de ${year}, ${status}`}
                  aria-pressed={selectedDate === date}
                >
                  {day}
                </button>
              );
            })}
          </div>
        )}

        {error && (
          <div className="public-calendar-error" role="alert">
            <p>No fue posible cargar la disponibilidad. Intenta nuevamente.</p>
            <button type="button" onClick={() => void loadAvailability()}>Reintentar</button>
          </div>
        )}
      </div>

      <aside className="date-summary" aria-live="polite">
        <span className="summary-icon" aria-hidden="true">◇</span>
        {selectedDate ? (
          <>
            <p className="summary-eyebrow">Fecha seleccionada</p>
            <h3>{selectedLabel}</h3>
            <p className="available-label"><span>✓</span> Fecha disponible</p>
          </>
        ) : (
          <>
            <p className="summary-eyebrow">Consulta disponibilidad</p>
            <h3>Selecciona una fecha</h3>
            <p className="summary-copy">Elige un día libre para solicitar información.</p>
          </>
        )}

        <a
          className={`whatsapp-button ${!canContact ? "disabled" : ""}`}
          href={canContact ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}` : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!canContact}
          tabIndex={canContact ? 0 : -1}
        >
          <span aria-hidden="true">◉</span> Consultar por WhatsApp
        </a>

        {!whatsappNumber && (
          <p className="public-calendar-contact-error">WhatsApp no está configurado.</p>
        )}

        <div className="legend">
          <span><i className="legend-free" /> Disponible</span>
          <span><i className="legend-busy" /> No disponible</span>
        </div>
      </aside>
    </div>
  );
}
