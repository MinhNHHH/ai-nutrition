from sqlalchemy.orm import Session
from src.models.meal import Meal
from src.repositories.meal import MealRepository

class MealService:
    def __init__(self, meal_repository: MealRepository):
        self.meal_repository = meal_repository
    
    def insert(self, meal: Meal):
        return self.meal_repository.insert(meal)