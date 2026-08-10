"use client";

import {
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  EVENT_TYPES,
  RESERVATION_STATUSES,
  type CalendarEvent,
} from "@/types/event";

interface ReservationFormProps {
  initialDate?: string;
  eventToEdit?: CalendarEvent | null;
  onClose: () => void;
  onCreated: (event: CalendarEvent) => void;
  onUpdated?: (event: CalendarEvent) => void;
  onDeleted?: (id: string) => void;
}

interface FormState {
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  eventType: string;
  guestCount: string;
  totalPrice: string;
  advancePayment: string;
  reservationStatus: string;
  notes: string;
}

function createInitialForm(
  initialDate: string,
  eventToEdit?: CalendarEvent | null,
): FormState {
  if (eventToEdit) {
    return {
      customerName: eventToEdit.customerName,
      customerPhone: eventToEdit.customerPhone,
      date: eventToEdit.date,
      time: eventToEdit.time,
      eventType: eventToEdit.eventType,
      guestCount: String(eventToEdit.guestCount),
      totalPrice: String(eventToEdit.totalPrice),
      advancePayment: String(eventToEdit.advancePayment),
      reservationStatus: eventToEdit.reservationStatus,
      notes: eventToEdit.notes,
    };
  }

  return {
    customerName: "",
    customerPhone: "",
    date: initialDate,
    time: "",
    eventType: "Boda",
    guestCount: "0",
    totalPrice: "0",
    advancePayment: "0",
    reservationStatus: "Apartada",
    notes: "",
  };
}

export default function ReservationForm({
  initialDate = "",
  eventToEdit = null,
  onClose,
  onCreated,
  onUpdated,
  onDeleted,
}: ReservationFormProps) {
  const [form, setForm] = useState<FormState>(() =>
    createInitialForm(initialDate, eventToEdit)
  );

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const editing = Boolean(eventToEdit);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement |
      HTMLSelectElement |
      HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSaving(true);

    try {
const response = await fetch(
  eventToEdit
    ? `/api/events/${eventToEdit.id}`
    : "/api/events",
  {
    method: eventToEdit ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: form.customerName,
          customerPhone: form.customerPhone,
          date: form.date,
          time: form.time,
          eventType: form.eventType,
          guestCount: Number(form.guestCount),
          totalPrice: Number(form.totalPrice),
          advancePayment: Number(
            form.advancePayment
          ),
          reservationStatus:
            form.reservationStatus,
          notes: form.notes,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ??
          "No se pudo crear la reservación."
        );

        return;
      }

      const savedEvent = data as CalendarEvent;

if (eventToEdit) {
  onUpdated?.(savedEvent);
} else {
  onCreated(savedEvent);
}

onClose();
    } catch {
      setError(
        "No fue posible conectarse con el servidor."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="reservation-modal-backdrop"
      role="presentation"
    >
      <section
        className="reservation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-title"
      >
        <header className="reservation-modal-header">
          <div>
            <p className="admin-small-label">
              Salón Roma
            </p>

            <h2 id="reservation-title">
              Nueva reservación
            </h2>

            <p>
              Registra la información del cliente y
              del evento.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar formulario"
          >
            ×
          </button>
        </header>

        <form
          className="reservation-form"
          onSubmit={handleSubmit}
        >
          <div className="reservation-form-grid">
            <label>
              <span>Nombre del cliente</span>

              <input
                type="text"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                placeholder="María Hernández"
                maxLength={100}
                required
              />
            </label>

            <label>
              <span>Teléfono</span>

              <input
                type="tel"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                placeholder="833 123 4567"
                maxLength={25}
              />
            </label>

            <label>
              <span>Fecha</span>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              <span>Hora</span>

              <input
                type="time"
                name="time"
                value={form.time}
                onChange={handleChange}
              />
            </label>

            <label>
              <span>Tipo de evento</span>

              <select
                name="eventType"
                value={form.eventType}
                onChange={handleChange}
              >
                {EVENT_TYPES.map((type) => (
                  <option
                    key={type}
                    value={type}
                  >
                    {type}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>Número de invitados</span>

              <input
                type="number"
                name="guestCount"
                value={form.guestCount}
                onChange={handleChange}
                min="0"
                max="5000"
                step="1"
                required
              />
            </label>

            <label>
              <span>Precio total</span>

              <input
                type="number"
                name="totalPrice"
                value={form.totalPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </label>

            <label>
              <span>Anticipo recibido</span>

              <input
                type="number"
                name="advancePayment"
                value={form.advancePayment}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </label>

            <label className="reservation-full-field">
              <span>Estado de la fecha</span>

              <select
                name="reservationStatus"
                value={form.reservationStatus}
                onChange={handleChange}
              >
                {RESERVATION_STATUSES.map(
                  (status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="reservation-full-field">
              <span>Notas privadas</span>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                placeholder="Información adicional del evento..."
              />
            </label>
          </div>

          {error && (
            <p
              className="reservation-form-error"
              role="alert"
            >
              {error}
            </p>
          )}

          <div className="reservation-private-notice">
            <span>◇</span>

            <div>
              <strong>
                Información privada
              </strong>

              <p>
                El calendario público únicamente
                mostrará esta fecha como no disponible.
              </p>
            </div>
          </div>

          <footer className="reservation-form-actions">
            <button
              className="reservation-cancel-button"
              type="button"
              onClick={onClose}
            >
              Cancelar
            </button>

            <button
              className="reservation-save-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Guardando..."
                : "Guardar reservación"}
            </button>
          </footer>
        </form>
      </section>
    </div>
  );
}