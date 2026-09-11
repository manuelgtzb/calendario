# Salón Roma

Aplicación Next.js para consultar disponibilidad pública y administrar reservaciones de un salón de eventos.

## Flujo

- **Visitante:** consulta fechas en `/`, selecciona una disponible y abre WhatsApp con un mensaje preparado. La API pública solo devuelve fechas y disponibilidad.
- **Administrador:** inicia sesión en `/admin` para crear, editar y eliminar reservaciones desde `/admin/dashboard`. Los datos de clientes, pagos y notas permanecen privados detrás de `/api/events`.

## Instalación y configuración

Requiere Node.js 20 o superior.

```bash
npm ci
```

En Windows PowerShell, crea tu configuración local con:

```powershell
Copy-Item .env.example .env.local
```

Configura `ADMIN_USER`, `ADMIN_PASSWORD`, `ADMIN_SESSION_TOKEN` y `NEXT_PUBLIC_WHATSAPP_NUMBER`. El número de WhatsApp debe incluir código de país y contener únicamente dígitos.

Ejecuta el proyecto:

```bash
npm run dev
```

## Rutas

- `/` — landing y calendario público.
- `/admin` — inicio de sesión administrativo.
- `/admin/dashboard` — gestión de reservaciones.
- `/api/availability` — disponibilidad pública, sin datos de clientes.
- `/api/events` — API administrativa autenticada.

## Validación

```bash
npm run typecheck
npm run lint
npm run build
```

## Almacenamiento

`data/events.json` es adecuado solamente para desarrollo local y demostraciones. No es almacenamiento confiable para Vercel o entornos serverless. Antes de desplegar para un cliente real debe migrarse a PostgreSQL, Supabase u otra base de datos persistente.
