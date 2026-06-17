from sqlalchemy import Column, Integer, String, Text, JSON, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from database import Base
from sqlalchemy.sql import func

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True)
    questions = relationship("Question", back_populates="role")

class Question(Base):
    __tablename__ = "questions"
    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"))
    question_text = Column(Text, nullable=False)
    description = Column(Text, nullable=True)
    question_type = Column(String(20), default="text")
    options = Column(JSON, nullable=True)
    role = relationship("Role", back_populates="questions")
    responses = relationship("Response", back_populates="question")

class Response(Base):
    __tablename__ = "responses"
    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("roles.id"))
    question_id = Column(Integer, ForeignKey("questions.id"))
    answer = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())
    question = relationship("Question", back_populates="responses")