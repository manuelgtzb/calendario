# Calendario full-stack

Aplicación de calendario construida con React, Next.js y TypeScript.

- **Frontend:** componentes React y App Router en `src/app`.
- **Backend:** API REST en `src/app/api/events`.
- **Persistencia local:** archivo `data/events.json`.

## Uso

Requiere Node.js 20 o superior.

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Comandos

```bash
npm run dev       # desarrollo
npm run build     # compilación de producción
npm run start     # ejecutar la compilación
npm run lint      # análisis estático
npm run typecheck # validar TypeScript
```

## API

- `GET /api/events` — lista eventos.
- `POST /api/events` — crea un evento.
- `PATCH /api/events/:id` — actualiza un evento.
- `DELETE /api/events/:id` — elimina un evento.

La persistencia en JSON es apropiada para uso local. Para desplegar múltiples instancias, sustituye `src/lib/events-store.ts` por una base de datos como PostgreSQL.
