from pydantic import BaseModel
from typing import List, Optional

class QuestionBase(BaseModel):
    id: int
    question_text: str
    description: Optional[str] = None
    question_type: str
    options: Optional[List[str]] = None

class RoleQuestions(BaseModel):
    role_id: int
    role_name: str
    questions: List[QuestionBase]

class ResponseCreate(BaseModel):
    role_id: int
    question_id: int
    answer: str