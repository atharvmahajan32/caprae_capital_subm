from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import schemas
import db
import uvicorn
from typing import List
import datetime
import threading
import time

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    db.init_db()
    t = threading.Thread(target=background_worker, daemon=True)
    t.start()


def background_worker():
    while True:
        now = datetime.datetime.utcnow().isoformat()
        due = db.get_due_sequences(now)
        for s in due:
            lead_ids = db.get_sequence_leads(s["id"])
            for lid in lead_ids:
                db.log_activity("send", f"sequence:{s['id']} lead:{lid}")
            db.mark_sequence_sent(s["id"])
        time.sleep(5)


@app.post("/leads", response_model=schemas.LeadOut)
def create_lead(payload: schemas.LeadCreate):
    lead_id = db.insert_lead(payload.name or "", payload.email)
    leads = db.list_leads()
    for l in leads:
        if l["id"] == lead_id:
            return l
    raise HTTPException(status_code=500, detail="lead not found after insert")


@app.get("/leads", response_model=List[schemas.LeadOut])
def get_leads():
    return db.list_leads()


@app.put("/leads/{lead_id}", response_model=schemas.LeadOut)
def edit_lead(lead_id: int, payload: schemas.LeadCreate):
    
    updated = db.update_lead(lead_id, payload.name, payload.email)
    if not updated:
        raise HTTPException(status_code=404, detail="lead not found or update failed")
    return updated


@app.delete("/leads/{lead_id}")
def remove_lead(lead_id: int):
    ok = db.delete_lead(lead_id)
    if not ok:
        raise HTTPException(status_code=404, detail="lead not found")
    return {"ok": True}


@app.post("/leads/{lead_id}/claim")
def claim_lead(lead_id: int, claimer: str):
    ok = db.claim_lead(lead_id, claimer)
    if not ok:
        raise HTTPException(status_code=404, detail="lead not found or already claimed")
    return {"ok": True}


@app.post("/sequences", response_model=schemas.SequenceOut)
def create_sequence(payload: schemas.SequenceCreate):
    seq_id = db.create_sequence(payload.name, payload.scheduled_at, payload.created_by)
    for step in payload.steps or []:
        db.add_sequence_step(seq_id, step.step_index, step.delay_hours, step.subject, step.body)
    for lid in payload.lead_ids or []:
        db.add_sequence_lead(seq_id, lid)
    seqs = db.list_sequences()
    for s in seqs:
        if s["id"] == seq_id:
            return s
    raise HTTPException(status_code=500, detail="sequence not found after insert")


@app.get("/sequences", response_model=List[schemas.SequenceOut])
def get_sequences():
    return db.list_sequences()


@app.post("/sequences/{sequence_id}/add-leads")
def add_leads(sequence_id: int, payload: schemas.AddLeads):
    seq = db.get_sequence(sequence_id)
    if not seq:
        raise HTTPException(status_code=404, detail="sequence not found")
    db.add_leads_to_sequence(sequence_id, payload.lead_ids)
    return {"ok": True}


@app.post("/sequences/{sequence_id}/pause")
def pause_sequence(sequence_id: int):
    ok = db.update_sequence_status(sequence_id, "paused")
    if not ok:
        raise HTTPException(status_code=404, detail="sequence not found")
    return {"ok": True}


@app.post("/sequences/{sequence_id}/resume")
def resume_sequence(sequence_id: int):
    ok = db.update_sequence_status(sequence_id, "scheduled")
    if not ok:
        raise HTTPException(status_code=404, detail="sequence not found")
    return {"ok": True}


@app.post("/sequence")
def post_sequence_webhook(payload: dict):
    to = payload.get("to")
    subject = payload.get("subject")
    body = payload.get("body")
    seq = payload.get("sequenceId")
    step = payload.get("stepIndex")

    if not to or not subject:
        raise HTTPException(status_code=400, detail="missing to or subject")

    db.log_activity("webhook_send", f"to:{to} sequence:{seq} step:{step} subject:{subject}")
    return {"ok": True, "queued": True}


if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
