"use client";

import { useMemo, useState } from "react";

const monthNames = [
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

const weekDays = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const reservedDates = new Set([
  "2026-08-15",
  "2026-08-22",
  "2026-08-29",
  "2026-09-05",
  "2026-09-19",
]);

function dateKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function Calendar() {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(2026, 7, 1));
  const [selected, setSelected] = useState<number | null>(19);
  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const cells = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const mondayOffset = firstDay === 0 ? 6 : firstDay - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return [
      ...Array.from({ length: mondayOffset }, () => null),
      ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
    ];
  }, [year, month]);

  const moveMonth = (direction: number) => {
    setCursor(new Date(year, month + direction, 1));
    setSelected(null);
  };

  const selectedDate = selected ? new Date(year, month, selected) : null;
  const selectedLabel = selectedDate?.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const whatsappMessage = selectedLabel
    ? `Hola, me gustaría recibir información sobre la disponibilidad de Salón Roma para el ${selectedLabel}.`
    : "Hola, me gustaría recibir información sobre Salón Roma.";

  return (
    <div className="calendar-shell">
      <div className="calendar-main">
        <div className="calendar-heading">
          <button type="button" onClick={() => moveMonth(-1)} aria-label="Mes anterior">
            ←
          </button>
          <h3>{monthNames[month]} <span>{year}</span></h3>
          <button type="button" onClick={() => moveMonth(1)} aria-label="Mes siguiente">
            →
          </button>
        </div>

        <div className="weekday-row">
          {weekDays.map((day) => <span key={day}>{day}</span>)}
        </div>

        <div className="calendar-grid">
          {cells.map((day, index) => {
            if (!day) return <span className="calendar-empty" key={`empty-${index}`} />;
            const key = dateKey(year, month, day);
            const unavailable = reservedDates.has(key);
            const active = selected === day;
            const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
            return (
              <button
                type="button"
                key={key}
                className={`${unavailable ? "unavailable" : ""} ${active ? "selected" : ""} ${isToday ? "today" : ""}`}
                disabled={unavailable}
                onClick={() => setSelected(day)}
                aria-label={`${day} de ${monthNames[month]}${unavailable ? ", no disponible" : ", disponible"}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>

      <aside className="date-summary">
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
          className={`whatsapp-button ${!selectedDate ? "disabled" : ""}`}
          href={selectedDate ? `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}` : undefined}
          target="_blank"
          rel="noreferrer"
          aria-disabled={!selectedDate}
        >
          <span aria-hidden="true">◉</span> Consultar por WhatsApp
        </a>

        <div className="legend">
          <span><i className="legend-free" /> Disponible</span>
          <span><i className="legend-busy" /> No disponible</span>
        </div>
      </aside>
    </div>
  );
}

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="Salón Roma, inicio">
          <span className="brand-mark">SR</span>
          <span>SALÓN ROMA</span>
        </a>
        <nav aria-label="Navegación principal">
          <a href="#inicio">Inicio</a>
          <a href="#espacio">El salón</a>
          <a href="#servicios">Servicios</a>
          <a href="#fechas">Fechas</a>
        </nav>
        <a className="header-cta" href="#fechas">Consultar fecha</a>
      </header>

      <section className="hero" id="inicio">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="eyebrow">Celebraciones que permanecen</p>
          <h1>El escenario perfecto para tu historia.</h1>
          <p className="hero-copy">
            Un espacio elegante y versátil para bodas, XV años y momentos que merecen ser inolvidables.
          </p>
          <div className="hero-actions">
            <a className="primary-button" href="#fechas">Ver fechas disponibles</a>
            <a className="text-link" href="#espacio">Conocer el salón <span>→</span></a>
          </div>
        </div>
        <div className="hero-detail">
          <span>Tampico, Tamaulipas</span>
          <span>Hasta 300 invitados</span>
        </div>
      </section>

      <section className="intro section" id="espacio">
        <div>
          <p className="eyebrow">Salón Roma</p>
          <h2>Diseñado para celebrar sin preocupaciones.</h2>
        </div>
        <p>
          Desde la primera visita hasta el último baile, nuestro equipo cuida cada detalle para que disfrutes tu evento con tranquilidad, estilo y calidez.
        </p>
      </section>

      <section className="services section" id="servicios">
        <article>
          <span>01</span>
          <h3>Espacio versátil</h3>
          <p>Montajes personalizados para eventos íntimos o grandes celebraciones.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Atención cercana</h3>
          <p>Acompañamiento para organizar tiempos, proveedores y detalles importantes.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Ubicación accesible</h3>
          <p>Un punto cómodo para tus invitados, con estacionamiento y fácil llegada.</p>
        </article>
      </section>

      <section className="dates-section" id="fechas">
        <div className="dates-intro section">
          <p className="eyebrow">Disponibilidad</p>
          <h2>Encuentra la fecha perfecta</h2>
          <p>Selecciona un día disponible y escríbenos para conocer paquetes, horarios y opciones para tu evento.</p>
        </div>
        <div className="calendar-wrap section">
          <Calendar />
        </div>
      </section>

      <section className="closing section">
        <p className="eyebrow">Tu celebración comienza aquí</p>
        <h2>Hagamos realidad el evento que imaginas.</h2>
        <a className="primary-button dark" href="#fechas">Consultar disponibilidad</a>
      </section>

      <footer>
        <div className="brand footer-brand"><span className="brand-mark">SR</span><span>SALÓN ROMA</span></div>
        <p>Una demostración de calendario para eventos creada por RomaLabs.</p>
        <a href="#inicio">Volver arriba ↑</a>
      </footer>
    </main>
  );
}
