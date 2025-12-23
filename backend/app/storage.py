from datetime import datetime
from typing import List, Optional
from .models import Service, ServiceCreate


class InMemoryDB:
    def __init__(self) -> None:
        self._services: List[Service] = []
        self._next_id = 1

        # Seed with REAL endpoints (safe/public)
        seeds = [
            ("GitHub API", "https://api.github.com"),
            ("Cloudflare", "https://www.cloudflare.com"),
            ("Python", "https://www.python.org"),
        ]
        for name, url in seeds:
            self.create(ServiceCreate(name=name, url=url))

    def list(self) -> List[Service]:
        return self._services

    def get(self, service_id: int) -> Optional[Service]:
        return next((s for s in self._services if s.id == service_id), None)

    def create(self, payload: ServiceCreate) -> Service:
        svc = Service(
            id=self._next_id,
            name=payload.name,
            url=payload.url,
            status="DOWN",          # unknown until checked
            last_checked=None,
            latency_ms=None,
            http_status=None,
            error=None,
        )
        self._next_id += 1
        self._services.append(svc)
        return svc

    def update_check_result(
        self,
        service_id: int,
        *,
        status: str,
        last_checked: datetime,
        latency_ms: Optional[int],
        http_status: Optional[int],
        error: Optional[str],
    ) -> Optional[Service]:
        svc = self.get(service_id)
        if not svc:
            return None
        svc.status = status  # type: ignore
        svc.last_checked = last_checked
        svc.latency_ms = latency_ms
        svc.http_status = http_status
        svc.error = error
        return svc
