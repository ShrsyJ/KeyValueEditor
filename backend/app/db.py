import sqlite3
from typing import List, Dict, Any, Optional
from contextlib import contextmanager
import os

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data.db")

def _connect():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

@contextmanager
def get_conn():
    conn = _connect()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()

def get_columns() -> List[str]:
    with get_conn() as conn:
        cur = conn.execute("PRAGMA table_info('questionnaire')")
        cols = [row[1] for row in cur.fetchall()]
    return cols

def list_records(limit: Optional[int] = None) -> List[Dict[str, Any]]:
    with get_conn() as conn:
        q = "SELECT * FROM questionnaire ORDER BY id"
        if limit:
            q += f" LIMIT {int(limit)}"
        cur = conn.execute(q)
        rows = [dict(r) for r in cur.fetchall()]
    return rows

def get_record(record_id: int) -> Optional[Dict[str, Any]]:
    with get_conn() as conn:
        cur = conn.execute("SELECT * FROM questionnaire WHERE id = ?", (record_id,))
        row = cur.fetchone()
        return dict(row) if row else None

def update_record(record_id: int, updates: Dict[str, Any]) -> Dict[str, Any]:
    cols = get_columns()
    # Ensure only existing columns are written
    write_cols = [c for c in cols if c in updates and c != "id"]
    if not write_cols:
        return get_record(record_id)
    # Enforce validation_of == skillid if those columns exist
    if "skillid" in cols:
        skillid_val = updates.get("skillid")
        if skillid_val is not None:
            updates["validation_of"] = skillid_val
    set_clause = ", ".join([f'"{c}" = ?' for c in write_cols])
    params = [updates[c] for c in write_cols] + [record_id]
    with get_conn() as conn:
        conn.execute(f"UPDATE questionnaire SET {set_clause} WHERE id = ?", params)
    return get_record(record_id)