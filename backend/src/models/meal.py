from src.database import Base
from sqlalchemy.sql import func
from sqlalchemy import Column, Text, ForeignKey, Integer, DateTime, REAL, String
from sqlalchemy.orm import relationship

class Meal(Base):
    """
    Represents a meal (can include multiple dishes)
    """
    __tablename__ = "meals"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(Text)  # e.g., "Breakfast", "Afternoon snack"
    
    # Quick summary (can be calculated from Dishes)
    total_calories = Column(REAL, default=0.0)
    total_protein = Column(REAL, default=0.0)
    total_carbs = Column(REAL, default=0.0)
    total_fat = Column(REAL, default=0.0)
    
    created_at = Column(DateTime, default=func.now())
    
    # Relationship
    dishes = relationship("Dish", back_populates="meal")