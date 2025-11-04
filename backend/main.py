from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import List, Literal, Optional, Dict
from datetime import datetime
from uuid import uuid4

app = FastAPI(title="Demo API")

# Permissive for local dev; lock down later in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://react-demo-sand-sigma.vercel.app/",  # TODO: replace with your real Vercel URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Status = Literal["Open", "In Progress", "Closed"]
Priority = Literal["Low", "Medium", "High"]

class Ticket(BaseModel):
    id: str
    title: str
    status: Status
    priority: Priority
    assignee: str
    createdAt: datetime

class TicketCreate(BaseModel):
    title: str
    status: Status
    priority: Priority
    assignee: str

class TicketUpdate(BaseModel):
    title: Optional[str] = None
    status: Optional[Status] = None
    priority: Optional[Priority] = None
    assignee: Optional[str] = None

DB: Dict[str, Ticket] = {}

def seed():
    rows = [
        ("Login bug on /auth", "Open", "High", "Alex"),
        ("Upgrade dependencies", "In Progress", "Low", "Jamie"),
        ("Add billing address field", "Closed", "Medium", "Sam"),
    ]
    now = datetime.utcnow()
    for i, (title, status, priority, assignee) in enumerate(rows, start=1001):
        t = Ticket(id=f"T-{i}", title=title, status=status, priority=priority,
                   assignee=assignee, createdAt=now)
        DB[t.id] = t

seed()

# ---- nice-to-have root + health ----
@app.get("/", include_in_schema=False)
def root():
    return RedirectResponse(url="/docs")  # or: return {"ok": True, "service": "Demo API"}

@app.get("/healthz", include_in_schema=False)
def healthz():
    return {"ok": True}

# ---- CRUD ----
@app.get("/tickets", response_model=List[Ticket])
async def list_tickets():
    return list(DB.values())[::-1]  # newest first

@app.post("/tickets", response_model=Ticket, status_code=201)
async def create_ticket(body: TicketCreate):
    t = Ticket(
        id=str(uuid4()),
        title=body.title,
        status=body.status,
        priority=body.priority,
        assignee=body.assignee,
        createdAt=datetime.utcnow(),
    )
    DB[t.id] = t
    return t

@app.put("/tickets/{ticket_id}", response_model=Ticket)
async def update_ticket(ticket_id: str, body: TicketUpdate):
    if ticket_id not in DB:
        raise HTTPException(status_code=404, detail="Not found")
    current = DB[ticket_id]
    # pydantic v2-friendly: body.model_dump(exclude_unset=True)
    updates = body.model_dump(exclude_unset=True)
    updated = current.copy(update=updates)
    DB[ticket_id] = updated
    return updated

@app.delete("/tickets/{ticket_id}")
async def delete_ticket(ticket_id: str):
    if ticket_id not in DB:
        raise HTTPException(status_code=404, detail="Not found")
    del DB[ticket_id]
    return {"ok": True}
