# Feature Specification: Key-Value Editor

**Feature Branch**: `001-key-value-editor`

**Created**: 2026-05-25

**Status**: Draft

**Input**: User description: "Build a key-value editor app. It loads one record at a time from a SQLite database and lets users edit and save it. The table updates live in the frontend after each save. There are two personas: Creator (can edit all fields) and Ops (can only edit the last 4 columns). Persona is switched using a profile icon in the top right - no login required. The validation_of column must always match the skillid column value. Use the uploaded Excel questionnaire as the data source."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Edit single record (Priority: P1)

As a Creator, I can load a single record from the database, edit any field, and save changes so that the record persists and the app's table view updates immediately to reflect the saved values.

**Why this priority**: Core value - enables data correction and content creation.

**Independent Test**: Load a known record, change a field other than `skillid` and `validation_of`, save, and verify the persisted database row and the frontend table reflect the change instantly.

**Acceptance Scenarios**:
1. **Given** a record is selected, **When** Creator edits any field and clicks Save, **Then** the DB row is updated and the table view updates live to show the new values.
2. **Given** Creator changes `skillid`, **When** they save, **Then** the system updates `validation_of` to match the new `skillid` value before persisting.

---

### User Story 2 - Ops restricted edits (Priority: P1)

As an Ops user, I can switch persona via the profile icon and then edit only the last four columns of the record; attempts to edit other columns are disabled or rejected.

**Why this priority**: Operational safety - prevents accidental modification of primary content by Ops.

**Independent Test**: Switch to Ops persona, attempt to edit a non-last-4 column (should be disallowed), then edit a last-4 column and save successfully; verify DB and table update.

**Acceptance Scenarios**:
1. **Given** persona=Ops, **When** attempting to edit column X that is not among the last four columns, **Then** the UI prevents editing and Save is not allowed for that change.
2. **Given** persona=Ops, **When** editing any of the last four columns and saving, **Then** the DB row updates and the frontend table refreshes live.

---

### User Story 3 - Persona switching (Priority: P2)

As any user at the client, I can toggle between `Creator` and `Ops` personas using the profile icon (top-right) without logging in, and the UI updates editing affordances accordingly.

**Independent Test**: Click the profile icon, switch persona, verify which fields are editable change immediately and no login prompt appears.

**Acceptance Scenarios**:
1. **Given** initial persona=Creator, **When** clicking profile icon and selecting Ops, **Then** the UI disables editing on non-last-4 columns.
2. **Given** persona change, **When** navigating between records, **Then** persona persists for the session (until browser refresh) and permissions remain enforced.

---

### User Story 4 - Data source and import (Priority: P2)

As a developer/ops user, I can import the uploaded Excel questionnaire into the SQLite database so that the app uses that data as the source of records.

**Independent Test**: Run the import process with the provided Excel file and confirm the SQLite table contains the same rows and column order as the questionnaire; verify the app can load records from that DB.

**Acceptance Scenarios**:
1. **Given** the uploaded Excel questionnaire, **When** import completes, **Then** the SQLite DB has a table with the same columns in the intended order and rows available for editing.

---

### Edge Cases

- Importing Excel with missing columns: import should fail with clear error and not overwrite existing DB.
- Concurrent saves: if two users save the same record in <1s, last writer wins; UI shows a brief notification on overwrite.
- Large text fields: UI should allow editing of long answers and truncate only in table view.
- Missing `skillid` values: import should reject rows missing `skillid`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST load exactly one record at a time into an editable form from the SQLite database.
- **FR-002**: The system MUST allow `Creator` persona to edit and save all fields of the currently loaded record.
- **FR-003**: The system MUST restrict `Ops` persona so it can only edit the last four columns (by table column order) of the currently loaded record.
- **FR-004**: The system MUST allow switching persona via a profile icon located in the top-right of the UI without requiring authentication.
- **FR-005**: On save, the frontend table view MUST update live to reflect the persisted changes for the record that was edited.
- **FR-006**: The system MUST ensure the `validation_of` column value always equals the `skillid` column value before persisting any save.
- **FR-007**: The import process from the uploaded Excel questionnaire MUST create or update a SQLite table whose column ordering is preserved; `skillid` must be present and non-empty for all rows.
- **FR-008**: The system MUST surface clear validation errors to the user if `validation_of` would not match `skillid` or if required columns are missing.
- **FR-009**: Saves MUST be transactional so partial writes do not leave the DB in an inconsistent state.
- **FR-010**: The system MUST provide a simple audit trail for saves (user persona, timestamp, changed columns) visible to Creator.

### Key Entities *(include if feature involves data)*

- **Record**: A single row from the questionnaire table (primary attributes: `skillid`, `validation_of`, plus other questionnaire columns).
- **Persona**: `Creator` or `Ops` with associated edit permissions.
- **Import Job**: Process that ingests the uploaded Excel questionnaire and writes rows to the SQLite table.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of manual edits performed by Creator are persisted and visible in the frontend table within 1 second of saving.
- **SC-002**: 100% of saves enforce `validation_of == skillid` (no exceptions) as verified by automated tests.
- **SC-003**: Ops persona cannot edit beyond the last four columns in 100% of tested scenarios.
- **SC-004**: Import pipeline successfully loads the uploaded Excel questionnaire and makes records available for editing with no data loss for sample input files provided.
- **SC-005**: Primary user flows (load-edit-save for Creator, Ops restricted edit) can be completed within 2 minutes by a novice user.

## Assumptions

- The uploaded Excel questionnaire file will be provided to an import utility (manual or automated) and contains a `skillid` column.
- "Last four columns" is defined by the column ordering in the SQLite table produced by the import; the UI will compute last-4 dynamically from that order.
- No authentication or user accounts are required for persona switching; persona is stored locally in the browser session.
- The app will run in a modern browser and can open a local SQLite-backed API or a small backend service to read/write the DB.
- Performance targets (1s UI update) are achievable on normal development hardware and local DB access.
