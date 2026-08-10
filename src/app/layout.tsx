import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salón Roma | Eventos inolvidables",
  description: "Salón de eventos para bodas, XV años y celebraciones en Tampico.",
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
