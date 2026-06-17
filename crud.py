from sqlalchemy.orm import Session
from models import Role, Question, Response
from schemas import ResponseCreate

def get_role_by_name(db: Session, name: str):
    return db.query(Role).filter(Role.name == name).first()

def get_questions_for_role(db: Session, role_id: int):
    return db.query(Question).filter(Question.role_id == role_id).all()

def create_response(db: Session, response: ResponseCreate):
    db_response = Response(
        role_id=response.role_id,
        question_id=response.question_id,
        answer=response.answer
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response