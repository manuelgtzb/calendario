import { NextResponse } from "next/server";

import { listEvents } from "@/lib/events-store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const events = await listEvents();

    const availability = events.map((event) => ({
      date: event.date,
      available: false,
    }));

    return NextResponse.json(availability, {
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No se pudo consultar la disponibilidad.",
      },
      { status: 500 }
    );
  }
}
