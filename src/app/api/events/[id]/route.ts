import { NextResponse } from "next/server";

import {
  deleteEvent,
  updateEvent,
  validateEventInput,
} from "@/lib/events-store";

import { isAdminAuthenticated } from "@/lib/admin-auth";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const input = validateEventInput(
      await request.json()
    );

    const event = await updateEvent(id, input);

    if (!event) {
      return NextResponse.json(
        { error: "Reservación no encontrada." },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo actualizar la reservación.";

    return NextResponse.json(
      { error: message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: RouteContext
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json(
      { error: "No autorizado." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const deleted = await deleteEvent(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Reservación no encontrada." },
        { status: 404 }
      );
    }

    return new NextResponse(null, {
      status: 204,
    });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar la reservación." },
      { status: 500 }
    );
  }
}