from pydantic import BaseModel, Field, HttpUrl
from typing import Literal, Optional
from datetime import datetime

Status = Literal["UP", "DOWN", "DEGRADED"]


class ServiceBase(BaseModel):
    name: str = Field(min_length=2, max_length=50)
    url: HttpUrl


class ServiceCreate(ServiceBase):
    pass


class Service(ServiceBase):
    id: int
    status: Status
    last_checked: Optional[datetime] = None
    latency_ms: Optional[int] = None
    http_status: Optional[int] = None
    error: Optional[str] = None
