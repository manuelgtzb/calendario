"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          remember,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message ?? "No se pudo iniciar sesión.");
        return;
      }

      router.push("/admin/dashboard");
    } catch {
      setError("No fue posible conectarse con el servidor.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="admin-login-page">
      <Link className="admin-back-link" href="/">
        ← Volver al sitio
      </Link>

      <section className="admin-login-container">
        <div className="admin-lock-icon" aria-hidden="true">
          ♢
        </div>

        <form className="admin-login-card" onSubmit={handleSubmit}>
          <header>
            <p className="admin-small-label">Área privada</p>
            <h1>Acceso administrativo</h1>
            <p>
              Ingresa con tu cuenta autorizada para administrar
              reservaciones.
            </p>
          </header>

          <label className="admin-field">
            <span>Usuario</span>

            <div className="admin-input-wrapper">
              <span aria-hidden="true">◇</span>

              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="admin@roma"
                autoComplete="username"
                required
              />
            </div>
          </label>

          <label className="admin-field">
            <span>Contraseña</span>

            <div className="admin-input-wrapper">
              <span aria-hidden="true">□</span>

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Ingresa tu contraseña"
                autoComplete="current-password"
                required
              />

              <button
                className="admin-show-password"
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={
                  showPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {showPassword ? "Ocultar" : "Ver"}
              </button>
            </div>
          </label>

          <label className="admin-remember">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
            />

            <span>Mantener sesión iniciada</span>
          </label>

          {error && (
            <p className="admin-login-error" role="alert">
              {error}
            </p>
          )}

          <button
            className="admin-login-button"
            type="submit"
            disabled={loading}
          >
            {loading ? "Verificando..." : "Iniciar sesión"}
          </button>
        </form>

        <p className="admin-private-label">
          ◇ Área privada · Salón Roma
        </p>
      </section>
    </main>
  );
}
