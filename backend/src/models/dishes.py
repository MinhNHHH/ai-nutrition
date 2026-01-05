from src.database import Base
from sqlalchemy.sql import func
from sqlalchemy import Column, Text, ForeignKey, Integer, DateTime, REAL, String
from sqlalchemy.orm import relationship

class Dish(Base):
    """Details of each dish identified by AI"""
    __tablename__ = "dishes"
    id = Column(Integer, primary_key=True, index=True)
    meal_id = Column(Integer, ForeignKey("meals.id"))
    image_id = Column(Integer, ForeignKey("images.id")) # Link to the image containing this dish
    
    name = Column(Text)  # Dish name
    
    # Estimation
    portion_value = Column(REAL) # Quantity (e.g., 200)
    portion_unit = Column(String(10)) # Unit (g, ml)
    
    # Nutrition details
    calories = Column(REAL)
    protein = Column(REAL)
    carbs = Column(REAL)
    fat = Column(REAL)
    fiber = Column(REAL)
    sugar = Column(REAL)
    sodium = Column(REAL)
    
    # AI Metadata (Crucial for accuracy assessment)
    health_score = Column(REAL)       # scale 10
    confidence_score = Column(REAL)   # scale 10
    
    created_at = Column(DateTime, default=func.now())
    
    meal = relationship("Meal", back_populates="dishes")