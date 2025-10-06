from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field


class LeadCreate(BaseModel):
    name: Optional[str]
    email: EmailStr


class LeadOut(BaseModel):
    id: int
    name: Optional[str]
    email: EmailStr
    claimed_by: Optional[str]
    claimed_at: Optional[str]


class SequenceStep(BaseModel):
    step_index: int
    delay_hours: int
    subject: str
    body: str


class SequenceCreate(BaseModel):
    name: str
    scheduled_at: Optional[str]
    created_by: Optional[str]
    lead_ids: Optional[List[int]] = Field(default_factory=list)
    steps: Optional[List[SequenceStep]] = Field(default_factory=list)


class SequenceOut(BaseModel):
    id: int
    name: str
    scheduled_at: Optional[str]
    status: str
    created_by: Optional[str]
    steps: List[SequenceStep] = []
    lead_ids: List[int] = []


class AddLeads(BaseModel):
    lead_ids: List[int]
