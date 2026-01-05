from sqlalchemy.orm import Session
from src.models.dishes import Dish

class DishRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def insert(self, dish: Dish):
        self.db.add(dish)
        self.db.commit()
        return dish