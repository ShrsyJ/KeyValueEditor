# Backend (FastAPI)

Run the import script to create `backend/data.db` from the Excel file and start the API:

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/import_excel.py ../questionnaire.xlsx --db data.db
uvicorn app.main:app --reload --port 8000
```

The API endpoints:
- `GET /api/records` — list columns and rows
- `GET /api/records/{id}` — get single record and columns
- `PUT /api/records/{id}` — update record (backend enforces `validation_of == skillid`)
