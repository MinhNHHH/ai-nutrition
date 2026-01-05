from src.database import Base
from sqlalchemy.sql import func
from sqlalchemy import Column, String, Integer, DateTime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    google_id = Column(String, unique=True, index=True, nullable=True)
    profile_pic = Column(String, nullable=True)
    last_login = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())