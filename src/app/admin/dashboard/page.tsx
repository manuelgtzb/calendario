"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import ReservationForm from "./ReservationForm";
import AdminCalendar from "./AdminCalendar";

import type {
  CalendarEvent,
} from "@/types/event";

type Section =
  | "calendar"
  | "reservations";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(
    new Date(`${date}T12:00:00`)
  );
}

function formatMoney(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(amount);
}

export default function AdminDashboardPage() {
  const [section, setSection] =
    useState<Section>("calendar");

  const [events, setEvents] =
    useState<CalendarEvent[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [selectedDate, setSelectedDate] =
  useState("");  

  const [loggingOut, setLoggingOut] =
    useState(false);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        "/api/events",
        {
          cache: "no-store",
        }
      );

      if (response.status === 401) {
        window.location.href = "/admin";
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ??
          "No se pudieron cargar las reservaciones."
        );
      }

      setEvents(data as CalendarEvent[]);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "No se pudieron cargar las reservaciones."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const statistics = useMemo(() => {
    return {
      upcoming: events.length,

      reserved: events.filter(
        (event) =>
          event.reservationStatus === "Apartada"
      ).length,

      paid: events.filter(
        (event) =>
          event.paymentStatus === "Pagado"
      ).length,
    };
  }, [events]);

function openReservationForm(date = "") {
  setSelectedDate(date);
  setShowForm(true);
}

function closeReservationForm() {
  setShowForm(false);
  setSelectedDate("");
}

  function handleCreated(
    event: CalendarEvent
  ) {
    setEvents((current) =>
      [...current, event].sort((a, b) =>
        `${a.date}T${a.time}`.localeCompare(
          `${b.date}T${b.time}`
        )
      )
    );
  }

  async function logout() {
    setLoggingOut(true);

    await fetch("/api/auth/logout", {
      method: "POST",
    });

    window.location.href = "/admin";
  }

  return (
    <main className="admin-dashboard">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <span className="admin-sidebar-logo">
            SR
          </span>

          <div>
            <strong>SALÓN ROMA</strong>
            <small>Administración</small>
          </div>
        </div>

        <nav className="admin-navigation">
          <button
            className={
              section === "calendar"
                ? "active"
                : ""
            }
            onClick={() =>
              setSection("calendar")
            }
          >
            <span>□</span>
            Calendario
          </button>

          <button
            className={
              section === "reservations"
                ? "active"
                : ""
            }
            onClick={() =>
              setSection("reservations")
            }
          >
            <span>◇</span>
            Reservaciones
          </button>
        </nav>

        <button
          className="admin-logout"
          type="button"
          onClick={logout}
          disabled={loggingOut}
        >
          <span>↪</span>

          {loggingOut
            ? "Cerrando..."
            : "Cerrar sesión"}
        </button>
      </aside>

      <section className="admin-dashboard-content">
        <header className="admin-dashboard-header">
          <div>
            <p className="admin-small-label">
              Panel administrativo
            </p>

            <h1>
              {section === "calendar"
                ? "Calendario de reservaciones"
                : "Reservaciones"}
            </h1>

            <p>
              {section === "calendar"
                ? "Administra la disponibilidad y los próximos eventos."
                : "Consulta los clientes y pagos registrados."}
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              className="admin-new-reservation"
              type="button"
              onClick={() => openReservationForm()}
            >
              <span>＋</span>
              Nueva reservación
            </button>

            <div className="admin-user-chip">
              <span>A</span>
              Administrador
            </div>
          </div>
        </header>

        <section className="admin-statistics">
          <article>
            <span className="admin-stat-icon wine">
              □
            </span>

            <div>
              <p>Próximos eventos</p>
              <strong>
                {statistics.upcoming}
              </strong>
            </div>
          </article>

          <article>
            <span className="admin-stat-icon gold">
              ◇
            </span>

            <div>
              <p>Apartados</p>
              <strong>
                {statistics.reserved}
              </strong>
            </div>
          </article>

          <article>
            <span className="admin-stat-icon green">
              ✓
            </span>

            <div>
              <p>Pagados</p>
              <strong>
                {statistics.paid}
              </strong>
            </div>
          </article>
        </section>

        {error && (
          <p className="admin-data-error">
            {error}

            <button
              type="button"
              onClick={loadEvents}
            >
              Reintentar
            </button>
          </p>
        )}

        {section === "calendar" ? (
  loading ? (
    <p className="admin-empty-message">
      Cargando calendario...
    </p>
  ) : (
    <AdminCalendar
      events={events}
      onSelectDate={openReservationForm}
    />
  )
) : (
          <section className="admin-reservations-panel">
            <header>
              <div>
                <h2>
                  Reservaciones registradas
                </h2>

                <p>
                  Información privada de clientes
                  y eventos.
                </p>
              </div>

              <span>
                {events.length} registros
              </span>
            </header>

            {loading ? (
              <p className="admin-empty-message">
                Cargando reservaciones...
              </p>
            ) : events.length === 0 ? (
              <div className="admin-empty-state">
                <span>◇</span>

                <h3>
                  Todavía no hay reservaciones
                </h3>

                <p>
                  Crea la primera reservación para
                  comenzar.
                </p>

                <button
                  className="admin-new-reservation"
                  type="button"
                  onClick={() => openReservationForm()}
                >
                  ＋ Nueva reservación
                </button>
              </div>
            ) : (
              <div className="admin-table-wrapper">
                <table className="admin-events-table">
                  <thead>
                    <tr>
                      <th>Fecha</th>
                      <th>Cliente</th>
                      <th>Evento</th>
                      <th>Estado</th>
                      <th>Pago</th>
                      <th>Total</th>
                    </tr>
                  </thead>

                  <tbody>
                    {events.map((event) => (
                      <tr key={event.id}>
                        <td>
                          <strong>
                            {formatDate(
                              event.date
                            )}
                          </strong>

                          <small>
                            {event.time ||
                              "Sin hora"}
                          </small>
                        </td>

                        <td>
                          <strong>
                            {event.customerName}
                          </strong>

                          <small>
                            {event.customerPhone ||
                              "Sin teléfono"}
                          </small>
                        </td>

                        <td>
                          {event.eventType}
                        </td>

                        <td>
                          <span
                            className={`reservation-status ${event.reservationStatus.toLowerCase()}`}
                          >
                            {
                              event.reservationStatus
                            }
                          </span>
                        </td>

                        <td>
                          <span
                            className={`payment-status ${event.paymentStatus.toLowerCase()}`}
                          >
                            {event.paymentStatus}
                          </span>
                        </td>

                        <td>
                          {formatMoney(
                            event.totalPrice
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </section>

      {showForm && (
  <ReservationForm
    initialDate={selectedDate}
    onClose={closeReservationForm}
    onCreated={handleCreated}
  />
)}
    </main>
  );
}