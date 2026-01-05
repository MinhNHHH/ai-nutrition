"""
"""
from src.database import Base
from sqlalchemy.sql import func
from sqlalchemy import Column, Text, ForeignKey, Integer, DateTime

class AIRequestLog(Base):
    __tablename__ = "ai_request_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_id = Column(Integer, ForeignKey("images.id"))
    request = Column(Text)
    response = Column(Text)
    model_name = Column(Text)
    prompt_tokens = Column(Integer)
    completion_tokens = Column(Integer)
    total_tokens = Column(Integer)
    created_at = Column(DateTime, default=func.now())