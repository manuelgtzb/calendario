import { NextResponse } from "next/server";

import {
  createEvent,
  listEvents,
  validateEventInput,
} from "@/lib/events-store";

import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 }
    );
  }

  try {
    const events = await listEvents();

    return NextResponse.json(events);
  } catch {
    return NextResponse.json(
      { error: "No se pudieron cargar los eventos." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 }
    );
  }

  try {
    const input = validateEventInput(
      await request.json()
    );

    const event = await createEvent(input);

    return NextResponse.json(event, {
      status: 201,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo crear la reservación.";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}