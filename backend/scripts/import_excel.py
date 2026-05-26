#!/usr/bin/env python3
"""Import an Excel questionnaire into backend/data.db as table `questionnaire`.

Usage: python import_excel.py path/to/questionnaire.xlsx --db backend/data.db
"""
import argparse
import pandas as pd
import sqlite3
import os
from typing import List


def create_table(conn: sqlite3.Connection, table: str, columns: List[str]):
    cols_sql = ", ".join([f'"{c}" TEXT' for c in columns])
    sql = f"CREATE TABLE IF NOT EXISTS {table} (id INTEGER PRIMARY KEY AUTOINCREMENT, {cols_sql})"
    conn.execute(sql)


def import_excel(path: str, db_path: str, sheet_name=0):
    df = pd.read_excel(path, sheet_name=sheet_name, engine="openpyxl")

    # If multiple sheets returned as dict, take the first one
    if isinstance(df, dict):
        df = list(df.values())[0]

    # Strip whitespace from column names
    df.columns = [str(c).strip() for c in df.columns]

    # Ensure all columns are strings (store as TEXT)
    df = df.where(pd.notnull(df), None)

    os.makedirs(os.path.dirname(os.path.abspath(db_path)), exist_ok=True)
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()

    # Drop existing table if exists and recreate to preserve column order
    cur.execute("DROP TABLE IF EXISTS questionnaire")
    create_table(conn, "questionnaire", list(df.columns))

    placeholders = ",".join(["?" for _ in df.columns])
    cols = ', '.join([f'"{c}"' for c in df.columns])
    insert_sql = f"INSERT INTO questionnaire ({cols}) VALUES ({placeholders})"
    rows = [tuple(x) for x in df.values.tolist()]
    cur.executemany(insert_sql, rows)
    conn.commit()
    conn.close()
    print(f"Imported {len(rows)} rows into {db_path} (table: questionnaire)")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("excel", help="Path to Excel file")
    parser.add_argument("--db", default="backend/data.db", help="SQLite DB path")
    args = parser.parse_args()
    import_excel(args.excel, args.db)


if __name__ == "__main__":
    main()