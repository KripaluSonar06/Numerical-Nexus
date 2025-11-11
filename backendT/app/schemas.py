# app/schemas.py
from pydantic import BaseModel
from typing import Optional, Any, Dict

class SolveRequest(BaseModel):
    # generic dictionary input if each solution has different inputs
    params: Dict[str, Any]

class SolveResponse(BaseModel):
    status: str
    result: Optional[Any]
    error: Optional[str] = None