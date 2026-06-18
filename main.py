from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
import crud, schemas, models
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Navya Survey API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed minimal roles on startup so data is always available on fresh deploys
def _seed():
    db = SessionLocal()
    try:
        existing = db.query(models.Role).count()
        if existing == 0:
            for name in ["nurse", "doctor", "women18plus", "under18"]:
                db.add(models.Role(name=name))
            db.commit()
    finally:
        db.close()

@app.on_event("startup")
def startup_event():
    _seed()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/roles")
def get_roles(db: Session = Depends(get_db)):
    roles = db.query(models.Role).all()
    return [{"id": r.id, "name": r.name} for r in roles]

@app.get("/questions/{role_name}")
def get_questions(role_name: str, db: Session = Depends(get_db)):
    role = crud.get_role_by_name(db, role_name)
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    questions = crud.get_questions_for_role(db, role.id)
    return {
        "role_id": role.id,
        "role_name": role.name,
        "questions": [
            {
                "id": q.id,
                "question_text": q.question_text,
                "description": q.description,
                "question_type": q.question_type,
                "options": q.options or []
            } for q in questions
        ]
    }

@app.post("/submit")
def submit_response(response: schemas.ResponseCreate, db: Session = Depends(get_db)):
    return crud.create_response(db, response)
