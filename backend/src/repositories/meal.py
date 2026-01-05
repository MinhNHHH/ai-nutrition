from sqlalchemy.orm import Session
from src.models.meal import Meal

class MealRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def insert(self, meal: Meal):
        try:
            self.db.add(meal)
            self.db.commit()
            return meal
        except Exception as e:
            self.db.rollback()
            raise e