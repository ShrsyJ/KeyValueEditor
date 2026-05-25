# quickstart.md

## Prerequisites

- Python 3.11+
- Node.js 18+
- pip and npm/yarn

## Backend (local)

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
# import data from Excel (place questionnaire.xlsx at project root or provide path)
python backend/scripts/import_excel.py questionnaire.xlsx --db backend/data.db
uvicorn backend.app.main:app --reload --port 8000
```

## Frontend (local)

```bash
cd frontend
npm install
npm run dev
```

## Notes

- Frontend expects backend at `http://localhost:8000`; CORS is enabled for common dev ports.
- Persona switching is client-side and stored in `sessionStorage`.
