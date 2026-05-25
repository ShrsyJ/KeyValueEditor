# research.md

## Decisions

- **Backend framework**: FastAPI (Python). Rationale: lightweight, automatic OpenAPI generation, async support, good developer DX for small APIs.
- **Frontend**: React 18 with hooks and Vite. Rationale: fast dev server, familiar component model, easy state management for persona toggling.
- **Database**: SQLite seeded from the provided Excel questionnaire via a Python import script using `pandas` + `openpyxl`. Rationale: simple embedded storage, easy portability, and suits expected dataset sizes.
- **Import mechanism**: A small CLI/import script (`scripts/import_excel.py`) will read the Excel file, validate presence of `skillid`, preserve column order, and write rows into a SQLite table within `backend/data.db`.
- **Persona switching**: Implemented entirely client-side; persona stored in `sessionStorage` and toggled via a profile icon. No server-side auth required per constitution.
- **Validation**: On any save, backend will coerce or validate that `validation_of == skillid` before persisting; frontend will enforce and surface errors before submission.
- **Live update**: After successful save, the PUT response will include the updated record and the frontend will update the table and form state immediately.
- **CORS**: Backend will enable CORS for local dev hosts (`localhost` ports) to allow the frontend dev server to call APIs.

## Alternatives Considered

- Using a single-page Electron app with direct SQLite access: rejected because separation of concerns with a backend simplifies testing and allows remote operation later.
- Using a hosted DB (Postgres): rejected due to added deployment complexity for small dataset.
- Storing persona server-side with a cookie/session: rejected due to constitution constraint prohibiting external auth and the requirement for UI-only persona switching.

## Unresolved Questions (NEEDS CLARIFICATION)

- Column typing: assume all questionnaire columns are stored as `TEXT` unless clearly numeric; treat `skillid` as string identifier.

Decision summary: proceed with FastAPI, React, SQLite, import script using pandas/openpyxl, and client-side persona switching.
