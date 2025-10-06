import sqlite3
from pathlib import Path
from typing import List, Optional, Any, Dict
import datetime

DB_PATH = Path(__file__).parent / "db.sqlite"


def get_conn():
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = get_conn()
    cur = conn.cursor()
    # leads table
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            claimed_by TEXT,
            claimed_at TEXT,
            created_at TEXT
        )
        """
    )

    # sequences
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS sequences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            scheduled_at TEXT,
            status TEXT,
            created_by TEXT,
            created_at TEXT,
            sent_at TEXT
        )
        """
    )

    # sequence steps
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS sequence_steps (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sequence_id INTEGER,
            step_index INTEGER,
            delay_hours INTEGER,
            subject TEXT,
            body TEXT,
            FOREIGN KEY(sequence_id) REFERENCES sequences(id)
        )
        """
    )

    # mapping sequence -> lead
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS sequence_leads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sequence_id INTEGER,
            lead_id INTEGER,
            FOREIGN KEY(sequence_id) REFERENCES sequences(id),
            FOREIGN KEY(lead_id) REFERENCES leads(id)
        )
        """
    )

    # activity log
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS activity_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts TEXT,
            type TEXT,
            details TEXT
        )
        """
    )

    conn.commit()
    conn.close()


def insert_lead(name: str, email: str) -> int:
    conn = get_conn()
    cur = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()
    cur.execute(
        "INSERT OR IGNORE INTO leads (name, email, created_at) VALUES (?, ?, ?)",
        (name, email, now),
    )
    conn.commit()
    cur.execute("SELECT id FROM leads WHERE email = ?", (email,))
    row = cur.fetchone()
    conn.close()
    return int(row["id"]) if row else -1


def list_leads() -> List[Dict[str, Any]]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads ORDER BY id DESC")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows


def get_lead(lead_id: int) -> Optional[Dict[str, Any]]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
    row = cur.fetchone()
    conn.close()
    return dict(row) if row else None


def update_lead(lead_id: int, name: Optional[str], email: Optional[str]) -> Optional[Dict[str, Any]]:
    conn = get_conn()
    cur = conn.cursor()
    # Build dynamic update to allow partial updates
    fields = []
    params = []
    if name is not None:
        fields.append("name = ?")
        params.append(name)
    if email is not None:
        fields.append("email = ?")
        params.append(email)
    if not fields:
        conn.close()
        return get_lead(lead_id)

    params.append(lead_id)
    try:
        cur.execute(f"UPDATE leads SET {', '.join(fields)} WHERE id = ?", tuple(params))
        conn.commit()
    except Exception:
        conn.close()
        return None
    cur.execute("SELECT * FROM leads WHERE id = ?", (lead_id,))
    row = cur.fetchone()
    conn.close()
    if row:
        log_activity("update", f"lead:{lead_id} updated")
        return dict(row)
    return None


def delete_lead(lead_id: int) -> bool:
    conn = get_conn()
    cur = conn.cursor()
    # remove any sequence_leads mappings first
    cur.execute("DELETE FROM sequence_leads WHERE lead_id = ?", (lead_id,))
    cur.execute("DELETE FROM leads WHERE id = ?", (lead_id,))
    conn.commit()
    changed = cur.rowcount > 0
    conn.close()
    if changed:
        log_activity("delete", f"lead:{lead_id} deleted")
    return changed


def claim_lead(lead_id: int, claimer: str) -> bool:
    conn = get_conn()
    cur = conn.cursor()
    ts = datetime.datetime.utcnow().isoformat()
    cur.execute(
        "UPDATE leads SET claimed_by = ?, claimed_at = ? WHERE id = ? AND claimed_by IS NULL",
        (claimer, ts, lead_id),
    )
    conn.commit()
    changed = cur.rowcount > 0
    conn.close()
    if changed:
        log_activity("claim", f"lead:{lead_id} claimed_by:{claimer}")
    return changed


def create_sequence(name: str, scheduled_at: Optional[str], created_by: Optional[str]) -> int:
    conn = get_conn()
    cur = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()
    cur.execute(
        "INSERT INTO sequences (name, scheduled_at, status, created_by, created_at) VALUES (?, ?, ?, ?, ?)",
        (name, scheduled_at, "scheduled", created_by, now),
    )
    seq_id = cur.lastrowid
    conn.commit()
    conn.close()
    if seq_id is None:
        raise RuntimeError("Failed to create sequence")
    return int(seq_id)


def add_sequence_step(sequence_id: int, step_index: int, delay_hours: int, subject: str, body: str):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO sequence_steps (sequence_id, step_index, delay_hours, subject, body) VALUES (?, ?, ?, ?, ?)",
        (sequence_id, step_index, delay_hours, subject, body),
    )
    conn.commit()
    conn.close()


def add_sequence_lead(sequence_id: int, lead_id: int):
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO sequence_leads (sequence_id, lead_id) VALUES (?, ?)",
        (sequence_id, lead_id),
    )
    conn.commit()
    conn.close()


def list_sequences() -> List[Dict[str, Any]]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM sequences ORDER BY id DESC")
    seqs = [dict(r) for r in cur.fetchall()]
    for s in seqs:
        cur.execute("SELECT * FROM sequence_steps WHERE sequence_id = ? ORDER BY step_index", (s["id"],))
        s["steps"] = [dict(r) for r in cur.fetchall()]
        cur.execute("SELECT lead_id FROM sequence_leads WHERE sequence_id = ?", (s["id"],))
        s["lead_ids"] = [r["lead_id"] for r in cur.fetchall()]
    conn.close()
    return seqs


def get_sequence(sequence_id: int) -> Optional[Dict[str, Any]]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM sequences WHERE id = ?", (sequence_id,))
    row = cur.fetchone()
    if not row:
        conn.close()
        return None
    s = dict(row)
    cur.execute("SELECT * FROM sequence_steps WHERE sequence_id = ? ORDER BY step_index", (s["id"],))
    s["steps"] = [dict(r) for r in cur.fetchall()]
    cur.execute("SELECT lead_id FROM sequence_leads WHERE sequence_id = ?", (s["id"],))
    s["lead_ids"] = [r["lead_id"] for r in cur.fetchall()]
    conn.close()
    return s


def update_sequence_status(sequence_id: int, status: str) -> bool:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("UPDATE sequences SET status = ? WHERE id = ?", (status, sequence_id))
    conn.commit()
    changed = cur.rowcount > 0
    conn.close()
    if changed:
        log_activity("sequence_status", f"sequence:{sequence_id} status:{status}")
    return changed


def add_leads_to_sequence(sequence_id: int, lead_ids: List[int]):
    for lid in lead_ids:
        add_sequence_lead(sequence_id, lid)


def get_due_sequences(now_iso: str) -> List[Dict[str, Any]]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute(
        "SELECT * FROM sequences WHERE status = 'scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= ?",
        (now_iso,),
    )
    seqs = [dict(r) for r in cur.fetchall()]
    conn.close()
    return seqs


def mark_sequence_sent(sequence_id: int):
    conn = get_conn()
    cur = conn.cursor()
    now = datetime.datetime.utcnow().isoformat()
    cur.execute("UPDATE sequences SET status = 'sent', sent_at = ? WHERE id = ?", (now, sequence_id))
    conn.commit()
    conn.close()


def get_sequence_leads(sequence_id: int) -> List[int]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT lead_id FROM sequence_leads WHERE sequence_id = ?", (sequence_id,))
    lead_ids = [r["lead_id"] for r in cur.fetchall()]
    conn.close()
    return lead_ids


def log_activity(type_: str, details: str):
    conn = get_conn()
    cur = conn.cursor()
    ts = datetime.datetime.utcnow().isoformat()
    cur.execute("INSERT INTO activity_log (ts, type, details) VALUES (?, ?, ?)", (ts, type_, details))
    conn.commit()
    conn.close()


def list_activity() -> List[Dict[str, Any]]:
    conn = get_conn()
    cur = conn.cursor()
    cur.execute("SELECT * FROM activity_log ORDER BY id DESC LIMIT 200")
    rows = [dict(r) for r in cur.fetchall()]
    conn.close()
    return rows
