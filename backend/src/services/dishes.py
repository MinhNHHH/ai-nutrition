from sqlalchemy.orm import Session
from src.models.dishes import Dish
from src.repositories.dishes import DishRepository

class DishService:
    def __init__(self, dish_repository: DishRepository):
        self.dish_repository = dish_repository
    
    def insert(self, dish: Dish):
        return self.dish_repository.insert(dish)