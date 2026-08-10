export const EVENT_TYPES = [
  "Boda",
  "XV años",
  "Cumpleaños",
  "Bautizo",
  "Graduación",
  "Corporativo",
  "Bloqueo interno",
  "Confirmación",
  "Comunión",
  "Otro",
] as const;

export const RESERVATION_STATUSES = [
  "Apartada",
  "Confirmada",
  "Bloqueada",
] as const;

export const PAYMENT_STATUSES = [
  "Pendiente",
  "Anticipo",
  "Pagado",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

export type ReservationStatus =
  (typeof RESERVATION_STATUSES)[number];

export type PaymentStatus =
  (typeof PAYMENT_STATUSES)[number];

export interface CalendarEvent {
  id: string;

  customerName: string;
  customerPhone: string;

  date: string;
  time: string;
  eventType: EventType;
  guestCount: number;

  totalPrice: number;
  advancePayment: number;
  paymentStatus: PaymentStatus;

  reservationStatus: ReservationStatus;
  notes: string;

  createdAt: string;
}

export type EventInput = Omit<
  CalendarEvent,
  "id" | "createdAt" | "paymentStatus"
>;