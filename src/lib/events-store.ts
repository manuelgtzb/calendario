import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

import {
  EVENT_TYPES,
  RESERVATION_STATUSES,
  type CalendarEvent,
  type EventInput,
  type EventType,
  type PaymentStatus,
  type ReservationStatus,
} from "@/types/event";

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "events.json");

let writeQueue: Promise<void> = Promise.resolve();

async function readEvents(): Promise<CalendarEvent[]> {
  await mkdir(dataDirectory, { recursive: true });

  try {
    const content = await readFile(dataFile, "utf8");
    return JSON.parse(content) as CalendarEvent[];
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await writeFile(dataFile, "[]", "utf8");
      return [];
    }

    throw error;
  }
}

async function saveEvents(events: CalendarEvent[]) {
  await writeFile(
    dataFile,
    `${JSON.stringify(events, null, 2)}\n`,
    "utf8"
  );
}

function withWriteLock<T>(
  operation: () => Promise<T>
): Promise<T> {
  const result = writeQueue.then(operation, operation);

  writeQueue = result.then(
    () => undefined,
    () => undefined
  );

  return result;
}

function isValidDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function calculatePaymentStatus(
  totalPrice: number,
  advancePayment: number
): PaymentStatus {
  if (totalPrice > 0 && advancePayment >= totalPrice) {
    return "Pagado";
  }

  if (advancePayment > 0) {
    return "Anticipo";
  }

  return "Pendiente";
}

export function validateEventInput(
  value: unknown
): EventInput {
  if (!value || typeof value !== "object") {
    throw new Error(
      "Los datos de la reservación no son válidos."
    );
  }

  const input = value as Record<string, unknown>;

  const customerName =
    typeof input.customerName === "string"
      ? input.customerName.trim()
      : "";

  const customerPhone =
    typeof input.customerPhone === "string"
      ? input.customerPhone.trim()
      : "";

  const date =
    typeof input.date === "string"
      ? input.date
      : "";

  const time =
    typeof input.time === "string"
      ? input.time
      : "";

  const eventType = input.eventType as EventType;

  const reservationStatus =
    input.reservationStatus as ReservationStatus;

  const guestCount = Number(input.guestCount);
  const totalPrice = Number(input.totalPrice);
  const advancePayment = Number(input.advancePayment);

  const notes =
    typeof input.notes === "string"
      ? input.notes.trim()
      : "";

  if (
    customerName.length < 2 ||
    customerName.length > 100
  ) {
    throw new Error(
      "El nombre del cliente debe tener entre 2 y 100 caracteres."
    );
  }

  if (customerPhone.length > 25) {
    throw new Error(
      "El teléfono no puede superar 25 caracteres."
    );
  }

  if (
    customerPhone &&
    !/^[+\d\s()-]+$/.test(customerPhone)
  ) {
    throw new Error(
      "El teléfono contiene caracteres no válidos."
    );
  }

  if (!isValidDate(date)) {
    throw new Error("La fecha no es válida.");
  }

  if (
    time &&
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  ) {
    throw new Error("La hora no es válida.");
  }

  if (!EVENT_TYPES.includes(eventType)) {
    throw new Error("El tipo de evento no es válido.");
  }

  if (
    !RESERVATION_STATUSES.includes(reservationStatus)
  ) {
    throw new Error(
      "El estado de la reservación no es válido."
    );
  }

  if (
    !Number.isInteger(guestCount) ||
    guestCount < 0 ||
    guestCount > 5000
  ) {
    throw new Error(
      "La cantidad de invitados no es válida."
    );
  }

  if (
    !Number.isFinite(totalPrice) ||
    totalPrice < 0
  ) {
    throw new Error(
      "El precio total no es válido."
    );
  }

  if (
    !Number.isFinite(advancePayment) ||
    advancePayment < 0
  ) {
    throw new Error(
      "El anticipo no es válido."
    );
  }

  if (advancePayment > totalPrice) {
    throw new Error(
      "El anticipo no puede ser mayor al precio total."
    );
  }

  if (notes.length > 1000) {
    throw new Error(
      "Las notas no pueden superar 1000 caracteres."
    );
  }

  return {
    customerName,
    customerPhone,
    date,
    time,
    eventType,
    guestCount,
    totalPrice,
    advancePayment,
    reservationStatus,
    notes,
  };
}

export async function listEvents() {
  const events = await readEvents();

  return events.sort((a, b) =>
    `${a.date}T${a.time || "23:59"}`.localeCompare(
      `${b.date}T${b.time || "23:59"}`
    )
  );
}

export async function createEvent(
  input: EventInput
) {
  return withWriteLock(async () => {
    const events = await readEvents();

    const occupied = events.some(
      (event) => event.date === input.date
    );

    if (occupied) {
      throw new Error(
        "Ya existe una reservación para esa fecha."
      );
    }

    const event: CalendarEvent = {
      id: randomUUID(),
      ...input,
      paymentStatus: calculatePaymentStatus(
        input.totalPrice,
        input.advancePayment
      ),
      createdAt: new Date().toISOString(),
    };

    events.push(event);

    await saveEvents(events);

    return event;
  });
}

export async function updateEvent(
  id: string,
  input: EventInput
) {
  return withWriteLock(async () => {
    const events = await readEvents();

    const index = events.findIndex(
      (event) => event.id === id
    );

    if (index === -1) {
      return null;
    }

    const occupied = events.some(
      (event) =>
        event.id !== id &&
        event.date === input.date
    );

    if (occupied) {
      throw new Error(
        "Ya existe otra reservación para esa fecha."
      );
    }

    events[index] = {
      ...events[index],
      ...input,
      paymentStatus: calculatePaymentStatus(
        input.totalPrice,
        input.advancePayment
      ),
    };

    await saveEvents(events);

    return events[index];
  });
}

export async function deleteEvent(id: string) {
  return withWriteLock(async () => {
    const events = await readEvents();

    const filtered = events.filter(
      (event) => event.id !== id
    );

    if (filtered.length === events.length) {
      return false;
    }

    await saveEvents(filtered);

    return true;
  });
}