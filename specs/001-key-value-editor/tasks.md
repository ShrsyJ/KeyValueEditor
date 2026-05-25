# Implementation Tasks: Key-Value Editor

## 1. Backend Setup
- [ ] Create `backend/` project structure
  - [ ] Add `backend/app/main.py` with FastAPI application instance and startup/shutdown handlers
  - [ ] Add `backend/requirements.txt` with `fastapi`, `uvicorn`, `sqlmodel`, `pydantic`, `pandas`, `openpyxl`, and `python-dotenv` if needed
  - [ ] Add `backend/app/db.py` for SQLite connection management, session factory, and transactional helper functions
  - [ ] Configure CORS middleware for `http://localhost:5173` and `http://localhost:3000`
  - [ ] Add local `.env` or config settings for database file path and import file path
- [ ] Add `backend/app/api/__init__.py` and register API router in `main.py`
- [ ] Add startup sanity check to ensure the SQLite database file is created or can be opened

## 2. SQLite Models
- [ ] Define data model metadata in `backend/app/models.py`
  - [ ] Add `Record` model using `SQLModel` with `id` primary key and dynamic fields for questionnaire columns
  - [ ] Ensure `skillid` and `validation_of` columns are defined and non-nullable
  - [ ] Add a `last_modified` timestamp column and optional `edited_by` or `persona` audit field
- [ ] Add DB initialization logic in `db.py` to create tables if missing
- [ ] Add helper function to load schema column order from the `Record` model or database reflection
- [ ] Add model serialization helpers for API responses with column order preserved

## 3. Excel Import
- [ ] Create import script `backend/app/import_excel.py`
  - [ ] Read the provided Excel questionnaire using `pandas.read_excel(..., engine="openpyxl")`
  - [ ] Validate required columns exist, including `skillid` and `validation_of`
  - [ ] Ensure `skillid` values are present and non-empty for all rows
  - [ ] Preserve column order from the Excel sheet when mapping to SQLite fields
- [ ] Implement import behavior
  - [ ] Create or migrate the SQLite table schema if necessary
  - [ ] Load rows into the SQLite database transactionally
  - [ ] Reject import and roll back if required columns are missing or any validation fails
- [ ] Add command-line entrypoint or script runner to execute the import from project root
- [ ] Add sample dataset seed logic for easier local development, if Excel file is unavailable

## 4. REST APIs
- [ ] Implement record listing endpoint in `backend/app/api/records.py`
  - [ ] `GET /records` returns list of records with basic fields and preserves consistent column order
  - [ ] Support optional pagination or limit query parameters if needed for large datasets
- [ ] Implement single-record load endpoint
  - [ ] `GET /records/{record_id}` returns the full record payload for editing
  - [ ] Include metadata required by the frontend, such as column list and current persona restrictions
- [ ] Implement record save endpoint
  - [ ] `PUT /records/{record_id}` accepts updated record data
  - [ ] Validate payload shape and required fields in request body
  - [ ] Enforce `validation_of == skillid` before writing to the database
  - [ ] Apply transactional save semantics and return the persisted record
- [ ] Add a lightweight audit/change log response field to track `edited_by` or `persona` and `last_modified`
- [ ] Add error handling and clear API error messages for validation failures

## 5. Persona-based Permissions
- [ ] Define personas and permission rules in backend or frontend config
  - [ ] `Creator`: edit all fields
  - [ ] `Ops`: edit only the last four columns by column order
- [ ] Add backend validation to reject unauthorized field changes if the request includes restricted edits
  - [ ] Compare incoming changed fields against the allowed field list for the persona supplied in the request
  - [ ] Return `403` or `400` when Ops updates fields outside the last four columns
- [ ] Expose allowed editable field metadata in the record load API response
  - [ ] Return `editableFields` or `editableColumns` based on current persona rule set
- [ ] Add a default persona selection or session fallback when the request does not specify persona

## 6. React Frontend Setup
- [ ] Create `frontend/` project with Vite + React or Create React App
  - [ ] Add `frontend/package.json` with `react`, `react-dom`, `axios`, `react-router-dom` (optional), and testing dependencies
  - [ ] Add `frontend/vite.config.js` or CRA config and `frontend/tsconfig.json` if using TypeScript
