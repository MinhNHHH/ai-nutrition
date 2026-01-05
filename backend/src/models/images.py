from src.database import Base
from sqlalchemy.sql import func
from sqlalchemy import Column, ForeignKey, Integer, DateTime, Text


class Image(Base):
    __tablename__ = "images"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    image_url = Column(Text)
    created_at = Column(DateTime, default=func.now())