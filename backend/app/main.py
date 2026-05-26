from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from . import api
import os

app = FastAPI(title="KeyValueEditor API")

# CORS for local dev
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup_event():
    # ensure DB file path exists
    data_db = os.path.join(os.path.dirname(__file__), "..", "data.db")
    # actual DB created by import script; nothing to do here
    return


app.include_router(api.router, prefix="/api")