- [ ] Add base app structure
  - [ ] `src/App.jsx` with top-level state for current persona, selected record, and record list
  - [ ] `src/services/api.js` with `getRecords()`, `getRecord(id)`, and `saveRecord(id, payload)` functions
  - [ ] `src/components/PersonaSwitcher.jsx` for switching `Creator` / `Ops`
- [ ] Add local session persistence for persona
  - [ ] Use `localStorage` or React state to persist persona until browser refresh
  - [ ] Default persona to `Creator` on first load
- [ ] Add CORS-aware base URL config for local backend development

## 7. Editable Table UI
- [ ] Build `RecordEditor.jsx` component
  - [ ] Render the loaded record fields in form controls that preserve column order
  - [ ] Use text inputs / textareas for editable fields and read-only labels for disabled fields
  - [ ] Disable non-editable fields when persona = `Ops`
  - [ ] Display inline validation message if `validation_of` would diverge from `skillid`
- [ ] Build `RecordsTable.jsx` component
  - [ ] Show table rows for loaded records or a small set of records
  - [ ] Display truncated content for long values and support row selection
  - [ ] Highlight the currently selected record row
- [ ] Wire record selection and editing flows
  - [ ] Load selected record into `RecordEditor` when a table row is clicked
  - [ ] Send updated record payload to backend on Save
  - [ ] Disable Save when validation fails or no editable changes exist
- [ ] Add UI affordances for personas
  - [ ] Show current persona in top-right profile icon area
  - [ ] Update form field enablement immediately when persona changes
  - [ ] Show a small badge or helper text explaining Ops restrictions
- [ ] Add save/status notifications
  - [ ] Show success toasts or inline messages after save
  - [ ] Display error messages from API responses clearly next to the form

## 8. Live Updates
- [ ] Implement live UI update after save
  - [ ] Update the table row data locally after successful `PUT /records/{id}` response
  - [ ] Refresh the loaded record in the editor from the response payload
- [ ] Add optional polling or refresh behavior for the record list
  - [ ] Re-fetch `GET /records` after save if the table uses cached data
  - [ ] Ensure the UI reflects the latest `last_modified` timestamp
- [ ] Add optimistic UI indicators
  - [ ] Show loading state while save is in progress
  - [ ] Disable Save button during the request
- [ ] Add conflict/overwrite notification text for same-record updates if backend returns a stale-write condition

## 9. Testing
- [ ] Add backend tests in `backend/tests/`
  - [ ] Test SQLite model creation and import validation logic
  - [ ] Test `GET /records`, `GET /records/{id}`, and `PUT /records/{id}` responses
  - [ ] Test that `validation_of` is corrected to match `skillid` before persist
  - [ ] Test persona restriction enforcement for Ops updates
  - [ ] Test transactional rollback on invalid Excel import or save payload
- [ ] Add frontend tests in `frontend/src/__tests__/`
  - [ ] Test persona switcher behavior and persistence
  - [ ] Test that `Ops` cannot edit disabled fields in `RecordEditor`
  - [ ] Test save flow updates table data after successful API response
  - [ ] Test inline validation for `validation_of` and required fields
- [ ] Add integration/e2e test plan
  - [ ] Document an end-to-end manual or Playwright test for load-edit-save with Creator persona
  - [ ] Document an end-to-end manual or Playwright test for Ops-restricted edit flow
- [ ] Add CI-friendly test commands to `backend/package.json` or root docs
  - [ ] `pytest` for backend
  - [ ] `npm test` or `yarn test` for frontend

## 10. Final Delivery and Review
- [ ] Verify the backend and frontend start successfully with local dev scripts
- [ ] Run import against the provided Excel questionnaire and confirm record load
- [ ] Confirm Creator and Ops workflows behave as expected in the browser
- [ ] Review and update `specs/001-key-value-editor/plan.md` and `specs/001-key-value-editor/spec.md` with any implementation notes
- [ ] Prepare a short README or quickstart note for running the feature locally
