# Implementation Plan: Key-Value Editor

**Branch**: `001-key-value-editor` | **Date**: 2026-05-25 | **Spec**: ../spec.md

**Input**: Feature specification from `specs/001-key-value-editor/spec.md`

## Summary

Build a small web application consisting of a FastAPI backend and a React frontend. The backend exposes a minimal REST API to load a single record, save updates, and list records; SQLite is the persistent store seeded from the provided Excel questionnaire. The frontend (React with hooks) displays one record at a time in an editable form and a live table; persona switching (Creator/Ops) is UI-driven and enforces edit permissions. CORS is enabled for local development; no server-side authentication middleware is added per constitution.

## Technical Context

**Language/Version**: Python 3.11 (backend), Node.js 18+ (frontend)

**Primary Dependencies**: FastAPI, Uvicorn, SQLModel or SQLAlchemy + Alembic (optional), Pandas + openpyxl (import), React 18, Vite (or Create React App), Axios or Fetch for HTTP client.

**Storage**: SQLite file (local, embedded). Import script will load the Excel questionnaire and create a table preserving column order.

**Testing**: `pytest` for backend unit/integration tests, React Testing Library + Jest for frontend unit tests, and optional Playwright for end-to-end flows.

**Target Platform**: Local development (macOS, Linux, Windows) with optional lightweight deployment to a single-machine host.

**Project Type**: Web application (separate `backend/` and `frontend/` directories).

**Performance Goals**: UI should reflect saved changes in <1s for local SQLite-backed operations. Backend endpoints are low-throughput and optimized for low-latency local edits rather than high concurrency.

**Constraints**: No external authentication libraries; persona switching is client-side only. CORS enabled for `http://localhost:5173` (default Vite) and `http://localhost:3000` (CRA) to support local dev. Saves must be transactional.

**Scale/Scope**: Single-user or small-team editing tool; expected dataset size: hundreds to low-thousands of rows.

## Constitution Check

All mandatory constitution constraints are satisfied:
- Backend framework: FastAPI — OK
- Frontend: React — OK
- Storage: SQLite — OK
- No external auth libraries used; persona switching is UI-only — OK

GATE: Passed. Proceed to Phase 0 research.

## Project Structure

### Documentation (this feature)

```
specs/001-key-value-editor/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
└── tasks.md (generated later)
```

### Source Code (repository root)

```
backend/
├── app/
│   ├── main.py          # FastAPI app entry
│   ├── api/
│   │   ├── records.py   # endpoints: GET /records, GET /records/{id}, PUT /records/{id}
│   ├── db.py            # SQLite connection + transactional helpers
+│   └── models.py        # SQLModel or SQLAlchemy models
└── requirements.txt

frontend/
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── RecordEditor.jsx
│   │   └── RecordsTable.jsx
│   └── services/api.js  # axios/fetch wrappers
└── package.json
```

**Structure Decision**: Use separate `backend/` and `frontend/` projects to keep UI and API concerns separated and allow independent startup during development. This maps naturally to FastAPI + React and simplifies CORS/local dev.

## Complexity Tracking

No constitution violations; complexity is low and justified by separation of concerns and testability.

