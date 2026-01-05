# Copilot / AI Agent Guidance

Purpose: Short, actionable guidance to help an AI agent become productive in this repository within minutes.

## Big picture
- Monorepo with two main apps:
  - **Backend/** — FastAPI (Python) + SQLModel. Entry: `Backend/main.py` (FastAPI app). DB and tables are created at app lifespan via `create_db_and_tables()`.
  - **todo-frontend/** — Next.js 16 (App Router) + TypeScript + Tailwind. Client-side API wrapper at `todo-frontend/lib/api.ts`.
- Specs-driven development: authoritative specs live under `specs/` (e.g., `specs/api/rest-endpoints.md`). Always check the spec for feature intent, then confirm implementation in code.

## Quick start (dev)
- Backend (dev):
  - From repo root: `python run.py` (this adds `Backend/` to path and runs uvicorn)
  - Or: `cd Backend && uvicorn main:app --reload --port 8000`
- Frontend (dev): `cd todo-frontend && npm run dev` (Next local dev server at `http://localhost:3000`)
- Notes:
  - There is no `docker-compose.yml` in the repo (despite `PROJECT.md` mentioning it).

## Required environment variables
- Backend:
  - `DATABASE_URL` (Postgres) — required by `Backend/db.py`
  - `BETTER_AUTH_SECRET` — required by `Backend/auth.py` (used to sign JWTs)
- Frontend:
  - Optional `NEXT_PUBLIC_API_URL` to point frontend to backend (defaults to `http://localhost:8000` in `lib/api.ts`).

## Authentication & API specifics (important)
- Token endpoint: `POST /api/token` expects x-www-form-urlencoded fields `username` (email) and `password`.
  - Example: `curl -X POST http://localhost:8000/api/token -d 'username=you@example.com&password=secret' -H 'Content-Type: application/x-www-form-urlencoded'`
- JWTs store the user email in the `sub` claim (see `Backend/auth.py`) — the backend expects `sub` to be an email and uses it to lookup the user.
- Frontend stores token in `localStorage` as `token`; `todo-frontend/lib/api.ts` attaches it to the `Authorization: Bearer <token>` header via an axios interceptor.
- Backend routes are mounted under `/api` and use `get_current_user` dependency (token-based). Note: code does not require `user_id` in path — it uses the authenticated user from the token, which differs from a few specs that show `/api/{user_id}/tasks` (double-check the spec vs code).

## Notable files & patterns (read these first)
- `PROJECT.md` — project overview and workflow
- Backend: `Backend/main.py`, `Backend/db.py`, `Backend/auth.py`, `Backend/models.py`, `Backend/routes/tasks.py`
- Frontend: `todo-frontend/GEMINI.md`, `todo-frontend/lib/api.ts`, `todo-frontend/app/tasks/page.tsx`
- Specs: `specs/specs/*` (features, api, database). Specs are used by `.specify` scripts to build agent contexts.

## Conventions & implementation details
- Database: SQLModel models live in `Backend/models.py`. `create_db_and_tables()` is called on FastAPI lifespan to create tables automatically in dev.
- Routes: Use FastAPI `response_model` + Pydantic/SQLModel for request/response validation.
- Frontend: Prefer Server Components (Next App Router). Use `use client` only where UI interactivity is required (e.g., `app/tasks/page.tsx` is a client component).
- API client: All backend calls should go through `todo-frontend/lib/api.ts` (helpers: `getTasks`, `createTask`, `updateTask`, `deleteTask`, `toggleTask`).
- Formatting & hooks: Frontend uses ESLint, Prettier, Husky, and lint-staged (see `todo-frontend/package.json`).

## How to update agent context / keep this file fresh
- The repo contains `.specify/scripts/bash/update-agent-context.sh` which expects a `.github/copilot-instructions.md` file. When adding or changing endpoints or environment requirements:
  1. Update relevant `specs/` files (e.g., `specs/api/rest-endpoints.md`).
  2. Run `.specify/scripts/bash/update-agent-context.sh` to refresh agent context files.

## Common gotchas & discrepancies to watch for
- Spec vs code mismatch: specs sometimes show user_id as path param, but current code infers user from JWT and uses routes like `/api/tasks` (see `Backend/routes/tasks.py`). Prefer verifying behavior in code and unit tests rather than relying solely on specs.
- `PROJECT.md` mentions `docker-compose up` — there is no docker-compose in the repo.

## Quick test example
1. Ensure env vars are set (e.g., `DATABASE_URL`, `BETTER_AUTH_SECRET`).
2. Start backend: `python run.py`
3. Create/test token:
   - `curl -X POST http://localhost:8000/api/token -d 'username=user@example.com&password=pass' -H 'Content-Type: application/x-www-form-urlencoded'`
4. Use the returned token to `GET /api/tasks` with `Authorization: Bearer <token>`.

---
If any of the above points are unclear or you'd like me to add more examples (e.g., exact curl requests for each endpoint, or a short checklist for adding a new API endpoint and updating specs), tell me which area to expand and I will update this file. ✅
