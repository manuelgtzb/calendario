import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const username = String(body.username ?? "").trim();
    const password = String(body.password ?? "");
    const remember = Boolean(body.remember);

    const validUsername = process.env.ADMIN_USER;
    const validPassword = process.env.ADMIN_PASSWORD;
    const sessionToken = process.env.ADMIN_SESSION_TOKEN;

    if (!validUsername || !validPassword || !sessionToken) {
      return NextResponse.json(
        { message: "Las credenciales del administrador no están configuradas." },
        { status: 500 }
      );
    }

    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { message: "Usuario o contraseña incorrectos." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      message: "Inicio de sesión correcto.",
    });

    response.cookies.set({
      name: "admin_session",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      ...(remember
        ? { maxAge: 60 * 60 * 24 * 30 }
        : {}),
    });

    return response;
  } catch {
    return NextResponse.json(
      { message: "No se pudo procesar la solicitud." },
      { status: 400 }
    );
  }
}