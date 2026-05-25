# data-model.md

## Entities

- Record (table: `questionnaire`)
  - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
  - `skillid` (TEXT) — required, unique identifier from questionnaire
  - `validation_of` (TEXT) — must equal `skillid` on every persisted save
  - other columns: imported from Excel, stored as `TEXT` by default

## Relationships

- None for v1; flat table representing questionnaire rows.

## Validation Rules

- `skillid` must be present and non-empty for all rows during import.
- On save, enforce `validation_of == skillid` before commit.
- For Ops persona, enforce that only the last four columns (determined by the table's column order) are editable.

## Column Ordering

- Import script MUST preserve column order from Excel. The UI computes "last four columns" using that order.

*** End
