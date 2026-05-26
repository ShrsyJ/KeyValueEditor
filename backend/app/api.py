from fastapi import APIRouter, HTTPException
from typing import Dict, Any
from . import db

router = APIRouter()


@router.get("/records")
def list_records():
    cols = db.get_columns()
    rows = db.list_records()
    return {"columns": cols, "rows": rows}


@router.get("/records/{record_id}")
def get_record(record_id: int):
    rec = db.get_record(record_id)
    if not rec:
        raise HTTPException(status_code=404, detail="record not found")
    cols = db.get_columns()
    return {"columns": cols, "record": rec}


@router.put("/records/{record_id}")
def put_record(record_id: int, payload: Dict[str, Any]):
    # Ensure record exists
    existing = db.get_record(record_id)
    if not existing:
        raise HTTPException(status_code=404, detail="record not found")

    # Update and enforce validation_of==skillid at DB layer
    updated = db.update_record(record_id, payload)
    return {"record": updated}
