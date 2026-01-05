from sqlalchemy.orm import Session
from src.models.users import User
from src.repositories.users import UserRepository

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository
    
    def insert(self, user: User):
        return self.user_repository.insert(user)