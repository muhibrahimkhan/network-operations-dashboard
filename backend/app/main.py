from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from .models import Service, ServiceCreate
from .storage import InMemoryDB
import time
import httpx
from datetime import datetime


app = FastAPI(title="Network Ops Microservice", version="1.0.0")

# Allow the Next.js frontend (localhost:3000) to call this backend during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db = InMemoryDB()


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/services", response_model=List[Service])
def list_services():
    return db.list()


@app.post("/services", response_model=Service)
def create_service(payload: ServiceCreate):
    # New services start as DOWN until checked
    return db.create(payload)


@app.post("/services/check", response_model=List[Service])
def check_all_services():

    for svc in db.list():
        start = time.perf_counter()
        try:
            with httpx.Client(timeout=5.0, follow_redirects=True) as client:
                resp = client.get(str(svc.url))
            latency_ms = int((time.perf_counter() - start) * 1000)
            http_status = resp.status_code

            if 200 <= http_status < 400:
                status = "DEGRADED" if latency_ms >= 800 else "UP"
                error = None
            else:
                status = "DOWN"
                error = f"HTTP {http_status}"

        except Exception as e:
            latency_ms = None
            http_status = None
            status = "DOWN"
            error = str(e)

        db.update_check_result(
            svc.id,
            status=status,
            last_checked=datetime.utcnow(),
            latency_ms=latency_ms,
            http_status=http_status,
            error=error,
        )

    return db.list()
